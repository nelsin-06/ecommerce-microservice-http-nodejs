const express = require('express');
const { verifyToken, checkRole } = require('../../utils/tools-auth-utils');
const { UserPotencialActions } = require('../../user/entities/user-entities');
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const validateSchema = require('../../frameworks/http/ajv')
const { orderStateSchema } = require('../dto/order-dto')


function orderRouter(orderUseCase) {

  const orderRouter = express.Router();

  orderRouter.get("/search/all",
    checkRole([UserPotencialActions.marketplaceAdmin]),
    async (req, res, next) => {

      try {
        const state = req?.query?.state ?? null

        const userId = req?.userId
        const storeId = req?.storeId

        const response = await orderUseCase.searchOrders(
          state,
          UserPotencialActions.marketplaceAdmin,
          userId ?? null,
          storeId ?? null
        )
        res.status(200).json({
          message: 'Get orders successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  orderRouter.get("/search/store",
    checkRole([UserPotencialActions.sellerUser]),
    async (req, res, next) => {

      try {
        const state = req?.query?.state ?? null
        const userId = req?.userId
        const storeId = req?.storeId

        const response = await orderUseCase.searchOrders(
          state,
          UserPotencialActions.sellerUser,
          userId ?? null,
          storeId ?? null
        )

        res.status(200).json({
          message: 'Get orders successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  orderRouter.get("/search/user",
    checkRole([UserPotencialActions.marketplaceUser]),
    async (req, res, next) => {

      try {
        const state = req?.query?.state ?? null
        const userId = req?.userId
        const storeId = req?.storeId

        const response = await orderUseCase.searchOrders(
          state,
          UserPotencialActions.marketplaceUser,
          userId ?? null,
          storeId ?? null
        )

        res.status(200).json({
          message: 'Get orders successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  orderRouter.post("/change/state",
    checkRole([UserPotencialActions.sellerUser]),
    inputDataValidatorMiddleware(orderStateSchema),
    async (req, res, next) => {

      try {
        const state = req?.body?.state ?? null
        const orderId = req?.body?.orderId ?? null
        const storeId = req?.storeId

        const response = await orderUseCase.changeStateOrder(orderId, state, storeId)

        res.status(200).json({
          message: 'Get orders successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  orderRouter.post("/cancel/:orderId",
    checkRole([UserPotencialActions.marketplaceUser]),
    async (req, res, next) => {

      try {
        const { orderId } = req?.params ?? null

        const response = await orderUseCase.cancelOrder(orderId)

        res.status(200).json({
          message: 'Order calleced successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  orderRouter.get("/tracking/:orderId",
    async (req, res, next) => {

      try {
        const { orderId } = req?.params ?? null

        const response = await orderUseCase.getTrakingOrder(orderId)

        res.status(200).json({
          message: 'Get traking order successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })


  return orderRouter.use('/order', verifyToken, orderRouter)

}

module.exports = orderRouter;
