const jwt = require('jsonwebtoken')



const isAuth = (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        res.status(400).json({ message: `Please login again!!!` })
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(400).json(error)
    }

}

module.exports = isAuth