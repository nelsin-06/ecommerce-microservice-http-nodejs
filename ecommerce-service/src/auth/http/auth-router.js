const express = require('express')
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const {
  signUpSchemaValidation,
  signInSchemaValidation
} = require('../dto/auth-dto')

function authRouter(authUseCase) {

  const authRouter = express.Router();

  authRouter.post("/signUp",
    inputDataValidatorMiddleware(signUpSchemaValidation),
    async (req, res, next) => {
      try {

        const body = req.body

        const response = await authUseCase.signUp(body)

        res.status(201).json({
          message: 'singUp sucessfully.',
          data: response
        })
      } catch (error) {
        next(error)
      }

    });

  authRouter.post("/signIn",
    inputDataValidatorMiddleware(signInSchemaValidation),
    async (req, res, next) => {
      try {

        const body = req.body

        const response = await authUseCase.signIn(body);

        res.status(200).json({
          message: 'singIn sucessfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    });

    authRouter.post("/token/generate",
    async (req, res, next) => {
      try {

        const body = req.body

        const response = await authUseCase.generateTokenGuest(body);

        res.status(200).json({
          message: 'Token generate successfully',
          data: response
        })

      } catch (error) {
        next(error)
      }
    });

  return authRouter.use('/auth', authRouter);

}

module.exports = authRouter;
