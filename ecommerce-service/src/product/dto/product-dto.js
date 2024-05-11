const createProductSchemaValidation = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, errorMessage: 'Name must not be empty' },
        description: { type: 'string', minLength: 1, maxLength: 50, errorMessage: 'Description must not be empty and must not be longer than 50 characters.' },
        price: { type: 'number', minimum: 0, errorMessage: 'Price must be a number greater than or equal to 0' },
        stock: { type: 'number', minimum: 0, errorMessage: 'Stock must be a number greater than or equal to 0' },
    },
    required: ['name', 'description', 'price', 'stock'],
    additionalProperties: false
}

const updateProductSchemaValidation = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, errorMessage: 'Name must not be empty' },
        description: { type: 'string', minLength: 1, maxLength: 20, errorMessage: 'Description must not be empty and must not be longer than 20 characters.' },
        price: { type: 'number', minimum: 0, errorMessage: 'Price must be a number greater than or equal to 0' },
        stock: { type: 'number', minimum: 0, errorMessage: 'Stock must be a number greater than or equal to 0' }
    },
    required: ['name', 'description', 'price', 'stock'],
    additionalProperties: false
}


module.exports = { createProductSchemaValidation, updateProductSchemaValidation }