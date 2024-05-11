const { serializeData } = require('../../utils/tools-db-utils')
const { DeliveryDocument, DeliveryStates } = require('../entities/delivery-entities')
// Implementación con Firestore para el repositorio de ${entity}.
// Recibe la conexión con Firestore externamente.

class DeliveryRepository {

  constructor(firestoreClient, test = false) {

    this.collectionName = 'delivery'

    if (test) {
      this.collectionName += "_test"
    }

    this.DeliveryCollectionRef = firestoreClient.collection(this.collectionName)
    this.test = test

  }

  _getDeliveryFromDocument(doc) {

    const id = doc.id;
    const data = doc.data();

    return new DeliveryDocument(
      id,
      data.order,
      data.origin,
      data.destination,
      data.trackingNumber,
      data.status,
      data.updatedAt,
      data.date,
      data.active
    )

  }

  async createDelivery(newDelivery) {

    const delivery = await this.DeliveryCollectionRef.add(serializeData(newDelivery))

    return this._getDeliveryFromDocument(await delivery.get())

  }

  async updateDelivery(deliveryId, updateDelivery) {

    const delivery = await this.DeliveryCollectionRef.doc(deliveryId).update(updateDelivery)

    return delivery

  }

  async getDeliveryHistory(orderId, trackingNumber) {

    const deliveryHistory = await this.DeliveryCollectionRef
      .where('order.orderId', '==', orderId)
      .where('trackingNumber', '==', trackingNumber)
      .get()

    if (deliveryHistory.empty) return []

    return deliveryHistory.docs.map(data => this._getDeliveryFromDocument(data))

  }

  async getDeliveryUnfinished() {

    const deliveryHistory = await this.DeliveryCollectionRef
      .where('status', '!=', DeliveryStates.DELIVERED)
      .where('active', '==', true)
      .get()

    if (deliveryHistory.empty) return []

    return deliveryHistory.docs.map(data => this._getDeliveryFromDocument(data))

  }

  async createManyUpdateDelivery(deliveriesUpdate) {

    await Promise.all(deliveriesUpdate.map(delivery => this.createDelivery(delivery)))

    return true

  }


  async disableOldDeliveryStatus(deliveriesUpdate) {

    await Promise.all(deliveriesUpdate.map(delivery => this.updateDelivery(delivery.id, { active: false })))

    return true

  }

  async getDeliveryActive() {

    const deliveries = await this.DeliveryCollectionRef
      .where('active', '==', true)
      .get()

    if (deliveries.empty) return []

    return deliveries.docs.map(data => this._getDeliveryFromDocument(data))

  }

  async getDeliveryDetail(body) {

    const delivery = await this.DeliveryCollectionRef
      .where('order.orderId', '==', body.orderId)
      .where('trackingNumber', '==', body.trackingNumber)
      .get()

    if (delivery.empty) return []

    return this._getDeliveryFromDocument(delivery.docs[0])

  }

}

module.exports = DeliveryRepository;
