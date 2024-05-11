class Webhook {

    constructor(url) {
        this.url = url
    }
}

class WebhookDocument extends Webhook {

    constructor(id, url) {
        super(url)
        this.id = id
    }
}

module.exports = { Webhook, WebhookDocument }
