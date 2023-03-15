const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)
        const role =user.role

        res.status(200).json({email,password, token,role})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const loginUserGoogle = async (req, res) => {
    const {email, googleId} = req.body

    try {
        const user = await User.loginGoogle(email, googleId)

        // create a token
        const token = createToken(user._id)
        const role =user.role

        res.status(200).json({email, token,role})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup a user
const signupUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.signup(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signupUserGoogle = async (req, res) => {
    const email = req.user.email
    const googleId = req.googleId

    try {
        const user = await User.signupGoogle(email, googleId)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = { signupUser, loginUser ,createToken,signupUserGoogle,loginUserGoogle}