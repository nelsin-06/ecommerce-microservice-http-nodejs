const { CustomError } = require('../../utils/tools-handler-error-utils');
const { UserPotencialActions } = require('../../user/entities/user-entities');
const { OrderStates } = require('../../order/entities/order-entities')


class WebhookUseCase {

  constructor(orderRepository) {
    this.orderRepository = orderRepository
  }

  async updateStateOrder(orderId) {

    return await this.orderRepository.changeStateOrder(orderId, OrderStates.delivered)

  }

}

module.exports = WebhookUseCase;
