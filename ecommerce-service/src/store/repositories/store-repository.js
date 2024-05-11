const { StoreDocument } = require('../entities/store-entities')
const { serializeData } = require('../../utils/tools-db-utils')
// Implementación con Firestore para el repositorio de ${entity}.
// Recibe la conexión con Firestore externamente.

class StoreRepository {

  constructor(firestoreClient, test = false) {

    this.collectionName = 'stores'

    if (test) {
      this.collectionName += "_test"
    }

    this.StoresCollectionRef = firestoreClient.collection(this.collectionName)
    this.test = test

  }

  _getStoreFromDocument(doc) {

    const id = doc.id;
    const data = doc.data();

    return new StoreDocument(id, data.name, data.description, data.userSellerId, data.warehouseAddress)

  }

  async createStore(newStore) {

    const store = await this.StoresCollectionRef.add(serializeData(newStore))

    return this._getStoreFromDocument(await store.get())

  }

  async getStoreByUserId(userSellerId) {

    const store = await this.StoresCollectionRef.where('userSellerId', '==', userSellerId).get()

    if (store.empty) return null

    return this._getStoreFromDocument(store.docs[0])

  }

  async getStores() {

    let stores = await this.StoresCollectionRef.get()
    stores = stores.docs.map(store => this._getStoreFromDocument(store))

    return stores

  }

  async updateStoreByStoreId(storeId, updateStore) {

    let stores = await this.StoresCollectionRef.doc(storeId).update(updateStore)

    return stores
  }

  async deleteStoreByStoreId(storeId) {

    let stores = await this.StoresCollectionRef.doc(storeId).delete()

    return stores
  }

  async getStoreByStoreId(storeId) {

    const store = await this.StoresCollectionRef.doc(storeId).get()

    if (!store.exists) return null

    return this._getStoreFromDocument(store)

  }

}

module.exports = StoreRepository;