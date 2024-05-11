const webhookSchema = {
    type: 'object',
    properties: {
        url: { type: 'string', format: 'uri', errorMessage: 'url must be a valid URL' }
    },
    required: ['url'],
    additionalProperties: false
};


module.exports = { webhookSchema }