const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserRepository = require('../user/repositories/user-repository')
const StoreRepository = require('../store/repositories/store-repository')
const { v4: uuidv4 } = require('uuid')
const { CustomError } = require('../utils/tools-handler-error-utils')


const createFirestoreClient = require('../frameworks/db/firestore')
const firestoreClient = createFirestoreClient()

const userRepository = new UserRepository(firestoreClient)
const storeRepository = new StoreRepository(firestoreClient)

function hashPassword(password) {
    const saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, saltRounds)
    return hashedPassword
}

function comparePassword(password, hash) {
    const match = bcrypt.compareSync(password, hash)
    return match
}

function generateToken(user) {

    const secret = process.env.JWT_SECRET

    const payload = {
        userId: user.id,
        email: user.email,
        potencialActions: user.potencialActions
    }
    const options = {
        expiresIn: '24h'
    }
    return jwt.sign(payload, secret, options)
}

async function verifyToken(req, res, next) {
    const token = req.headers.authorization
    const secret = process.env.JWT_SECRET

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' })
    }

    const tokenBasic = token.replace('Bearer ', '')

    jwt.verify(tokenBasic, secret, async (err, decoded) => {

        const user = await userRepository.getUserById(decoded?.userId)
        const store = await storeRepository.getStoreByUserId(decoded?.userId)

        if (err) {
            if (err?.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' })
            }
            return res.status(401).json({ message: 'Invalid token' })
        } else if (!user) {
            return res.status(401).json({ message: 'User dont exist, please singin again.' })
        }

        req.userId = decoded.userId
        req.storeId = store?.id

        next()
    })
}

async function verifyTokenGuest(req, res, next) {
    const token = req.headers.authorization
    const secret = process.env.JWT_SECRET

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' })
    }

    const tokenBasic = token.replace('Bearer ', '')

    jwt.verify(tokenBasic, secret, async (err, decoded) => {

        if (err) {
            if (err?.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' })
            }
            return res.status(401).json({ message: 'Invalid token' })
        }

        next()
    })
}

function generateTokenGuest() {

    const secret = process.env.JWT_SECRET

    const guestId = uuidv4();
    const payload = { guestId }
    const options = { expiresIn: '24h' }
    return jwt.sign(payload, secret, options)

}

function checkRole(userRoles) {
    return async (req, res, next) => {
        
        const userId = req.userId

        const user = await userRepository.getUserById(userId)

        if (user?.potencialActions && user?.potencialActions?.lenght != 0) {
            for (const role of userRoles) {
                if (user?.potencialActions?.includes(role)) {
                    return next()
                }
            }
        }

        return next(new CustomError(`User is not ${userRoles}`, 400))

    }
}



module.exports = { generateToken, verifyToken, hashPassword, comparePassword, checkRole, generateTokenGuest, verifyTokenGuest }
