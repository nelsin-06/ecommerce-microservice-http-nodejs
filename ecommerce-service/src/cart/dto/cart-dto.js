const productCartSchema = {
    type: 'object',
    properties: {
        productId: { type: 'string', minLength: 1, errorMessage: 'productId cannot be empty' },
        storeId: { type: 'string', minLength: 1, errorMessage: 'storeId cannot be empty' },
        quantity: { type: 'number', minimum: 1, errorMessage: 'quantity must be a number greater than or equal to 1' }
    },
    required: ['productId', 'storeId', 'quantity'],
    additionalProperties: false
}

const createCartSchemaValidation = {
    type: 'object',
    properties: {
        products: {
            type: 'array',
            items: productCartSchema
        }
    },
    required: ['products'],
    additionalProperties: false
}

module.exports = { createCartSchemaValidation }