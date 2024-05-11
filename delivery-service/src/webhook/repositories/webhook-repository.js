const { serializeData } = require('../../utils/tools-db-utils')
const { WebhookDocument } = require('../entities/webhook-entities')
// Implementación con Firestore para el repositorio de ${entity}.
// Recibe la conexión con Firestore externamente.

class WebhookRepository {

  constructor(firestoreClient, test = false) {

    this.collectionName = 'webhook'

    if (test) {
      this.collectionName += "_test"
    }

    this.WebhookCollectionRef = firestoreClient.collection(this.collectionName)
    this.test = test

  }

  _getWebhookFromDocument(doc) {

    const id = doc.id;
    const data = doc.data();

    return new WebhookDocument(id, data.url)

  }

  async registerWebhook(newUrlWebhook) {

    const webhook = await this.WebhookCollectionRef.add(serializeData(newUrlWebhook))

    return this._getWebhookFromDocument(await webhook.get())

  }

  async getUrlWebhooks() {

    let webhooks = await this.WebhookCollectionRef.get()
    webhooks = webhooks.docs.map(webhook => this._getWebhookFromDocument(webhook))

    return webhooks

  }


  async deleteWebhook(webhookId) {

    await this.WebhookCollectionRef.doc(webhookId).delete()

    return true

  }

  async deleteAllWebhooks() {

    if (this.test) {
      const webhooks = await this.getUrlWebhooks()
      for await (const webhook of webhooks) {
        await this.deleteWebhook(webhook.id)
      }
    }
  }

}

module.exports = WebhookRepository;