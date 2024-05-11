const { UserPotencialActions, User } = require('../../user/entities/user-entities')
const { Store } = require('../../store/entities/store-entities')
const { Product } = require('../../product/entities/product-entities')
const { CustomError } = require('../../utils/tools-handler-error-utils');
const { hashPassword } = require('../../utils/tools-auth-utils')
const { v4: uuidv4 } = require('uuid')

class SeederUseCase {

  constructor(productRepository, storeRepository, userRepository) {
    this.productRepository = productRepository
    this.storeRepository = storeRepository
    this.userRepository = userRepository
  }

  async seeder() {

    const users = await this.userRepository.getUsers()

    if (users.length == 0) {

      const marketplaceAdmin = new User(
        'user admin',
        'admin@gmail.com',
        '742 Evergreen Terrace',
        hashPassword('12345678'),
        [UserPotencialActions.marketplaceAdmin, UserPotencialActions.marketplaceUser]
      )

      const sellerUser = new User(
        'user seller',
        'seller@gmail.com',
        '742 Evergreen Terrace',
        hashPassword('12345678'),
        [UserPotencialActions.sellerUser, UserPotencialActions.marketplaceUser]
      )

      const marketplaceUser = new User(
        'user',
        'user@gmail.com',
        '742 Evergreen Terrace',
        hashPassword('12345678'),
        [UserPotencialActions.marketplaceUser]
      )

      const [_marketplaceAdmin, sellerUserCreated, _marketplaceUser] = await Promise.all([marketplaceAdmin, sellerUser, marketplaceUser].map(user => this.userRepository.createUser(user)))


      const store = new Store(
        'store test',
        'description test',
        sellerUserCreated.id,
        'Scranton, Pensilvania'
      )

      const storeCreated = await this.storeRepository.createStore(store)

      const products = [
        new Product(
          'Product test 01',
          'Product description 01',
          100,
          uuidv4(),
          10,
          storeCreated.id
        ),
        new Product(
          'Product test 02',
          'Product description 02',
          100,
          uuidv4(),
          10,
          storeCreated.id
        )
      ]

      await Promise.all(products.map(product => this.productRepository.createProduct(product)))

      return true

    } else {
      throw new CustomError('the base cannot be populated if it is not completely empty', 400)
    }

  }
}

module.exports = SeederUseCase;
