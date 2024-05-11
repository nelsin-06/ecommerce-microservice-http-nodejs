const { WebhookDocument, Webhook } = require('../../../src/webhook/entities/webhook-entities')
const assert = require('assert')
const WebhookRepository = require('../../../src/webhook/repositories/webhook-repository')
const createFirestoreClient = require('../../../src/frameworks/db/firestore')
const { faker } = require('@faker-js/faker')

describe("WebhookRepository", function () {

    let webhookRepository

    beforeEach(function () {
        const firestoreClient = createFirestoreClient()
        webhookRepository = new WebhookRepository(firestoreClient, true)
    })

    afterEach(async function () {
        await webhookRepository.deleteAllWebhooks()
    })

    it("should register a new webhook", async function () {
        const url = faker.internet.url()
        const newWebhook = new WebhookDocument(undefined, url)

        const createdWebhook = await webhookRepository.registerWebhook(newWebhook)

        assert.strictEqual(createdWebhook.url, url)
    })

    it("should get all webhook urls", async function () {

        const url_1 = faker.internet.url()
        const url_2 = faker.internet.url()

        const webhookUrls = [url_1, url_2]

        for await (const webhook of webhookUrls) {
            const newWebhook = new Webhook(webhook)
            await webhookRepository.registerWebhook(newWebhook)
        }

        const result = await webhookRepository.getUrlWebhooks()

        assert.deepStrictEqual(result.map(webhook => webhook.url), webhookUrls)
    })

})
