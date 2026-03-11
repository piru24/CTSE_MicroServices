// Dependencies
const axios = require('axios');

// Custom Files
const k = require("../constants");

// const Order = require("../../../Order/models/Order"); 
const AcceptedDelivery = require('../model/AcceptedDelivery');
const Delivery = require('../../delivery/model/delivery');


//ping server
const pingDeliveryServer = async (req, res, next) => {
  var msg = "Ping to Delivery server Successful!";
  try {
    return res.status(200).json({ message: msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error: "+ err });
  }
};
exports.pingDeliveryServer = pingDeliveryServer;





// Get Rates
const getRate = async(req, res, next) => {
  const {shipfrom, shipto, weight} = req.body;

  if(shipfrom == null || shipto == null || weight == null)
    return res.status(460).json({ message: "Required data missing" });

  var fromCoordinates;
  var toCoordinates;
  var duration;
  var distance;

  try{
    const fromResults = await getCoordinates(shipfrom);
    if(fromResults.status == "ok")
      fromCoordinates = [fromResults.coordinates[0],fromResults.coordinates[1]];
    else if(fromResults.status == "error")
      return res.status(461).json({ message: "Store address not found" });

    const toResults = await getCoordinates(shipto);
    if(toResults.status == "ok")
      toCoordinates = [toResults.coordinates[0],toResults.coordinates[1]];
    else if(toResults.status == "error")
      return res.status(462).json({ message: "Client address not found" });
      
    const distanceDuration = await getDistanceDuration(fromCoordinates, toCoordinates);
    if(distanceDuration.status == "bad")
      return res.status(463).json({ message: "Out of range" });
    else if(distanceDuration.status == "error")
      return res.status(520).json({ message: distanceDuration.error });
    else if(distanceDuration.status == "ok"){
      duration = Math.ceil((distanceDuration.duration / 3600) / 0.25) * 0.25; // sec -> hrs (multiple of 0.25hrs)
      if(duration < 0.25)
        duration = 0.25;
      duration += 1.5; // add safe margin for delivery

      distance = Math.ceil((distanceDuration.distance / 1000) / 0.5) * 0.5; // meters -> km (multiple of 0.5km)
      if(distance < 0.5)
        distance = 0.5;
      console.log(duration, distance, weight);

      var fastRate = distance * 50 + weight * 100;
      fastRate = Math.ceil(fastRate / 50) * 50;
      if(fastRate < 800)
        fastRate = 800;

      var cheapRate = (distanceDuration.distance / 1000) * 50 + weight * 50;
      cheapRate = Math.ceil(cheapRate / 10);
      if(cheapRate < 500)
        cheapRate = 500;

      const days = Math.ceil(duration / 24) + 1;

      return res.status(200).json({
        distance: distance,
        fastDelivery: {
          rate: fastRate,
          duration: duration,
          durationUnit: "hrs"
        },
        cheapDelivery: {
          rate: cheapRate,
          duration: days,
          durationUnit: "days"
        }
      });

    }
  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Server Error: "+ err });
  }

};
exports.getRate = getRate;





//Custom function to retrieve coordinates
async function getCoordinates(address){
  try{
    const response = await axios.get(`${k.GEOCODE_URL_PREFIX}${address}${k.GEOCODE_URL_SUFFIX}`);
    const coordinates = response.data.features[0].geometry.coordinates;
    return {"status":"ok","coordinates": coordinates};
  }catch(e){
    return {"status":"error", "error": e};
  }
}

//Custom function to retrieve duration
async function getDistanceDuration(location1, location2){
  try{
    const config = {
      headers: {
        Authorization : k.API_KEY
      }
    };

    const data = {
      locations: [location1,location2],
      metrics: ["distance","duration"]
    };
    
    const response = await axios.post(k.DURATION_URL, data, config);
    const duration = response.data.durations[0][1];
    const distance = response.data.distances[0][1];

    if(duration == null || distance == null)
      return {"status":"bad","msg": "cannot be reached"};
    else
      return {"status":"ok","duration": duration, "distance": distance};
  }catch(e){
    console.log(e);
    return {"status":"error", "error": e};
  }
}

//
// Accept Delivery
const acceptDelivery = async (req, res) => {
  const { orderId } = req.body;
  const driverId = req.user?.id || "64fe5b1234567890abcd1234"; // Replace with req.user.id if you use Auth

  try {
    const alreadyAccepted = await AcceptedDelivery.findOne({ orderId });
    if (alreadyAccepted) {
      return res.status(400).json({ message: "This order has already been accepted." });
    }

    const newAccepted = new AcceptedDelivery({
      orderId,
      driverId,
      status: "On the way"
    });

    await newAccepted.save();

    return res.status(200).json({ message: "Order accepted successfully", accepted: newAccepted });
  } catch (err) {
    console.error("Accept Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.acceptDelivery = acceptDelivery;
