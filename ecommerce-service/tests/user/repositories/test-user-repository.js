const { UserPotencialActions } = require('../../../src/user/entities/user-entities')
const sinon = require('sinon')
const assert = require('assert')
const UserRepository = require('../../../src/user/repositories/user-repository')
const createFirestoreClient = require('../../../src/frameworks/db/firestore')
const { faker } = require('@faker-js/faker')

describe("UserRepository", function () {

  let userRepository

  beforeEach(function () {
    const firestoreClient = createFirestoreClient()
    userRepository = new UserRepository(firestoreClient, true)
  })

  afterEach(async function () {
    await userRepository.deleteAllUsers()
  })

  it("should create a new user", async function () {
    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      shippingAddres: faker.location.streetAddress(),
      password: faker.internet.password(),
      potencialActions: [UserPotencialActions.marketplaceUser]
    }

    const createdUser = await userRepository.createUser(newUser)

    assert.equal(createdUser.name, newUser.name)
    assert.equal(createdUser.email, newUser.email)
    assert.equal(createdUser.shippingAddres, newUser.shippingAddres)
    assert.equal(createdUser.password, newUser.password)
    assert.equal(createdUser.potencialActions.length, newUser.potencialActions.length)
  })

  it('should add a role to a user', async function () {
    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      shippingAddres: faker.location.streetAddress(),
      password: faker.internet.password(),
      potencialActions: [UserPotencialActions.marketplaceUser]
    }
    const createdUser = await userRepository.createUser(newUser)

    const newRole = UserPotencialActions.marketplaceUser
    await userRepository.addRoleUser(createdUser.id, newRole)

    const updatedUser = await userRepository.getUserById(createdUser.id)

    assert(updatedUser.potencialActions.includes(newRole))
  })

  it('should remove a role to a user', async function () {
    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      shippingAddres: faker.location.streetAddress(),
      password: faker.internet.password(),
      potencialActions: [UserPotencialActions.marketplaceUser, UserPotencialActions.sellerUser]
    }
    const createdUser = await userRepository.createUser(newUser)

    const removeRole = UserPotencialActions.sellerUser
    await userRepository.removeRoleUser(createdUser.id, removeRole)

    const updatedUser = await userRepository.getUserById(createdUser.id)

    assert(!updatedUser.potencialActions.includes(removeRole))
  })

  it('should get all users', async function () {
    const usersData = [
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        shippingAddres: faker.location.streetAddress(),
        password: faker.internet.password(),
        potencialActions: [UserPotencialActions.marketplaceUser]
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        shippingAddres: faker.location.streetAddress(),
        password: faker.internet.password(),
        potencialActions: [UserPotencialActions.marketplaceUser]
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        shippingAddres: faker.location.streetAddress(),
        password: faker.internet.password(),
        potencialActions: [UserPotencialActions.marketplaceUser]
      }
    ]
    const createdUsers = []
    for (const userData of usersData) {
      const createdUser = await userRepository.createUser(userData)
      createdUsers.push(createdUser)
    }

    const users = await userRepository.getUsers()
    assert.strictEqual(users.length, createdUsers.length)
    for (const user of users) {
      const matchingUser = createdUsers.find(userCreated => userCreated.id === user.id)
      assert(matchingUser)
    }
  })

})
