const { Product } = require('../entities/product-entities')
const { CustomError } = require('../../utils/tools-handler-error-utils');
const { v4: uuidv4 } = require('uuid')


class ProductUseCase {

  constructor(productRepository, storeRepository) {
    this.productRepository = productRepository
    this.storeRepository = storeRepository
  }

  async createProduct(body) {

    const sku = uuidv4();

    const newProduct = new Product(
      body.name,
      body.description,
      body.price,
      sku,
      body.stock,
      body.storeId
    )

    const product = await this.productRepository.createProduct(newProduct)
    return product

  }

  async getProducts(storeId) {

    const store = await this.storeRepository.getStoreByStoreId(storeId)
    if (!store) {
      throw new CustomError('The store dont exist.', 404)
    }

    return await this.productRepository.getProducts(storeId)
  }


  async updateProductByProductId(storeId, productId, updateProduct) {

    const product = await this.productRepository.getProductByProductId(storeId, productId)
    if (!product) {
      throw new CustomError('Product dont exist.', 404)
    }

    await this.productRepository.updateProduct(storeId, productId, updateProduct)
    return true
  }


  async deleteProductByProductId(storeId, productId) {

    const product = await this.productRepository.getProductByProductId(storeId, productId)
    if (!product) {
      throw new CustomError('The product dont exist.', 404)
    }

    await this.productRepository.deleteProductByProductId(storeId, productId)
    return true
  }

  async getProductDetailByProductId(storeId, productId) {

    const product = await this.productRepository.getProductByProductId(storeId, productId)
    if (!product) {
      throw new CustomError('The product dont exist.', 404)
    }

    return product
  }

}

module.exports = ProductUseCase;
