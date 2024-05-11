const express = require('express');
const { verifyToken, checkRole } = require('../../utils/tools-auth-utils');
const { UserPotencialActions } = require('../../user/entities/user-entities');
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const { createCartSchemaValidation } = require('../dto/cart-dto')
const cartDataProcessor = require('../middlewares/cart-middleware')

function cartRouter(cartUseCase) {

  const cartRouter = express.Router();

  cartRouter.post("/create",
    inputDataValidatorMiddleware(createCartSchemaValidation),
    cartDataProcessor,
    async (req, res, next) => {

      try {
        const body = req.body
        const userId = req.userId

        const response = await cartUseCase.createCart({ ...body, userId })
        res.status(201).json({
          message: 'Cart created successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  cartRouter.get("/all",
    checkRole([UserPotencialActions.marketplaceAdmin]),
    async (req, res, next) => {

      try {
        const body = req.body

        const response = await cartUseCase.getCarts(body)
        res.status(200).json({
          message: 'Cart get all successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  cartRouter.get("/:userId",
    async (req, res, next) => {

      try {

        const { userId } = req.params
        const response = await cartUseCase.getCartByUserId(userId)
        res.status(200).json({
          message: 'Cart by userId successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  cartRouter.post("/buy",
    async (req, res, next) => {

      try {

        const userId = req.userId

        const response = await cartUseCase.buyCart(userId)
        res.status(200).json({
          message: 'Buy cart successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })


  return cartRouter.use('/cart', verifyToken, cartRouter)

}

module.exports = cartRouter;
