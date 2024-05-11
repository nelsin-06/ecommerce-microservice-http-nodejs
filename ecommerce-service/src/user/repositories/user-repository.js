const { UserDocument } = require('../entities/user-entities')
const { serializeData } = require('../../utils/tools-db-utils')
const { Firestore } = require('@google-cloud/firestore')
// Implementación con Firestore para el repositorio de ${entity}.
// Recibe la conexión con Firestore externamente.

class UserRepository {

  constructor(firestoreClient, test = false) {

    this.collectionName = 'users'

    if (test) {
      this.collectionName += "_test";
    }

    this.UsersCollectionRef = firestoreClient.collection(this.collectionName);
    this.test = test;

  }

  _getUserFromDocument(doc) {

    const id = doc.id;
    const data = doc.data();

    return new UserDocument(id, data.name, data.email, data.shippingAddres, data.password, data.potencialActions);

  }

  async getUsers() {

    let users = await this.UsersCollectionRef.get()
    users = users.docs.map(user => this._getUserFromDocument(user))

    return users

  }

  async createUser(newUser) {

    const user = await this.UsersCollectionRef.add(serializeData(newUser));

    return this._getUserFromDocument(await user.get())

  }

  async getUserById(userId) {

    let user = await this.UsersCollectionRef.doc(userId).get()

    if (!user.exists) return null

    return this._getUserFromDocument(user)

  }

  async getUserByEmail(email) {

    const user = await this.UsersCollectionRef.where('email', '==', email).get()

    if (user.empty) return null

    const userData = this._getUserFromDocument(user.docs[0])
    return userData

  }

  async checkUserExistByEmail(email) {

    const user = await this.getUserByEmail(email)

    return user ? true : false

  }


  async addRoleUser(userId, newRole) {

    return await this.UsersCollectionRef.doc(userId).update({
      potencialActions: Firestore.FieldValue.arrayUnion(newRole)
    })

  }

  async removeRoleUser(userId, role) {

    return await this.UsersCollectionRef.doc(userId).update({
      potencialActions: Firestore.FieldValue.arrayRemove(role)
    })

  }

  async deleteUser(userId) {
    return await this.UsersCollectionRef.doc(userId).delete()
  }

  async deleteAllUsers() {

    if (this.test) {
      const users = await this.getUsers()
      for (const user of users) {
        await this.deleteUser(user.id);
      }
    }
  }

}

module.exports = UserRepository;