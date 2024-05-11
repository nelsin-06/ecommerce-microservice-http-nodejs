const { User, UserPotencialActions } = require('../../../src/user/entities/user-entities')
const AuthUseCase = require('../../../src/auth/usecases/auth-usecase')
const { CustomError } = require('../../../src/utils/tools-handler-error-utils')
const sinon = require('sinon')
const assert = require('assert')
const { hashPassword } = require('../../../src/utils/tools-auth-utils')
const { faker } = require('@faker-js/faker')


describe('AuthUseCase', () => {
  let userRepositoryStub
  let authUseCase

  beforeEach(() => {
    userRepositoryStub = {
      checkUserExistByEmail: sinon.stub(),
      createUser: sinon.stub(),
      getUserByEmail: sinon.stub()
    }

    authUseCase = new AuthUseCase(userRepositoryStub)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should sign up a new user', async () => {
    userRepositoryStub.checkUserExistByEmail.resolves(false)

    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      shippingAddres: faker.location.streetAddress(),
      password: faker.internet.password(),
      isAdmin: false
    }

    const user = new User(
      newUser.name,
      newUser.email,
      newUser.shippingAddres,
      newUser.password,
      [UserPotencialActions.marketplaceUser]
    )

    userRepositoryStub.createUser.resolves(user)

    const result = await authUseCase.signUp(newUser)

    assert.ok(result.token)
    assert.deepStrictEqual(result.user, user)
  })

  it('should throw an error if user already exists', async () => {
    userRepositoryStub.checkUserExistByEmail.resolves(true)

    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      shippingAddres: faker.location.streetAddress(),
      password: faker.internet.password(),
      isAdmin: false
    }

    await assert.rejects(async () => {
      await authUseCase.signUp(newUser)
    }, CustomError)
  })

  it('should sign up a new marketplaceAdmin user', async () => {
    userRepositoryStub.checkUserExistByEmail.resolves(false)

    const newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      shippingAddres: faker.location.streetAddress(),
      password: faker.internet.password(),
      isAdmin: true
    }

    const user = new User(
      newUser.name,
      newUser.email,
      newUser.shippingAddres,
      newUser.password,
      [UserPotencialActions.marketplaceUser, UserPotencialActions.marketplaceAdmin]
    )

    userRepositoryStub.createUser.resolves(user)

    const result = await authUseCase.signUp(newUser)

    assert.ok(result.token)
    assert.deepStrictEqual(result.user, user)
  })

  it('should sign in a user with valid credentials', async () => {

    const password = faker.internet.password()

    const user = new User(
      faker.person.fullName(),
      faker.internet.email(),
      faker.location.streetAddress(),
      hashPassword(password),
      [UserPotencialActions.marketplaceUser]
    )

    userRepositoryStub.getUserByEmail.resolves(user)

    const result = await authUseCase.signIn({
      email: faker.internet.email(),
      password: password
    })

    assert.ok(result.token)
    assert.deepStrictEqual(result.user, user)
  })

  it('should throw an error if credentials are invalid', async () => {
    userRepositoryStub.getUserByEmail.resolves(null)

    assert.rejects(async () => {
      await authUseCase.signIn({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
    }, CustomError)
  })

})