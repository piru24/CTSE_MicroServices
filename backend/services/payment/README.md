# Payment Microservice (E-commerce)

Run: `npm start`

## Config (optional .env)

- `STORE_NAME` – Name shown in receipts/emails (default: `E-Store`)
- `RABBITMQ_URL` – RabbitMQ broker URL (default: `amqp://localhost:5672`)

## API Endpoints

### GET `/payment/` – Health check

**Response**
```json
{ "message": "Ping to Payment server Successful!" }
```

### POST `/payment/card` – Card payment (auth required, buyer role)

**Request**
```json
{
  "email": "customer@example.com",
  "mobile": "94763309823",
  "card": {
    "number": "9874156298453216",
    "expiration": "05/2028",
    "cvv": "894",
    "name": "Customer Name"
  },
  "amount": 500.00,
  "orderId": "optional-order-id-for-ecommerce"
}
```

**Response (success)**
```json
{
  "message": "Payment successful",
  "status": "SUCCESS",
  "transactionId": "TXN_A1B2C3D4E5F6G7H8",
  "orderId": "optional-order-id-or-null",
  "amount": 500,
  "email": "PASS",
  "sms": "PASS"
}
```

- `orderId`: optional; send when paying for an existing order so it appears in email/SMS and response.
- Email/SMS use `STORE_NAME` and include `transactionId` (and `orderId` when provided).
- Payment service sends events to RabbitMQ queues:
  - `notification.email`
  - `notification.sms`
