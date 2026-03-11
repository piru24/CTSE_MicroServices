# This is the Payment Microservice

Run - npm run dev

## Api End-points

### GET - localhost:8500/payment/ - test if the server is working

#### Response
{
    "message": "Ping to Payment server Successful!"
}


### POST - localhost:8500/payment/card - make a payment using card

#### Request
{
    "email":"kjpfernandohurricane@gmail.com",
    "mobile":94763309823,
    "card": {
        "number":9874156298453216,
        "expiration": "05/2025",
        "cvv": 894,
        "name": "Priyantha"
    },
    "amount": 500.00
}

#### Response
{
    "message": "Payment successful. Rs.500",
    "email": "PASS",
    "sms": "PASS"
}