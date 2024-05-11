const express = require('express')
const { verifyToken, checkRole } = require('../../utils/tools-auth-utils')
const inputDataValidatorMiddleware = require('../../utils/input-data-validator-middleware')
const { UserPotencialActions } = require('../../user/entities/user-entities')
const { createProductSchemaValidation, updateProductSchemaValidation } = require('../dto/product-dto')

function productRouter(productUseCase) {

  const productRouter = express.Router();

  productRouter.post('/create',
    checkRole([UserPotencialActions.sellerUser]),
    inputDataValidatorMiddleware(createProductSchemaValidation),
    async (req, res, next) => {

      try {
        const body = req.body
        const storeId = req.storeId

        const response = await productUseCase.createProduct({ ...body, storeId })
        res.status(200).json({
          message: 'Product created successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  productRouter.get('/all',
    checkRole([UserPotencialActions.sellerUser]),
    async (req, res, next) => {

      try {
        const storeId = req.storeId

        const response = await productUseCase.getProducts(storeId)

        res.status(200).json({
          message: 'Get all products.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  productRouter.get('/:storeId',
    async (req, res, next) => {

      try {
        const { storeId } = req.params

        const response = await productUseCase.getProducts(storeId)

        res.status(200).json({
          message: 'Get all products.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  productRouter.delete('/delete/:productId',
    checkRole([UserPotencialActions.sellerUser]),
    async (req, res, next) => {

      try {
        const storeId = req.storeId
        const { productId } = req.params

        const response = await productUseCase.deleteProductByProductId(storeId, productId)

        res.status(200).json({
          message: 'Product deleted successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })

  productRouter.put('/update/:productId',
    checkRole([UserPotencialActions.sellerUser]),
    inputDataValidatorMiddleware(updateProductSchemaValidation),
    async (req, res, next) => {

      try {
        const storeId = req.storeId
        const { productId } = req.params
        const body = req.body
        const response = await productUseCase.updateProductByProductId(storeId, productId, body)

        res.status(201).json({
          message: 'Product updated successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })


  productRouter.get('/:storeId/detail/:productId',
    async (req, res, next) => {

      try {
        const { productId, storeId } = req.params

        const response = await productUseCase.getProductDetailByProductId(storeId, productId)

        res.status(200).json({
          message: 'Product detail successfully.',
          data: response
        })

      } catch (error) {
        next(error)
      }
    })



  return productRouter.use('/product', verifyToken, productRouter)

}

module.exports = productRouter;
