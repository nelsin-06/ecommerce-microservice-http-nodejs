const createStoreSchemaValidation = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, errorMessage: 'Name must not be empty' },
        description: { type: 'string', minLength: 1, maxLength: 50, errorMessage: 'Description must not be empty and must not be longer than 50 characters.' },
        warehouseAddress: { type: 'string', minLength: 1, errorMessage: 'Warehouse address must not be empty' },
        userSellerId: { type: 'string', minLength: 8, errorMessage: 'userSellerId must not be empty' },
    },
    required: ['name', 'description', 'warehouseAddress', 'userSellerId'],
    additionalProperties: false
}

const updateStoreSchemaValidation = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, errorMessage: 'Name must not be empty' },
        description: { type: 'string', minLength: 1, maxLength: 20, errorMessage: 'Description must not be empty and must not be longer than 20 characters.' },
        warehouseAddress: { type: 'string', minLength: 1, errorMessage: 'Warehouse address must not be empty' }
    },
    required: ['name', 'description', 'warehouseAddress'],
    additionalProperties: false
}


module.exports = { createStoreSchemaValidation, updateStoreSchemaValidation }