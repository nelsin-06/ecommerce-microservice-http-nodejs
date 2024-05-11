const appRoot = require('app-root-path');
const validateSchema = require('../frameworks/http/ajv')
const { CustomError } = require('./tools-handler-error-utils')

function inputDataValidatorMiddleware(entitySchemaDto) {
    return (req, res, next) => {
        Promise.resolve(validateSchema(entitySchemaDto, req))
            .then(isValid => {
                if (isValid == true) {
                    next();
                } else {
                    next(new CustomError(
                        'Error missing or incorrect data at validation, please validate if all the required data are filled.',
                        isValid.code,
                        isValid.data
                    ));
                }
            })
            .catch(error => {
                next(error);
            });
    };
}

module.exports = inputDataValidatorMiddleware
