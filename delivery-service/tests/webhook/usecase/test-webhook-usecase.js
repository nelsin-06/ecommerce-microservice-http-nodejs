const { Webhook } = require('../../../src/webhook/entities/webhook-entities')
const sinon = require('sinon')
const assert = require('assert')
const WebhookUseCase = require('../../../src/webhook/usecases/webhook-usecase')
const { faker } = require('@faker-js/faker')

describe("WebhookUseCase", function () {

    let webhookUseCase
    let webhookRepositoryStub

    beforeEach(function () {
        webhookRepositoryStub = {
            registerWebhook: sinon.stub(),
            getUrlWebhooks: sinon.stub()
        }
        webhookUseCase = new WebhookUseCase(webhookRepositoryStub)
    })

    it("should register a new webhook", async function () {
        const body = {
            url: faker.internet.url()
        }

        const newWebhook = new Webhook(body.url)
        webhookRepositoryStub.registerWebhook.resolves(newWebhook)

        const result = await webhookUseCase.registerWebhook(body)

        assert.deepStrictEqual(result, newWebhook)
        sinon.assert.calledOnceWithExactly(webhookRepositoryStub.registerWebhook, sinon.match.instanceOf(Webhook))
    })

    it("should get all webhook urls", async function () {
        const webhookUrls = [
            faker.internet.url(),
            faker.internet.url(),
            faker.internet.url()
        ]

        webhookRepositoryStub.getUrlWebhooks.resolves(webhookUrls)

        const result = await webhookUseCase.getUrlWebhooks()

        assert.deepStrictEqual(result, webhookUrls)
    })

})
