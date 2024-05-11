const express = require('express')
const { verifyToken } = require('../../utils/tools-auth-utils')

function seederRouter(seederUseCase) {

  const seederRouter = express.Router();

  seederRouter.post('/seeder',
    async (req, res, next) => {

      try {

        await seederUseCase.seeder()
        res.status(200).json({
          message: 'Seeder',
          data: true
        })

      } catch (error) {
        next(error)
      }
    })

  return seederRouter.use('/seeder', verifyToken, seederRouter)

}

module.exports = seederRouter;
