const fetch = require('node-fetch')

class NotificationService {

    constructor(webhookRepository) {
        this.webhookRepository = webhookRepository
    }

    async sendNotificationDeliveryStatusUpdate(deliveriesStatusUpdate) {

        let urls = await this.webhookRepository.getUrlWebhooks()

        if (deliveriesStatusUpdate.length && urls.length) {

            for await (const delivery of deliveriesStatusUpdate) {

                urls = urls.map(url => url?.url)

                const requests = urls.map(url =>
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(delivery)
                    })
                        .then(async response => { })
                        .catch(error => {
                            console.log({
                                message: `ERROR : service sendNotificationDeliveryStatusUpdate : ${new Date(Date.now())}`,
                                error
                            })
                        })
                );
                const promises = await Promise.allSettled(requests)

                for (const promise of promises) {
                    if (promise?.status == 'fulfilled' && promise?.value?.success == false) {
                        console.log({
                            message: `ERROR : service sendNotificationDeliveryStatusUpdate : ${new Date(Date.now())}`,
                            error: promise?.value?.error
                        })
                    }
                }

            }

        }
    }

}

module.exports = NotificationService
