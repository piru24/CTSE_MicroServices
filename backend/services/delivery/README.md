# This is the Delivery Microservice

Run - npm run dev

## Api End-points

### GET - localhost:8300/delivery/ - test if the server is working

#### Response
{
    "message": "Ping to Delivery server Successful!"
}


### POST - localhost:8300/delivery/rate - send a mail

#### Request
{
    "shipfrom":"negombo",
    "shipto": "colombo",
    "weight": 1.8
}

#### Response
{
    "distance": 38,
    "fastDelivery": {
        "rate": 2100,
        "duration": 2.25,
        "durationUnit": "hrs"
    },
    "cheapDelivery": {
        "rate": 500,
        "duration": 2,
        "durationUnit": "days"
    }
}