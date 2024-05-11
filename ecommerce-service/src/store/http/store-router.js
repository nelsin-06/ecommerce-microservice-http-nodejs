const express = require('express');
const { verifyToken, checkRole } = require('../../utils/tools-auth-utils');
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const { createStoreSchemaValidation, updateStoreSchemaValidation } = require('../dto/store-dto')
const { UserPotencialActions } = require('../../user/entities/user-entities');

function storeRouter(storeUseCase) {

  const storeRouter = express.Router();

  storeRouter.post("/create",
    checkRole([UserPotencialActions.marketplaceAdmin]),
    inputDataValidatorMiddleware(createStoreSchemaValidation),
    async (req, res, next) => {

      try {
        const body = req.body

        const response = await storeUseCase.createStore(body)
        res.status(201).json({
          message: 'Store created successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  storeRouter.get("/all",
    async (req, res, next) => {
      try {

        const response = await storeUseCase.getStores()
        res.status(200).json({
          message: 'Get all stores.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  storeRouter.put("/update/:storeId",
    checkRole([UserPotencialActions.marketplaceAdmin, UserPotencialActions.sellerUser]),
    inputDataValidatorMiddleware(updateStoreSchemaValidation),
    async (req, res, next) => {
      try {

        const { storeId } = req.params
        const body = req.body
        const userId = req.userId

        const response = await storeUseCase.updateStoreByStoreId(storeId, body, userId)
        res.status(200).json({
          message: 'Update store successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  storeRouter.delete("/delete/:storeId",
    checkRole([UserPotencialActions.marketplaceAdmin]),
    async (req, res, next) => {
      try {

        const { storeId } = req.params
        const body = req.body

        const response = await storeUseCase.deleteStoreByStoreId(storeId, body)

        res.status(200).json({
          message: 'Delete store successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  storeRouter.get("/me",
    checkRole([UserPotencialActions.sellerUser]),
    async (req, res, next) => {
      try {

        const response = await storeUseCase.getStoreByUserId(req.userId)

        res.status(200).json({
          message: 'get my store successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  storeRouter.get("/:storeId",
    async (req, res, next) => {
      try {

        const { storeId } = req.params

        const response = await storeUseCase.getStoreByStoreId(storeId)

        res.status(200).json({
          message: 'get store successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  return storeRouter.use('/store', verifyToken, storeRouter)

}

module.exports = storeRouter;
