const express = require('express')

function authRouter(authUseCase) {

  const authRouter = express.Router();

  authRouter.post("/token/generate",
    async (req, res, next) => {
      try {

        const response = await authUseCase.generateTokenGuest()

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
