const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

function generateToken() {

    const secret = process.env.JWT_SECRET
    const guestId = uuidv4();
    const payload = { guestId }
    const options = { expiresIn: '24h' }
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

        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' })
            }
            return res.status(401).json({ message: 'Invalid token' })
        }

        next()
    })
}



module.exports = { generateToken, verifyToken }
