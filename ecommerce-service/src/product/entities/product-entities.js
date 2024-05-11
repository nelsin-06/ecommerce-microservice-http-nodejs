class Product {

    constructor(name, description, price, sku, stock, storeId) {
        this.name = name
        this.description = description
        this.price = price
        this.sku = sku
        this.stock = stock
        this.storeId = storeId
    }
}

class ProductDocument extends Product {

    constructor(id, name, description, price, sku, stock, storeId) {
        super(name, description, price, sku, stock, storeId)
        this.id = id
    }
}

module.exports = { Product, ProductDocument }
