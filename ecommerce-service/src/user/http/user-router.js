const express = require('express');
const appRoot = require('app-root-path');

function userRouter(userUseCase) {

  const userRouter = express.Router();

  userRouter.get("/all", async (req, res) => {

    try {
      const response = await userUseCase.getUsers();
      res.status(200).json({
        message: 'Get all users',
        data: response
      })

    } catch (error) {
      res.json({
        error: error.name,
        message: error.message
      })
    }
  })

  return userRouter.use('/users', userRouter);

}

module.exports = userRouter;
