// Dependencies
const crypto = require("crypto");
const { publishToQueue } = require("../messaging/rabbitmqPublisher");
const Payment = require("../models/payment");

require("dotenv").config();

// E-commerce config (env or defaults)
const STORE_NAME = process.env.STORE_NAME || "E-Store";

// Ping server
const pingPaymentServer = (req, res) => {
  return res.status(200).json({
    message: "Ping to Payment server Successful!"
  });
};
exports.pingPaymentServer = pingPaymentServer;

// Create payment (e-commerce: card payment with optional order reference)
const dummyCardPayment = async (req, res) => {
  let error;
  const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^(0[1-9]|1[0-2])\/(2\d{3})$/;
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  const mobileRegex = /^\d{10,11}$/;

  const { email, mobile, card, amount, orderId } = req.body;
  const cookie = req.headers.cookie;

  if (!mailRegex.test(email)) error = "email";
  if (!error && !mobileRegex.test(mobile)) error = "mobile";
  if (!error && !card) error = "card";
  if (!error && !amount) error = "amount";
  if (!error && !priceRegex.test(amount)) error = "invalidPrice";
  if (!error && (!card.number || !card.expiration || !card.cvv || !card.name)) {
    error = "details";
  }
  if (!error && !dateRegex.test(card.expiration)) error = "expformat";

  if (!error) {
    const [expMonth, expYear] = card.expiration.split("/");
    const currentDate = new Date();
    const cardExpirationDate = new Date(`${expYear}-${expMonth}-01`);
    if (cardExpirationDate < currentDate) error = "expired";
  }

  if (error) {
    switch (error) {
      case "email":
        return res.status(400).json({ err: "Invalid email" });
      case "mobile":
        return res.status(400).json({ err: "Invalid mobile number" });
      case "card":
        return res.status(400).json({ err: "Card details required" });
      case "amount":
        return res.status(400).json({ err: "Amount required" });
      case "invalidPrice":
        return res.status(400).json({ err: "Invalid price" });
      case "details":
        return res.status(400).json({ err: "Incomplete card details" });
      case "expformat":
        return res.status(400).json({ err: "Expiration format MM/YYYY" });
      case "expired":
        return res.status(422).json({ err: "Card expired" });
      default:
        return res.status(500).json({ err: "Unknown error" });
    }
  }

  const transactionId = "TXN-" + crypto.randomBytes(8).toString("hex").toUpperCase();
  const orderRef = orderId ? ` Order #${orderId}.` : "";

  console.log("Payment successful", { transactionId, orderId, amount });

  const emailData = {
    to: email,
    subject: `Payment received - ${STORE_NAME}`,
    message: `Your payment of Rs.${amount} to ${STORE_NAME} is complete.${orderRef} Transaction ID: ${transactionId}. Thank you for shopping with us.`,
    transactionId,
    orderId: orderId || null,
    source: "payment-service"
  };

  const smsData = {
    to: mobile || "94721199970",
    text: `${STORE_NAME}: Payment of Rs.${amount} received.${orderRef} Ref: ${transactionId}`,
    transactionId,
    orderId: orderId || null,
    source: "payment-service"
  };

  let emailSuccess = "FAIL";
  let smsSuccess = "FAIL";

  try {
    await publishToQueue("notification.email", { ...emailData, cookie });
    emailSuccess = "QUEUED";
  } catch (e) {
    console.warn("Email event publish failed:", e.message);
  }

  try {
    await publishToQueue("notification.sms", { ...smsData, cookie });
    smsSuccess = "QUEUED";
  } catch (e) {
    console.warn("SMS event publish failed:", e.message);
  }

  try {
    await Payment.create({
      transactionId,
      orderId: orderId || null,
      email,
      mobile,
      amount: Number(amount),
      cardLast4: String(card.number).slice(-4),
      status: "SUCCESS",
      emailNotification: emailSuccess,
      smsNotification: smsSuccess
    });
  } catch (e) {
    console.warn("Payment DB save failed:", e.message);
  }

  return res.status(200).json({
    message: "Payment successful",
    status: "SUCCESS",
    transactionId,
    orderId: orderId || null,
    amount: Number(amount),
    email: emailSuccess,
    sms: smsSuccess
  });
};

exports.dummyCardPayment = dummyCardPayment;