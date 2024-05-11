const createExpressApp = require('./frameworks/http/express');
const createFirestoreClient = require('./frameworks/db/firestore');

const userRouter = require('./user/http/user-router')
const UserUseCase = require('./user/usecases/user-usecase')
const UserRepository = require('./user/repositories/user-repository')

const authRouter = require('./auth/http/auth-router')
const AuthUseCase = require('./auth/usecases/auth-usecase')

const storeRouter = require('./store/http/store-router')
const StoreUseCase = require('./store/usecases/store-usecase')
const StoreRepository = require('./store/repositories/store-repository')

const productRouter = require('./product/http/product-router')
const ProductUseCase = require('./product/usecases/product-usecase')
const ProductRepository = require('./product/repositories/product-repository')

const cartRouter = require('./cart/http/cart-router')
const CartUseCase = require('./cart/usecases/cart-usecase')
const CartRepository = require('./cart/repositories/cart-repository')

const orderRouter = require('./order/http/order-router')
const OrderUseCase = require('./order/usecases/order-usecase')
const OrderRepository = require('./order/repositories/order-repository')

const webhookRouter = require('./webhook/http/webhook-router')
const WebhookUseCase = require('./webhook/usecases/webhook-usecase')

const DeliveryService = require('./services/delivery-service')

const SeederUseCase = require('./seeder/usecases/seeder-usecase')
const SeederRouter = require('./seeder/http/seeder-router')
const firestoreClient = createFirestoreClient();

const userRepository = new UserRepository(firestoreClient)
const storeRepository = new StoreRepository(firestoreClient)
const producRepository = new ProductRepository(firestoreClient)
const cartRepository = new CartRepository(firestoreClient)
const orderRepository = new OrderRepository(firestoreClient)

const deliveryService = new DeliveryService()

const userUseCase = new UserUseCase(userRepository);
const authUseCase = new AuthUseCase(userRepository)
const storeUseCase = new StoreUseCase(storeRepository, userRepository)
const productUseCase = new ProductUseCase(producRepository, storeRepository)
const orderUseCase = new OrderUseCase(orderRepository, producRepository, cartRepository, deliveryService, userRepository)
const cartUseCase = new CartUseCase(cartRepository, producRepository, storeRepository, userRepository, orderUseCase)
const webhookUseCase = new WebhookUseCase(orderRepository)

const seederUseCase = new SeederUseCase(
  producRepository, 
  storeRepository,
  userRepository
)

let routers = [
  userRouter(userUseCase),
  authRouter(authUseCase),
  storeRouter(storeUseCase),
  productRouter(productUseCase),
  cartRouter(cartUseCase, producRepository),
  orderRouter(orderUseCase),
  webhookRouter(webhookUseCase),
  SeederRouter(seederUseCase)
];

const app = createExpressApp(routers);
