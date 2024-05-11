const { User, UserPotencialActions } = require('../../user/entities/user-entities')
const { hashPassword, generateToken, comparePassword, generateTokenGuest } = require('../../utils/tools-auth-utils')
const { CustomError } = require('../../utils/tools-handler-error-utils')

class AuthUseCase {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signUp(body) {

    const userExist = await this.userRepository.checkUserExistByEmail(body.email)

    if (userExist) {
      throw new CustomError('User already exist with the same email.', 400)
    }

    const password = hashPassword(body.password)
    const potencialActions = [UserPotencialActions.marketplaceUser]

    if(body?.isAdmin) {
      potencialActions.push(UserPotencialActions.marketplaceAdmin)
    }

    const newUser = new User(
      body.name,
      body.email,
      body.shippingAddres,
      password,
      potencialActions
    )

    const user = await this.userRepository.createUser(newUser)

    const token = generateToken(user)

    return { token, user }

  }

  async signIn(body) {

    let singInSuccessfully = false

    const user = await this.userRepository.getUserByEmail(body.email)

    if (user) {
      const isSamePassword = comparePassword(body.password, user.password)
      if (isSamePassword) {
        singInSuccessfully = true
      }
    }

    if (singInSuccessfully) {

      const token = generateToken(user)

      return { token, user }
    } else {
      throw new CustomError('Invalid credentials.', 400)
    }
  }

  async generateTokenGuest() {

    const token = generateTokenGuest()

    return { token }

  }

}

module.exports = AuthUseCase;