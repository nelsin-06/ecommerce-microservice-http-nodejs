const { Delivery } = require('../entities/delivery-entities')
const { v4: uuidv4 } = require('uuid')
const { DeliveryStates } = require('../entities/delivery-entities')

class DeliveryUseCase {

  constructor(deliveryRepository, notificationService) {
    this.deliveryRepository = deliveryRepository,
      this.notificationService = notificationService
  }

  async createDelivery(delivery) {

    const newDelivery = new Delivery(
      delivery.order,
      delivery.origin,
      delivery.destination,
      uuidv4(),
      DeliveryStates.READY_FOR_PICK_UP,
      Date.now(),
      new Date(Date.now()),
      true
    )

    const deliveryCreated = await this.deliveryRepository.createDelivery(newDelivery)

    await this.notificationService.sendNotificationDeliveryStatusUpdate([deliveryCreated])

    return deliveryCreated

  }

  async getDeliveryHistory(body) {

    const historyDelivery = await this.deliveryRepository.getDeliveryHistory(body.orderId, body.trackingNumber)
    historyDelivery.sort((a, b) => b.updatedAt - a.updatedAt);
    let deliveryAdapter = historyDelivery

    if (historyDelivery.length) {

      deliveryAdapter = {
        trackingNumber: body.trackingNumber,
        status: historyDelivery[0].status,
        tracking: historyDelivery.map(delivery => {
          return {
            delivery: delivery.status,
            date: delivery.date
          }
        })
      }

    }

    return deliveryAdapter

  }

  async getDeliveryUnfinished() {
    return await this.deliveryRepository.getDeliveryUnfinished()
  }

  async getDeliveryActive() {
    return await this.deliveryRepository.getDeliveryActive()
  }

  async getDeliveryDetail(body) {
    return await this.deliveryRepository.getDeliveryDetail(body)
  }

}

module.exports = DeliveryUseCase;
