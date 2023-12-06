const userModel = require('../models/userModels')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const { use } = require('../routes/userRoutes')



const createToken = (id) => {
    const jwtKey = process.env.JWT_SECRET
    return jwt.sign({ id }, jwtKey)
}



const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) return res.status(400).json({ message: `Please fill the field mark *` })

        let user = await userModel.findOne({ email })
        if (user)
            return res.status(400).json({ message: `User already exist` })

        if (!validator.isEmail(email))
            return res.status(400).json({ message: `please Enter valid email-Id` })

        if (!validator.isStrongPassword(password))
            return res.status(400).json({ message: `Please Enter strong password ` })

        user = new userModel({ email, password, name })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()
        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, name, email, token })

    } catch (error) {
        console.log(error.message)
        res.status(500).json(error)
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: `Please fill the field mark *` })

    try {
        let user = await userModel.findOne({ email })

        if (!user) return res.status(400).json({ message: `Email-id does n't exist!!!` })

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return res.status(400).json({ message: `Password doen't match!!!` })

        const token = createToken(user._id)

        //set cookie parameters
        const options = {
            httpOnly: true
        }

        res.status(200).cookie('token', token, options).json({ _id: user._id, name: user.name, email, token })

    } catch (error) {
        console.log(error.message)
        res.status(500).json(error)
    }


}

const findUser = async (req, res) => {
    const userId = req.params.id

    try {
        const user = await userModel.findById(userId)
        if (!user) return res.status(400).json({ message: `user doesn't exist!!!` })
        res.status(200).json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error)
    }
}


const getUsers = async (req, res) => {

    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error)
    }
}

module.exports = { registerUser, loginUser, findUser, getUsers } 