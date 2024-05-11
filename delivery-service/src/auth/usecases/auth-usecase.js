const {generateToken } = require('../../utils/tools-auth-utils')

class AuthUseCase {

  constructor() {
  }

  async generateTokenGuest() {

    const token = generateToken()

    return { token }

  }

}

module.exports = AuthUseCase;