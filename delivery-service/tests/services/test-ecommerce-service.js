const { CustomError } = require('../../src/utils/tools-handler-error-utils')
const sinon = require('sinon')
const assert = require('assert')
const EcommerceService = require('../../src/services/ecommerce-service')
const { faker } = require('@faker-js/faker')


describe('EcommerceService', () => {
    let ecommerceService

    beforeEach(() => {

        ecommerceService = new EcommerceService()
    })

    it('you should obtain a valid token from the ecommerce service.', async () => {

        const data = await ecommerceService.getAccessToken()
        assert.ok(data.data.token)
    })

})