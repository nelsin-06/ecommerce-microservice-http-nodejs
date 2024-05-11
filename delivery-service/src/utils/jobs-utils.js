const DeliveryRepository = require('../delivery/repositories/delivery-repository')
const { DeliveryStates } = require('../delivery/entities/delivery-entities')
const createFirestoreClient = require('../frameworks/db/firestore');
const EcommerceService = require('../services/ecommerce-service')
const NotificationService = require('../services/notification-service');
const WebhookRepository = require('../webhook/repositories/webhook-repository');
const firestoreClient = createFirestoreClient()

const deliveryRepository = new DeliveryRepository(firestoreClient)
const webhookRepository = new WebhookRepository(firestoreClient)
const ecommerceService = new EcommerceService()
const notificationService = new NotificationService(webhookRepository)

async function changeStateDelivery() {
    try {

        const deliveriesUnfinished = await deliveryRepository.getDeliveryUnfinished()

        const newDeliveryStatus = []
        const ordersIdsDeliveryFinished = []

        if (deliveriesUnfinished.length > 0) {
            for (const deliveryUnfinished of deliveriesUnfinished) {
                let status = getNextStatus(deliveryUnfinished.status)

                if (status == DeliveryStates.DELIVERED) {
                    ordersIdsDeliveryFinished.push(deliveryUnfinished.order.orderId)
                }

                const updatedAt = Date.now()

                const newDeliveryunfinished = {
                    ...deliveryUnfinished,
                    status,
                    updatedAt,
                    date: new Date(updatedAt)
                }

                newDeliveryStatus.push(newDeliveryunfinished)

            }

            await deliveryRepository.createManyUpdateDelivery(newDeliveryStatus)
            await notificationService.sendNotificationDeliveryStatusUpdate(newDeliveryStatus)
            await deliveryRepository.disableOldDeliveryStatus(deliveriesUnfinished)
            await ecommerceService.notifyOrderDelivered(ordersIdsDeliveryFinished)
        }

    } catch (error) {

        console.log({
            message: `ERROR : job changeStateDelivery : ${new Date(Date.now())}`,
            error
        })

    }

}

function getNextStatus(currentState) {
    switch (currentState) {
        case DeliveryStates.READY_FOR_PICK_UP:
            return DeliveryStates.AT_ORIGIN;
        case DeliveryStates.AT_ORIGIN:
            return DeliveryStates.EN_ROUTE_OF_DELIVERY;
        case DeliveryStates.EN_ROUTE_OF_DELIVERY:
            return Math.random() < 0.5 ? DeliveryStates.NOT_DELIVERED : DeliveryStates.DELIVERED;
        case DeliveryStates.NOT_DELIVERED:
            return DeliveryStates.EN_ROUTE_OF_DELIVERY;
        default:
            return currentState;
    }
}


module.exports = changeStateDelivery




