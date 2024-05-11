const createExpressApp = require('./frameworks/http/express');
const createFirestoreClient = require('./frameworks/db/firestore');

const authRouter = require('./auth/http/auth-router')
const AuthUseCase = require('./auth/usecases/auth-usecase')

const deliveryRouter = require('./delivery/http/delivery-router')
const DeliveryUseCase = require('./delivery/usecases/delivery-usecase')
const DeliveryRepository = require('./delivery/repositories/delivery-repository')

const webhookRouter = require('./webhook/http/webhook-router')
const WebhookUseCase = require('./webhook/usecases/webhook-usecase')
const WebhookRepository = require('./webhook/repositories/webhook-repository')

const NotificationService = require('../src/services/notification-service')

const firestoreClient = createFirestoreClient()

const authUseCase = new AuthUseCase()

const webhookRepository = new WebhookRepository(firestoreClient)
const webhookUseCase = new WebhookUseCase(webhookRepository)

const notificationService = new NotificationService(webhookRepository)

const deliveryRepository = new DeliveryRepository(firestoreClient)
const deliveryUseCase = new DeliveryUseCase(deliveryRepository, notificationService)

let routers = [
  authRouter(authUseCase),
  deliveryRouter(deliveryUseCase),
  webhookRouter(webhookUseCase)
];

const app = createExpressApp(routers);
