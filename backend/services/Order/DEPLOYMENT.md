# Order Service Cloud Deployment Notes

## Recommended platform
Use Azure Container Apps for the easiest managed-container student setup.

## Required environment variables
- NODE_ENV=production
- PORT=8020
- MONGO_URI=<cloud mongo connection string>
- JWT_SECRET=<jwt secret>
- RABBITMQ_URL=<cloud rabbitmq endpoint>
- STRIPE_SECRET_KEY=<stripe key if payment endpoint is used>
- CORS_ORIGIN=<frontend domain, comma separated if needed>
- PRODUCT_SERVICE_URL=<products service base URL, e.g. https://products-service.<domain>/products>

## Probes for demo evidence
- Liveness: GET /order/health
- Readiness: GET /order/ready

## Suggested deploy flow
1. Build and push image from CI (`<docker-user>/order-service:<commit-sha>`).
2. Create Azure Container Apps environment.
3. Deploy with `deploy/azure-containerapp.yaml`.
4. Set all secrets and env values in Container App.
5. Verify:
   - GET /order/health => 200
   - GET /order/ready => 200
   - POST /order with valid token and product IDs => 201
6. Check logs to verify Product Service REST validation and RabbitMQ event publishing.

## Cloud dependency notes
- MongoDB: use Atlas or managed Mongo endpoint.
- RabbitMQ: use CloudAMQP or managed RabbitMQ.
- Product service URL must be reachable from Order container.
