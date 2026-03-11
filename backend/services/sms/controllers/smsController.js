// Dependencies
const {Vonage} = require('@vonage/server-sdk');

// Custom Files
const k = require("../constants");

//ping server
const pingSmsServer = async (req, res, next) => {
  var msg = "Ping to SMS server Successful!";
  try {
    return res.status(200).json({ message: msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error: "+ err });
  }
};
exports.pingSmsServer = pingSmsServer;


// Send sms (Vonage)
const sendSms = async (req, res, next) => {

  const {to, text} = req.body;

  const vonage = new Vonage({
    apiKey: k.KEY,
    apiSecret: k.SECRET
  });
  const from = k.FROM;

  async function sendSMS() {
    await vonage.sms.send(
      {to, from, text}

    ).then(
      resp => { 
        console.log('Message sent successfully');
        console.log(resp);
        return res.status(200).json({message: "SMS Successfully Sent!"});
      }

    ).catch(
      err => {
        console.log('There was an error sending the messages.');
        console.error(err);
        return res.status(500).json(err);
      }
    );
  }

  sendSMS();
};
exports.sendSms = sendSms;


// Send Dummy sms
const sendDummySms = async (req, res, next) => {

  const {to, text} = req.body;

  const from = k.FROM;

  function invalidMobile(mobileNumber){
    const regex = /^\d{11}$/;
    return !regex.test(mobileNumber);
  }

  async function sendSMS() {
    var data = {
      "to": to,
      "from": from,
      "text": text
    };

    var reason, code, isError;

    if(k.SIMULATE_SERVER_ERROR){
      isError = true;
      reason = "Internal Server Error";
      code = 500;
    }else if(to == null){
      isError = true;
      reason = "'to' is required. Received null";
      code = 400;
    }else if(text == null){
      isError = true;
      reason = "'text' is required. Received null";
      code = 400;
    }else if(invalidMobile(to)){
      isError = true;
      reason = "Invalid or Bad Format Mobile Number. Required Format Example: 94770000000";
      code = 400;
    }else{
      isError = false;
    }

    setTimeout(()=>{
      if(isError){
        return res.status(code).json({
          message: "SMS Failed!",
          reason: reason,
          data: data
        });
      }else{
        return res.status(200).json({
          message: "SMS succesful!",
          data: data
        });
      }
    }, 2000);
  }

  sendSMS();
};
exports.sendDummySms = sendDummySms;