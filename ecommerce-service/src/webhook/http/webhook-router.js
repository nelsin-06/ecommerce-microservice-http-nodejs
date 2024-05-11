const express = require('express');
const { verifyToken, checkRole, verifyTokenGuest } = require('../../utils/tools-auth-utils');
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const { UserPotencialActions } = require('../../user/entities/user-entities');

function webhookRouter(webhookUseCase) {

  const webhookRouter = express.Router();

  webhookRouter.post("/delivery/confirm/:orderId",
    async (req, res, next) => {

      try {

        const { orderId } = req.params

        const response = await webhookUseCase.updateStateOrder(orderId)
        res.status(200).json({
          message: 'Confirm delivery successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  return webhookRouter.use('/webhook', verifyTokenGuest, webhookRouter)

}

module.exports = webhookRouter;
