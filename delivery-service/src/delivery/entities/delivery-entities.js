class Delivery {

    constructor(order, origin, destination, trackingNumber, status, updatedAt, date, active) {
        this.order = order
        this.origin = origin
        this.destination = destination
        this.trackingNumber = trackingNumber
        this.status = status
        this.updatedAt = updatedAt
        this.date = date
        this.active = active
    }
}

class DeliveryDocument extends Delivery {

    constructor(id, order, origin, destination, trackingNumber, status, updatedAt, date, active) {
        super(order, origin, destination, trackingNumber, status, updatedAt, date, active)
        this.id = id
    }
}


class DeliveryStates {
    static READY_FOR_PICK_UP = 'READY_FOR_PICK_UP'
    static AT_ORIGIN = 'AT_ORIGIN'
    static EN_ROUTE_OF_DELIVERY = 'EN_ROUTE_OF_DELIVERY'
    static NOT_DELIVERED = 'NOT_DELIVERED'
    static DELIVERED = 'DELIVERED'
}

module.exports = { Delivery, DeliveryDocument, DeliveryStates }
