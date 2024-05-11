const express = require('express');
const { verifyToken } = require('../../utils/tools-auth-utils');
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const { webhookSchema } = require('../dto/webhook-dto')

function webhookRouter(webhookUseCase) {

  const webhookRouter = express.Router();

  webhookRouter.post("/register/url",
    inputDataValidatorMiddleware(webhookSchema),
    async (req, res, next) => {

      try {
        const body = req.body

        const response = await webhookUseCase.registerWebhook(body)
        res.status(201).json({
          message: 'Webhook urls created successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  webhookRouter.get("/url",
    async (req, res, next) => {

      try {

        const response = await webhookUseCase.getUrlWebhooks()
        res.status(200).json({
          message: 'Webhook urls successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  return webhookRouter.use('/webhook', verifyToken, webhookRouter)

}

module.exports = webhookRouter;
