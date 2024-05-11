class User {

    constructor(name, email, shippingAddres, password, potencialActions) {
        this.name = name
        this.email = email
        this.shippingAddres = shippingAddres
        this.password = password
        this.potencialActions = potencialActions
    }
}

class UserDocument extends User {
    constructor(id, name, email, shippingAddres, password, potencialActions) {
        super(name, email, shippingAddres, password, potencialActions)
        this.id = id
    }
}

class UserPotencialActions {
    static sellerUser = 'sellerUser'
    static marketplaceUser = 'marketplaceUser'
    static marketplaceAdmin = 'marketplaceAdmin'
}

module.exports = { User, UserDocument, UserPotencialActions }
