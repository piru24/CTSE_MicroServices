# This is the SMS Microservice

Run - npm run dev

## Api End-points

### GET - localhost:8200/sms/ - test if the server is working

#### Response
{
    "message": "Ping to SMS server Successful!"
}


### POST - localhost:8200/sms/sendSms - send a sms

### Dummy service
##### Request
{
    "to":"94733209823",
    "text":"Testing sms"
}

##### Response
{
    "message": "SMS succesful!",
    "data": {
        "to": "94733209823",
        "from": "Ayu",
        "text": "Testing sms"
    }
}

##### Errors
status codes: 403, 401, 400, 500

### Vonage Service
##### Request
{
    "to":"94733209823",
    "text":"Testing sms"
}

#### Response
{
    "message": "SMS Successfully Sent!"
}
