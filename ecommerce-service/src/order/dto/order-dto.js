const { OrderStates } = require('../entities/order-entities')

const searchOrdersSchema = {
    type: 'object',
    properties: {
        state: { type: 'string', errorMessage: 'productId cannot be empty', enum: Object.values(OrderStates) },
    },
    required: ['state'],
    additionalProperties: false
}

const orderStateSchema = {
    type: 'object',
    properties: {
        state: { type: 'string', enum: Object.values(OrderStates), errorMessage: 'state is invalid.' },
        orderId: { type: 'string', errorMessage: 'orderId must be a string' }
    },
    required: ['state', 'orderId'],
    additionalProperties: false
};

module.exports = { searchOrdersSchema, orderStateSchema }