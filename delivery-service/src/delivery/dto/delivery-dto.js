
const createDeliverySchema = {
    type: 'object',
    properties: {
        order: {
            type: 'object',
            properties: {
                orderId: { type: 'string', minLength: 1, errorMessage: 'orderId must be a string' },
                products: {
                    type: 'object',
                    properties: {
                        sku: { type: 'string', minLength: 1, errorMessage: 'sku must be a string' },
                        name: { type: 'string', minLength: 1, errorMessage: 'name must be a string' },
                        quantity: { type: 'number', minimum: 1, errorMessage: 'quantity must be a number greater than or equal to 1' },
                        productId: { type: 'string', minLength: 1, errorMessage: 'productId must be a string' },
                        storeId: { type: 'string', minLength: 1, errorMessage: 'storeId must be a string' }

                    },
                    required: ['sku', 'name', 'quantity', 'productId'],
                    additionalProperties: false
                }
            },
            required: ['orderId', 'products'],
            additionalProperties: false
        },
        origin: {
            type: 'object',
            properties: {
                storeId: { type: 'string', minLength: 1, errorMessage: 'storeId must be a string' },
                warehouseAddress: { type: 'string', minLength: 1, errorMessage: 'warehouseAddress must be a string' },
                userSellerId: { type: 'string', minLength: 1, errorMessage: 'userSellerId must be a string' }
            },
            required: ['storeId', 'warehouseAddress', 'userSellerId'],
            additionalProperties: false
        },
        destination: {
            type: 'object',
            properties: {
                userId: { type: 'string', minLength: 1, errorMessage: 'userId must be a string' },
                shippingAddres: { type: 'string', minLength: 1, errorMessage: 'shippingAddres must be a string' },
                name: { type: 'string', minLength: 1, errorMessage: 'name must be a string' }
            },
            required: ['userId', 'shippingAddres', 'name'],
            additionalProperties: false
        }
    },
    required: ['order', 'origin', 'destination'],
    additionalProperties: false
}

const shipmentSchema = {
    type: 'object',
    properties: {
        orderId: { type: 'string', minLength: 1, errorMessage: 'orderId must be a string' },
        trackingNumber: { type: 'string', minLength: 1, errorMessage: 'trackingNumber must be a string' }
    },
    required: ['orderId', 'trackingNumber'],
    additionalProperties: false
};


module.exports = { createDeliverySchema, shipmentSchema }