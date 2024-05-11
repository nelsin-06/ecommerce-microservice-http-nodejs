const { CustomError } = require('../../utils/tools-handler-error-utils')
const { Webhook } = require('../entities/webhook-entities')


class WebhookUseCase {

  constructor(webhookRepository) {
    this.webhookRepository = webhookRepository
  }

  async registerWebhook(body) {
    const newUrlWebhook = new Webhook(body.url)

    return await this.webhookRepository.registerWebhook(newUrlWebhook)
  }

  async getUrlWebhooks() {
    return await this.webhookRepository.getUrlWebhooks()
  }

}

module.exports = WebhookUseCase;
