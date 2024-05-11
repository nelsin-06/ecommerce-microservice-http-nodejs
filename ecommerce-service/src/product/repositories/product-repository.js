const { ProductDocument } = require('../entities/product-entities')
const { serializeData } = require('../../utils/tools-db-utils')
const { Firestore } = require('@google-cloud/firestore');

// Implementación con Firestore para el repositorio de ${entity}.
// Recibe la conexión con Firestore externamente.

class ProductRepository {

  constructor(firestoreClient, test = false) {

    this.subCollectionName = 'products'
    this.collectionName = 'stores'

    if (test) {
      this.collectionName += "_test"
      this.subCollectionName += "_test"
    }

    this.productsCollectionRef = null
    this.firestoreClient = firestoreClient
    this.test = test


  }

  async setproductsCollectionRef(storeId) {
    const storesCollectionRef = await this.firestoreClient.collection(this.collectionName).doc(storeId)
    this.productsCollectionRef = await storesCollectionRef.collection(this.subCollectionName)
  }

  _getProductFromDocument(doc) {

    const id = doc.id;
    const data = doc.data()

    if (!data) {
      return null
    }

    return new ProductDocument(id, data.name, data.description, data.price, data.sku, data.stock, data.storeId)

  }

  async createProduct(newProduct) {

    await this.setproductsCollectionRef(newProduct.storeId)

    const product = await this.productsCollectionRef.add(serializeData(newProduct))

    return this._getProductFromDocument(await product.get())

  }

  async getProducts(storeId) {

    await this.setproductsCollectionRef(storeId)

    let products = await this.productsCollectionRef.get()
    products = products.docs.map(product => this._getProductFromDocument(product))

    return products

  }

  async deleteProductByProductId(storeId, productId) {

    await this.setproductsCollectionRef(storeId)

    await this.productsCollectionRef.doc(productId).delete()

    return true

  }

  async getProductByProductId(storeId, productId) {
    await this.setproductsCollectionRef(storeId)

    const product = await this.productsCollectionRef.doc(productId).get()

    if (!product.exists) return null

    return this._getProductFromDocument(product)

  }

  async getProductsByProductsCart(storeId, productsCart) {

    await this.setproductsCollectionRef(storeId)
    let productsResult = await Promise.all(productsCart.map(product => this.productsCollectionRef.doc(product.productId).get()))

    return productsResult.map(product => this._getProductFromDocument(product))

  }

  async updateProduct(storeId, productId, updateProduct) {

    await this.setproductsCollectionRef(storeId)

    const product = await this.productsCollectionRef.doc(productId).update(updateProduct)

    return product

  }

  async updateStockProduct(storeId, productId, stock) {

    await this.setproductsCollectionRef(storeId)

    const product = await this.productsCollectionRef.doc(productId).update(
      { stock: Firestore.FieldValue.increment(stock) }
    )

    return product

  }

}

module.exports = ProductRepository;