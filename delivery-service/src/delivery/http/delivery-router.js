const express = require('express');
const { verifyToken } = require('../../utils/tools-auth-utils');
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const { createDeliverySchema, shipmentSchema } = require('../dto/delivery-dto')

function deliveryRouter(deliveryUseCase) {

  const deliveryRouter = express.Router();

  deliveryRouter.post('/',
    inputDataValidatorMiddleware(createDeliverySchema),
    async (req, res, next) => {

      try {
        const body = req.body

        const response = await deliveryUseCase.createDelivery(body)

        res.status(200).json({
          message: 'Post develivery successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  deliveryRouter.post('/history',
    inputDataValidatorMiddleware(shipmentSchema),
    async (req, res, next) => {

      try {
        const body = req.body

        const response = await deliveryUseCase.getDeliveryHistory(body)

        res.status(200).json({
          message: 'History develivery successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  deliveryRouter.get('/all',
    async (req, res, next) => {

      try {

        const response = await deliveryUseCase.getDeliveryActive()

        res.status(200).json({
          message: 'Get all develiveries successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  deliveryRouter.get('/detail',
    inputDataValidatorMiddleware(shipmentSchema),
    async (req, res, next) => {

      try {
        const body = req.body

        const response = await deliveryUseCase.getDeliveryDetail(body)

        res.status(200).json({
          message: 'Get detail develivery successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })


  return deliveryRouter.use('/delivery', verifyToken, deliveryRouter)

}

module.exports = deliveryRouter;
