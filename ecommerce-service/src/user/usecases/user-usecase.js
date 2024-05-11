class UserUseCase {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUsers() {

    return await this.userRepository.getUsers()
    
  }
}

module.exports = UserUseCase;