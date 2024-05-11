const express = require('express');
const { handleError, notFoundMiddle } = require('../../utils/tools-handler-error-utils')
const cron = require('node-cron')
const changeStateDelivery = require('../../utils/jobs-utils')

// Módulo para crear una aplicación en Express
// recibiendo las dependencias externamente.

async function createExpressApp(routers) {

  // Aplicación en Express.

  let app = express();

  // Configuraciones varias.

  app.use(express.json());

  // Usar rutas recibidas.

  for (let router of routers) {
    app.use(router);
  }

  // Dejar escuchando y finalizar.

  const port = process.env.PORT_API_EXPOSE;

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  app.use(notFoundMiddle)
  app.use(handleError)

  cron.schedule('*/30 * * * * *', () => {
    changeStateDelivery()
  })

  return app;

}

module.exports = createExpressApp