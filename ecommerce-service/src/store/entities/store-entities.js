class Store {

    constructor(name, description, userSellerId, warehouseAddress) {
        this.name = name
        this.description = description
        this.userSellerId = userSellerId
        this.warehouseAddress = warehouseAddress
    }
}

class StoreDocument extends Store {

    constructor(id, name, description, userSellerId, warehouseAddress) {
        super(name, description, userSellerId, warehouseAddress)
        this.id = id
    }
}

module.exports = { Store, StoreDocument }
