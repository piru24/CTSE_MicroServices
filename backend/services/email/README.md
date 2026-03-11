# This is the Email Microservice

Run - npm run dev

## Api End-points

### GET - localhost:8100/email/ - test if the server is working

#### Response
{
    "message": "Ping to Email server Successful!"
}


### POST - localhost:8100/email/sendMail - send a mail

#### Request
{
    "to": "kjpriyanthafdo@gmail.com",
    "subject": "test2",
    "message": "asdfdf asdf "
}

#### Response
{
    "message": "Mail Successfully Sent!"
}