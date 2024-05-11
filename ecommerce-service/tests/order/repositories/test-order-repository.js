const { Order, OrderDocument, OrderStates } = require('../../../src/order/entities/order-entities')
const sinon = require('sinon')
const assert = require('assert')
const OrderRepository = require('../../../src/order/repositories/order-repository')
const createFirestoreClient = require('../../../src/frameworks/db/firestore')
const { faker } = require('@faker-js/faker')

describe("OrderRepository", function () {

    let orderRepository

    beforeEach(function () {
        const firestoreClient = createFirestoreClient()
        orderRepository = new OrderRepository(firestoreClient, true)
    })

    afterEach(async function () {
        await orderRepository.deleteAllOrders()
    })

    it("should create a new order", async function () {

        const store = {
            warehouseAddress: faker.location.streetAddress(),
            userSellerId: faker.string.nanoid(),
            description: faker.string.alphanumeric(10),
            name: faker.company.name(),
            id: faker.string.nanoid
        }

        const product = {
            quantity: faker.number.int({ max: 20 }),
            productId: faker.string.nanoid(),
            storeId: store.id,
            name: faker.commerce.product(),
            sku: faker.string.alphanumeric(10),
        }

        const user = {
            shippingAddres: faker.location.streetAddress(),
            name: faker.person.fullName(),
            id: faker.string.nanoid()
        }

        const newOrder = new Order(
            user.id,
            faker.string.nanoid(),
            store.id,
            product,
            store,
            user,
            OrderStates.created
        )

        const createdOrder = await orderRepository.registerOrder(newOrder)

        const obtainedOrder = await orderRepository.getOrderByOrderId(createdOrder.id)
        assert.deepStrictEqual(obtainedOrder, createdOrder)

    })

    it("should change the state of an order", async function () {

        const store = {
            warehouseAddress: faker.location.streetAddress(),
            userSellerId: faker.string.nanoid(),
            description: faker.string.alphanumeric(10),
            name: faker.company.name(),
            id: faker.string.nanoid
        }

        const product = {
            quantity: faker.number.int({ max: 20 }),
            productId: faker.string.nanoid(),
            storeId: store.id,
            name: faker.commerce.product(),
            sku: faker.string.alphanumeric(10),
        }

        const user = {
            shippingAddres: faker.location.streetAddress(),
            name: faker.person.fullName(),
            id: faker.string.nanoid()
        }

        const initialOrderState = OrderStates.created

        const newOrder = new Order(
            user.id,
            faker.string.nanoid(),
            store.id,
            product,
            store,
            user,
            initialOrderState
        )

        const createdOrder = await orderRepository.registerOrder(newOrder)
    
        const newState = OrderStates.dispatched
        await orderRepository.changeStateOrder(createdOrder.id, newState)

        const updatedOrder = await orderRepository.getOrderByOrderId(createdOrder.id)
        assert.strictEqual(updatedOrder.state, newState)
    })

})
