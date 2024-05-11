const { OrderDocument } = require('../entities/order-entities')
const { serializeData } = require('../../utils/tools-db-utils')
const { UserPotencialActions } = require('../../user/entities/user-entities')
// Implementación con Firestore para el repositorio de ${entity}.
// Recibe la conexión con Firestore externamente.

class OrderRepository {

  constructor(firestoreClient, test = false) {

    this.collectionName = 'order'

    if (test) {
      this.collectionName += "_test"
    }

    this.OrdertCollectionRef = firestoreClient.collection(this.collectionName)
    this.test = test

  }

  _getOrderFromDocument(doc) {

    const id = doc.id;
    const data = doc.data()

    return new OrderDocument(id, data.userId, data.cartId, data.storeId, data.product, data.store, data.user, data.state, data?.trackingNumber)

  }

  async registerOrder(newOrder) {

    const store = await this.OrdertCollectionRef.add(serializeData(newOrder))

    return this._getOrderFromDocument(await store.get())

  }

  async searchOrders(state, userRole, userId, storeId) {
    let query = this.OrdertCollectionRef

    if (state) {
      query = query.where('state', '==', state)
    }

    if (userRole == UserPotencialActions.marketplaceUser) {
      query = query.where('userId', '==', userId)
    }

    if (userRole == UserPotencialActions.sellerUser) {
      query = query.where('storeId', '==', storeId)
    }

    let orders = await query.get()

    if (orders.empty) return []

    return orders.docs.map(order => this._getOrderFromDocument(order))

  }

  async getOrderByOrderId(orderId) {

    const order = await this.OrdertCollectionRef.doc(orderId).get()

    if (!order.exists) return null

    return this._getOrderFromDocument(order)

  }

  async changeStateOrder(orderId, state) {

    await this.OrdertCollectionRef.doc(orderId).update({
      state
    })

    return true
  }

  async updateOrder(orderId, updateOrder) {

    await this.OrdertCollectionRef.doc(orderId).update(serializeData(updateOrder))

    return true
  }


  async deleteOrder(orderId) {

    await this.OrdertCollectionRef.doc(orderId).delete()

    return true

  }

  async deleteAllOrders() {
    if (this.test) {
      const orders = await this.getOrders()
      for await (const order of orders) {
        await this.deleteOrder(order.id)
      }
    }
  }

  async getOrders() {

    let orders = await this.OrdertCollectionRef.get()
    orders = orders.docs.map(order => this._getOrderFromDocument(order))

    return orders

  }

}

module.exports = OrderRepository;
