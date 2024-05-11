const Ajv = require("ajv");
const AjvErrors = require('ajv-errors');
const addFormats = require("ajv-formats")

const ajv = new Ajv({
    allErrors: true,
    $data: true
});

addFormats(ajv)
AjvErrors(ajv)

function validateSchema(schema, req) {

    const validate = ajv.compile(schema)
    const valid = validate(req.body)

    if (!valid) {

        errorsPool = []

        validate.errors.forEach(element => {
            if (element.instancePath) {
                error = element.instancePath.replace("/", "") + " " + element.message;
            } else {
                error = element.message;
            }
            errorsPool.push(error);
        });

        statusCode = 422;

        response = {
            data: errorsPool,
            code: statusCode
        };

        return response;
    }

    return valid;
}

module.exports = validateSchema;