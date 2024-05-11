class Cart {

    constructor(userId, products, active) {
        this.userId = userId
        this.products = products
        this.active = active
    }
}

class CartDocument extends Cart {

    constructor(id, userId, products, active) {
        super(userId, products, active)
        this.id = id
    }
}

module.exports = { Cart, CartDocument }
