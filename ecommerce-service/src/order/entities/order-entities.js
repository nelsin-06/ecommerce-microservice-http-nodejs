class Order {

    constructor(userId, cartId, storeId, product, store, user, state) {
        this.userId = userId
        this.cartId = cartId
        this.storeId = storeId
        this.product = product
        this.store = store
        this.user = user
        this.state = state
    }
}

class OrderDocument extends Order {

    constructor(id, userId, cartId, storeId, product, store, user, state, trackingNumber) {
        super(userId, cartId, storeId, product, store, user, state)
        this.id = id
        this.trackingNumber = trackingNumber ?? undefined
    }
}


class OrderStates {
    static created = 'created'
    static confirmed = 'confirmed'
    static dispatched = 'dispatched'
    static cancelled = 'cancelled'
    static delivered = 'delivered'
}

module.exports = { Order, OrderDocument, OrderStates }
