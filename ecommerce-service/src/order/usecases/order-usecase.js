const { Order, OrderStates } = require('../entities/order-entities')
const { CustomError } = require('../../utils/tools-handler-error-utils')
const checkValidStatesSearchOrder = require('../middleware/buyorder-middleware')


class OrderUseCase {

  constructor(orderRepository, producRepository, cartRepository, deliveryService, userRepository) {
    this.orderRepository = orderRepository
    this.producRepository = producRepository
    this.cartRepository = cartRepository
    this.deliveryService = deliveryService
    this.userRepository = userRepository
  }

  async registerBuyOrder(newOrder) {

    const orderFinal = new Order(
      newOrder.userId,
      newOrder.cartId,
      newOrder.storeId,
      newOrder.product,
      newOrder.store,
      newOrder.user,
      OrderStates.created
    )

    const order = await this.orderRepository.registerOrder(orderFinal)

    await this.producRepository.updateStockProduct(newOrder.storeId, newOrder.product.productId, Number(newOrder.product.quantity) * -1)
    
    return order

  }

  async searchOrders(state, userRole, userId, storeId) {

    if (state) {
      checkValidStatesSearchOrder(state, userRole)
    }

    return await this.orderRepository.searchOrders(state, userRole, userId, storeId)
  }

  async changeStateOrder(orderId, state, storeId) {

    let checkError = false
    const order = await this.orderRepository.getOrderByOrderId(orderId)

    if (!order) {
      throw new CustomError('The order dont exist.', 404)
    }

    if (order.storeId != storeId) {
      throw new CustomError('The order does not belong to you', 400)
    }

    const user = await this.userRepository.getUserById(order?.userId)

    if (order?.state == OrderStates.created) {
      checkError = state != OrderStates.confirmed
    } else if (order?.state == OrderStates.confirmed) {
      checkError = state != OrderStates.dispatched
    } else {
      checkError = true
    }

    if (checkError) {
      throw new CustomError('the state is incorrect. - created => confirmed => dispatched', 400)
    }

    await this.orderRepository.changeStateOrder(orderId, state)

    if (state == OrderStates.dispatched) {

      const delivery = {
        order: {
          orderId: order.id,
          products: order.product,
        },
        origin: {
          storeId: order.store.id,
          warehouseAddress: order.store.warehouseAddress,
          userSellerId: order.store.userSellerId
        },
        destination: {
          userId: user.id,
          shippingAddres: user.shippingAddres,
          name: user.name
        }
      }

      const response = await this.deliveryService.createDelivery(delivery)
      await this.orderRepository.updateOrder(orderId, { trackingNumber: response?.data?.trackingNumber })

    }

    return true
  }


  async cancelOrder(orderId) {

    const order = await this.orderRepository.getOrderByOrderId(orderId)

    if (!order) {
      throw new CustomError('the order dont exist.', 404)
    }

    if (order.state == OrderStates.created || order.state == OrderStates.confirmed) {

      await this.orderRepository.updateOrder(orderId, { state: OrderStates.cancelled })

      await this.producRepository.updateStockProduct(order.store.id, order.product.productId, Number(order.product.quantity))

    } else if (order.state == OrderStates.cancelled) {
      throw new CustomError('The order is already cancelled.', 400)
    } else {
      throw new CustomError('The order can no longer be cancelled as it is in an advanced stage.', 400)
    }

    return true

  }


  async getTrakingOrder(orderId) {

    const order = await this.orderRepository.getOrderByOrderId(orderId)
    
    if (!order) {
      throw new CustomError('the order dont exist.', 404)
    }

    if(!order.trackingNumber) {
      throw new CustomError('the order dont have tracking.', 404)

    }

    const data = await this.deliveryService.getHistoryDelivery(order.id, order.trackingNumber)
    return data

  }

}

module.exports = OrderUseCase;
