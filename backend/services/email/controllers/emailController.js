// Dependencies
const nodemailer = require('nodemailer');

// Custom Files
const k = require("../constants");





//ping server
const pingEmailServer = async (req, res, next) => {
  var msg = "Ping to Email server Successful!";
  try {
    return res.status(200).json({ message: msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error: "+ err });
  }
};
exports.pingEmailServer = pingEmailServer;





// Send email
const sendMail = async (req, res, next) => {

  const {to, subject, message} = req.body;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: k.SERVICE_EMAIL,
      pass: k.MAIL_SERVICE_PASS
    }
  });
  
  var mailOptions = {
    from: k.SERVICE_EMAIL,
    to: to,
    subject: subject,
    text: message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      if(error.responseCode == 535){
        return res.status(401).json({
          message: "Authentication Failed!"
        });
      }else{
        return res.status(500).json(error);
      }
      
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({message: "Mail Successfully Sent!"});
    }
  });
};
exports.sendMail = sendMail;