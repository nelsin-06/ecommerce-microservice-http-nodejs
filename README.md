# Microservicios de Marketplace Ecommerce y Delivery Service

![Diagrama](system%20diagram.png)

Este proyecto consiste en el diseño y desarrollo de dos microservicios http interconectados para gestionar un marketplace de ecommerce y la logística de envíos. El microservicio de ecommerce permite a los usuarios administradores crear, editar, eliminar y listar tiendas, así como gestionar productos y órdenes de compra. Por otro lado, el microservicio de envíos se encarga de gestionar los envíos asociados a las órdenes de compra, permitiendo la creación, edición y visualización de envíos, así como el seguimiento de su estado. Ambos microservicios están desarrollados NodeJS con Express, y se ejecutan en contenedores Docker para facilitar su despliegue y portabilidad.


## Tecnologías utilizadas

- Node.js
- Express
- Docker
- Docker Compose
- Firestore (base de datos)
- Autenticación con Bearer Token


## Instalacion y ejecución
- Clona este repositorio.
- Asegurarse de cada servicio tenga .env y que la carpeta del docker contenga uno.
- Tener archivo **service-account.json** para la conexion a la db.

- Ejecutar comandos ```docker-compose``` dentro de la carpeta **ecommerce-docker-nodejs**

* Building the containers: ```docker-compose build```

* Starting the services: ```docker-compose up -d```

* Stoping the services: ```docker-compose stop```

Por defecto, los microservicios se ejecutarán en los siguientes puertos:

ecommerce-service: 8000
delivery-service: 8001

## Architecture
Se adjunto el archivo "system diagram.png" a este repositorio.

## Endpoints/API

La API está estructurada en torno a las siguientes entidades, cada una con sus respectivos endpoints:

### Ecommerce service
- **auth**: Autenticación de usuarios y servicios.
- **user**: Gestión de usuarios.
- **store**: Operaciones relacionadas con las tiendas.
- **product**: Operaciones relacionadas con los productos.
- **cart**: Operaciones relacionadas con los carritos de compra.
- **order**: Gestión de órdenes de compra.

### Delivery service
- **auth**: Autenticación de servicios.
- **delivery**: Gestión de envíos.
- **webhook**: Notificaciones a externos.

la api esta pensada de forma que el cliente solo se comunique con **ecommerce-service** y que haya una comunicacion continua entre este servicio y **delivery-service**


### Colecciones en Postman

Para facilitar el desarrollo y las pruebas, se va a proveer documento de postman (collection y file de variables de entorno) las colecciones en Postman se han organizado en carpetas y subdivididas según los roles de los usuarios:

- **marketplaceAdmin**: Colección con endpoints para administradores del marketplace.
- **sellerUser**: Colección con endpoints para vendedores.
- **marketplaceUser**: Colección con endpoints para compradores.

*la coleccion de endpoints y variables de entorno de postman se van a enconrtar en la carpeta del proyecto. Asegurarse siempre de que el enviroment este seteado en postman.*

**Se agrego carpeta con el happy path para probar la API 🍻**

⚠️ Si se va a enviar de forma directa request al servicio **delivery-service** se debe tener estar autenticado (por medio de un endpoint se puede obtener un access token para el servicio)

## Poblar la base de datos con datos de prueba

Para poblar la base se habilito un endpoint:
#### Seeder

```http
  POST /seeder
```

que se ejecutara exitosamente siempre y cuando la base este totalmente vacia. El endpoint se encuetra en postman

### Entidades Creadas

#### User admin
- **Name**: user admin
- **Email**: admin@gmail.com
- **Password**: 12345678
- **Address**: 742 Evergreen Terrace
- **Roles**: marketplaceAdmin, marketplaceUser

#### User seller
- **Name**: user seller
- **Email**: seller@gmail.com
- **Password**: 12345678
- **Address**: 742 Evergreen Terrace
- **Roles**: sellerUser, marketplaceUser

#### User
- **Name**: user
- **Email**: user@gmail.com
- **Password**: 12345678
- **Address**: 742 Evergreen Terrace
- **Roles**: marketplaceUser

#### Store
- **Name**: store test
- **Description**: description test
- **SellerUserID**: User seller ID
- **Address**: Scranton, Pensilvania

#### Product
- **Name**: Product test 01
- **Description**: Product description 01
- **Price**: 100
- **SKU**: UUID único
- **Stock**: 10
- **StoreID**: ID de la tienda

#### Product
- **Name**: Product test 02
- **Description**: Product description 02
- **Price**: 100
- **SKU**: UUID único
- **Stock**: 10
- **StoreID**: ID de la tienda

## Testing ⚙️

Para probar manualmente la API existe el happy path del flujo principal de la API. Tambien, para faciliar el proceso de probar la API desde 0 se puede crear un usuario admin agregando la propiedad ``{isAdmin: true}`` al endpoint de ``POST /auth/singUp`` (ejemplo en postman).

se pueden testear todos los requerimientos solicitados con libertad con el resto de endpoints.

endpoints para listar todos los usuarios y tiendas no tiene autenticacion para facilitar el proceso de prueba

### Correr test

Have the services running using docker-compose up.

In another console:
 - ``docker exec ecommerce-service npm test``
 - ``docker exec delivery-service npm test``



## Autores ✒️

Nelson Gallego - nelsoncg0611@gmail.com 

👨‍💻
