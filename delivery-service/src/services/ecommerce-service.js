const fetch = require('node-fetch')

class EcommerceService {

    constructor() { }

    baseUrlEcommerceService = `${process.env.PROTOCOLO_API}://${process.env.DELIVERY_SERVICE_NAME}:${process.env.PORT_API_EXPOSE}`

    async notifyOrderDelivered(ordersIds) {

        if (ordersIds.length) {

            const data = await this.getAccessToken()

            await Promise.all(ordersIds.map(orderId => {

                const url = `${this.baseUrlEcommerceService}/webhook/delivery/confirm/${orderId}`
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.data.token}`
                    },
                }).then(async data => {
                    return await data.json()
                }).catch(error => {
                    console.log({
                        message: `ERROR : service notifyOrderDelivered : ${new Date(Date.now())}`,
                        error
                    })
                })

            }))

        }
    }

    async getAccessToken() {

        return fetch(`${this.baseUrlEcommerceService}/auth/token/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(async data => {
            return await data.json()
        }).then(error => error)

    }

}

module.exports = EcommerceService
