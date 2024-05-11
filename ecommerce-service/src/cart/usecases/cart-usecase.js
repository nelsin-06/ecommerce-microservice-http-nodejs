const { Cart } = require('../entities/cart-entities')
const { CustomError } = require('../../utils/tools-handler-error-utils')

class CartUseCase {

  constructor(
    cartRepository,
    productRepository,
    storeRepository,
    userRepository,
    orderUseCase
  ) {
    this.cartRepository = cartRepository
    this.productRepository = productRepository
    this.storeRepository = storeRepository
    this.userRepository = userRepository
    this.orderUseCase = orderUseCase
  }

  async createCart(body) {

    const productsFinal = await this.checkProductsAvailable(body.products)

    const newCart = new Cart(
      body.userId,
      productsFinal,
      true
    )

    let cart = await this.cartRepository.getCartByUserId(body.userId)

    if (!cart) {
      cart = await this.cartRepository.createCart(newCart)
    } else {
      cart = await this.cartRepository.updateCart(cart.id, newCart)
    }

    return true

  }

  async getCarts() {
    return this.cartRepository.getCarts()
  }

  async getCartByUserId(userId) {

    return this.cartRepository.getCartByUserId(userId)

  }

  async buyCart(userId) {
    const cart = await this.cartRepository.getCartByUserId(userId)

    if (!cart) {
      throw new CustomError('The user dont have active cart.', 404)
    }
    const products = await this.checkProductsAvailable(cart.products)
    const storesIds = []
    const user = await this.userRepository.getUserById(userId)


    for await (const product of products) {
      if (!storesIds.includes(product.storeId)) {
        storesIds.push(product.storeId)
      }
    }

    const stores = await Promise.all(storesIds.map(storeId => this.storeRepository.getStoreByStoreId(storeId)))
    const buyOrders = []

    for (const cartProduct of cart.products) {

      const store = stores.find(store => store.id == cartProduct.storeId)
      const userOrder = {
        name: user.name,
        shippingAddres: user.name,
        id: user.id
      }

      const newOrder = {
        userId: userId,
        cartId: cart.id,
        storeId: store.id,
        product: products.find(product => product.productId == cartProduct.productId),
        store,
        user: userOrder
      }

      buyOrders.push(newOrder)

    }

    await Promise.all(buyOrders.map(order => this.orderUseCase.registerBuyOrder(order)))
    await this.cartRepository.updateCart(cart.id, { active: false })

    return true

  }

  async checkProductsAvailable(cart) {

    const productsFinal = []

    const productsAdapter = this._groupProductsByStore(cart)
    let products = []

    for await (const storeId of Object.keys(productsAdapter)) {

      const store = await this.storeRepository.getStoreByStoreId(storeId)

      if (!store) {
        throw new CustomError('some products are incorrect, please check.', 400, { productWithProblem: productsAdapter[storeId] })
      }

      const productsData = await this.productRepository.getProductsByProductsCart(storeId, productsAdapter[storeId])
      products = products.concat(productsData)
    }

    if (products.some(product => product == null)) {
      const nullIndex = products.findIndex(product => product == null)
      throw new CustomError('some products are incorrect, please check.', 400, { productWithProblem: cart[nullIndex] })
    }

    for (const productCart of cart) {
      const data = products.find(product => product.id == productCart.productId && product.storeId == productCart.storeId)

      if (data.stock < productCart.quantity) {
        throw new CustomError('The requested quantity exceeds the available stock for this product.', 400, { productWithProblem: productCart })
      }

      productsFinal.push({
        storeId: data.storeId,
        productId: data.id,
        name: data.name,
        sku: data.sku,
        quantity: productCart.quantity
      })
    }

    return productsFinal
  }

  _groupProductsByStore(products) {
    const productsByStore = {};

    products.forEach(product => {
      const { storeId, ...restProduct } = product;
      if (!productsByStore[storeId]) {
        productsByStore[storeId] = [];
      }
      productsByStore[storeId].push(restProduct);
    });

    return productsByStore;
  }
}

module.exports = CartUseCase;
