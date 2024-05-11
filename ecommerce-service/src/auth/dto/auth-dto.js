const signUpSchemaValidation = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, errorMessage: 'Name must not be empty' },
        email: { type: 'string', format: 'email', minLength: 1, errorMessage: 'Invalid or empty email' },
        shippingAddres: { type: 'string', minLength: 1, errorMessage: 'Shipping address must not be empty' },
        password: { type: 'string', minLength: 8, errorMessage: 'Password must be at least 8 characters long' },
        repeatPassword: { const: { $data: '1/password' }, errorMessage: 'Passwords do not match' },
        isAdmin: { type: 'boolean' }
    },
    required: ['name', 'email', 'shippingAddres', 'password', 'repeatPassword'],
    additionalProperties: false
}

const signInSchemaValidation = {
    type: 'object',
    properties: {
        email: { type: 'string', minLength: 1, errorMessage: 'Email address must not be empty' },
        password: { type: 'string', minLength: 1, errorMessage: 'Password address must not be empty' }
    },
    required: ['email', 'password'],
    additionalProperties: false
};


module.exports = { signUpSchemaValidation, signInSchemaValidation }