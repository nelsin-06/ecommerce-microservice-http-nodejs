const fetch = require('node-fetch')

class DeliveryService {

    constructor() { }
    baseUrlDeliveryService = `${process.env.PROTOCOLO_API}://${process.env.DELIVERY_SERVICE_NAME}:${process.env.PORT_API_EXPOSE}`

    async createDelivery(newDelivery) {
        const data = await this.getAccessToken()

        return await fetch(`${this.baseUrlDeliveryService}/delivery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.data.token}`
            },
            body: JSON.stringify(newDelivery)
        })
            .then(async response => {
                return await response.json()
            })
            .catch(error => console.log(error));
    }

    async getHistoryDelivery(orderId, trackingNumber) {
        const data = await this.getAccessToken()

        const body = { orderId, trackingNumber }

        const tracking = await fetch(`${this.baseUrlDeliveryService}/delivery/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.data.token}`
            },
            body: JSON.stringify(body)
        })
            .then(async response => {
                return await response.json()
            })
            .catch(error => { console.log(error) });

        return tracking.data
    }

    async getAccessToken() {

        return fetch(`${this.baseUrlDeliveryService}/auth/token/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(async data => {
            return await data.json()
        }).then(error => error)

    }

}

module.exports = DeliveryService
