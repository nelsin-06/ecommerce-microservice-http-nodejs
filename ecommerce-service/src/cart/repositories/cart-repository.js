const { CartDocument } = require('../entities/cart-entities')
const { serializeData } = require('../../utils/tools-db-utils')
// Implementación con Firestore para el repositorio de ${entity}.
// Recibe la conexión con Firestore externamente.

class CartRepository {

  constructor(firestoreClient, test = false) {

    this.collectionName = 'cart'

    if (test) {
      this.collectionName += "_test"
    }

    this.CartCollectionRef = firestoreClient.collection(this.collectionName)
    this.test = test

  }

  _getCartFromDocument(doc) {

    const id = doc.id;
    const data = doc.data();

    return new CartDocument(id, data.userId, data.products, data.active)

  }

  async createCart(newCart) {

    const store = await this.CartCollectionRef.add(serializeData(newCart))

    return this._getCartFromDocument(await store.get())

  }

  async getCartByUserId(userId) {
    const cart = await this.CartCollectionRef
      .where('userId', '==', userId)
      .where('active', '==', true)
      .get()

    if (cart.empty) return null

    return this._getCartFromDocument(cart.docs[0])
  }

  async getCarts() {
    let carts = await this.CartCollectionRef.get()

    carts = carts.docs.map(cart => this._getCartFromDocument(cart))

    return carts
  }

  async updateCart(cartId, updateCart) {

    const store = await this.CartCollectionRef.doc(cartId).update(serializeData(updateCart))

    return store

  }

}

module.exports = CartRepository;
