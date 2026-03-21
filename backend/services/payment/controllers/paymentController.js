// Dependencies
const axios = require("axios");

// Ping server
const pingPaymentServer = (req, res) => {
  return res.status(200).json({
    message: "Ping to Payment server Successful!"
  });
};

exports.pingPaymentServer = pingPaymentServer;


// Dummy Card Payment
const dummyCardPayment = async (req, res) => {

  console.log("REQUEST BODY RECEIVED:");
  console.log(req.body);

  let error;

  const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^(0[1-9]|1[0-2])\/(2\d{3})$/;
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  const mobileRegex = /^\d{10,11}$/;

  const { email, mobile, card, amount } = req.body;

  // EMAIL
  if (!mailRegex.test(email)) error = "email";

  // MOBILE
  if (!error && !mobileRegex.test(mobile)) error = "mobile";

  // CARD
  if (!error && !card) error = "card";

  // AMOUNT
  if (!error && !amount) error = "amount";

  // PRICE
  if (!error && !priceRegex.test(amount)) error = "invalidPrice";

  // CARD DETAILS
  if (!error && (!card.number || !card.expiration || !card.cvv || !card.name))
    error = "details";

  // EXPIRATION FORMAT
  if (!error && !dateRegex.test(card.expiration))
    error = "expformat";

  // CARD EXPIRY CHECK
  if (!error) {
    const [expMonth, expYear] = card.expiration.split("/");
    const currentDate = new Date();
    const cardExpirationDate = new Date(`${expYear}-${expMonth}-01`);

    if (cardExpirationDate < currentDate) error = "expired";
  }

  // ERROR RESPONSES
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

  console.log("Payment Successful");

  return res.status(200).json({
    message: "Payment successful"
  });

};

exports.dummyCardPayment = dummyCardPayment;