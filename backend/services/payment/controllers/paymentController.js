// Dependencies
const axios = require('axios');

// Custom Files
// const k = require("../constants");

//ping server
const pingPaymentServer = (req, res, next) => {
  var msg = "Ping to Payment server Successful!";
  try {
    return res.status(200).json({ message: msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error: "+ err });
  }
};
exports.pingPaymentServer = pingPaymentServer;




// Create Dummy Payment
const dummyCardPayment = async (req, res, next) => {
  var error;
  const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^(0[1-9]|1[0-2])\/(2\d{3})$/;
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  const mobileRegex = /^\d{11}$/;

  const {
    email,
    mobile,
    card,
    amount
  } = req.body;

  const cookie = req.headers.cookie;

  // validate email
  if (!mailRegex.test(email)) {
    error = "email";
    console.error("Invalid Email");
  }

  // validate mobile
  if (!mobileRegex.test(mobile)) {
    error = "mobile";
    console.error("Invalid Mobile number");
  }
  
  // check if card not null
  if(error == null && card == null){
    error = "card";
    console.error("Card details not available");
  }

  // check if amount not null
  if(error == null && amount == null){
    error = "amount";
    console.error("amount not specified");
  }

  // check if price is a valid input
  if(error == null && !priceRegex.test(amount)){
    error = "invalidPrice";
    console.error("Invalid Price");
  }

  // check if card details not null
  if(
    error == null && (
    card.number == null || 
    card.expiration == null ||
    card.cvv == null ||
    card.name == null )
  ){
    error ="details";
    console.error("Card details not complete");
  }

  // check card expiration date format
  if (error == null && !dateRegex.test(card.expiration)) {
    error = "expformat";
    console.error("Card Expiration date format error");
  }

  // check if card not expired
  if(!error){
    const [expMonth, expYear] = card.expiration.split('/');
    const currentDate = new Date();
    const cardExpirationDate = new Date(`${expYear}-${expMonth}-01T00:00:00`);

    if (cardExpirationDate < currentDate) {
      error = "expired"
      console.error("Card is expired");
    }
  }
  
  // responses
  if(error){
    switch(error){
      case "email": return res.status(400).json({err: "Invalid email"});
      case "mobile": return res.status(400).json({err: "Invalid mobile number"});
      case "card": return res.status(400).json({err: "Card details required"});
      case "amount": return res.status(400).json({err: "Amount required"});
      case "invalidPrice": return res.status(400).json({err: "Invalid Price"});
      case "details": return res.status(400).json({err: "Incomplete card details"});
      case "expformat": return res.status(400).json({err: "Incorrect expiration date format, format: MM/YYYY" });
      case "expired": return res.status(422).json({err: "Card expired"});
      default: return res.status(500).json({err: "Unknown Error"});
    };
  }else{
    console.log("Payment SuccessFul");

    const config = {
      headers: {
        Cookie: cookie
      }
    };

    const emaildata = {
      "to": email,
      "subject": "Payment Received",
      "message": `Your Transaction of Rs.${amount} to Food@Door is complete`
    };

    const smsData = {
      to: "94721199970",
      text: `Your Payment of Rs.${amount} was received by Food@door`
    }
    
    const emailResult = await axios.post("http://localhost:3000//email/sendMail", emaildata, config);
    const smsResult = await axios.post("http://localhost:3000//sms/sendSms", smsData, config);

    const emailSuccess = emailResult.status == 200 ? "PASS" : "FAIL";
    const smsSuccess = smsResult.status == 200 ? "PASS" : "FAIL";

    return res.status(200).json({
      message: "Payment successful. Rs."+ amount,
      email: emailSuccess,
      sms: smsSuccess
    });
  }

};
exports.dummyCardPayment = dummyCardPayment;