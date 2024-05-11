const { Store } = require('../entities/store-entities')
const { CustomError } = require('../../utils/tools-handler-error-utils');
const { UserPotencialActions } = require('../../user/entities/user-entities');

class StoreUseCase {

  constructor(storeRepository, userRepository) {
    this.storeRepository = storeRepository;
    this.userRepository = userRepository
  }

  async createStore(body) {

    const store = await this.storeRepository.getStoreByUserId(body.userSellerId)
    if (store) {
      throw new CustomError('The user already has a store.', 400)
    }

    const user = await this.userRepository.getUserById(body.userSellerId)
    if (!user) {
      throw new CustomError('The user dont exist.', 404)
    }

    const newStore = new Store(
      body.name,
      body.description,
      body.userSellerId,
      body.warehouseAddress
    )

    const storeCreated = await this.storeRepository.createStore(newStore)

    await this.userRepository.addRoleUser(body.userSellerId, UserPotencialActions.sellerUser)

    return storeCreated
  }

  async getStores() {
    return await this.storeRepository.getStores()
  }

  async updateStoreByStoreId(storeId, updateStore, userId) {

    const user = await this.userRepository.getUserById(userId)
    const store = await this.storeRepository.getStoreByStoreId(storeId)

    if (!store) {
      throw new CustomError('The store dont exist.', 404)
    }

    if (
      store?.userSellerId !== user?.id &&
      !user?.potencialActions.includes(UserPotencialActions.marketplaceAdmin)
    ) {
      throw new CustomError("you do not have the permissions to edit another user's store", 400)
    }

    await this.storeRepository.updateStoreByStoreId(storeId, updateStore)

    return true
  }

  async deleteStoreByStoreId(storeId) {

    const store = await this.storeRepository.getStoreByStoreId(storeId)

    if (!store) {
      throw new CustomError('The store dont exist.', 404)
    }

    await this.userRepository.removeRoleUser(store.userSellerId, UserPotencialActions.sellerUser)
    await this.storeRepository.deleteStoreByStoreId(storeId)

    return true
  }

  async getStoreByUserId(userId) {
    const store = await this.storeRepository.getStoreByUserId(userId)

    if (!store) {
      throw new CustomError('The user dont have store.', 404)
    }

    return store
  }

  async getStoreByStoreId(storeId) {
    const store = await this.storeRepository.getStoreByStoreId(storeId)

    if (!store) {
      throw new CustomError('The store dont exist.', 404)
    }

    return store
  }

}

module.exports = StoreUseCase;
