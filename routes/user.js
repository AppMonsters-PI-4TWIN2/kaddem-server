const express = require('express')
const passport = require('passport');
const jwt = require('jsonwebtoken');
// controller functions
const { loginUser, signupUser ,updateUser, loginUserGoogle,FindAllUser, forgotpwd, resetpwd  } = require('../controllers/userController')
const requireAuthAndNotBanned = require('../middleware/requireAuthAndNotBanned')
const { route } = require('./listUser')
const { secret, tokenLife } = require('../config/keys');
const User = require("../models/userModel");

const router = express.Router()

// login route
router.post('/login',loginUser)

// signup route
router.post('/signup', signupUser)

//forgot password
router.post('/forgotpwd', forgotpwd)

//reset password

router.put('/resetpwd', resetpwd)
//update user
router.put('/updateuser',updateUser)
router.post('/loginGoogle',loginUserGoogle )

router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
        accessType: 'offline',
        approvalPrompt: 'force'
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false
    }),
    async (req, res) => {

        const email = req.user.email
        const googleId=req.user.googleId
        const createToken = (_id) => {
            return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
        }
        try {
            const user = await User.loginGoogle(email, googleId)

            // create a token
            const token = createToken(user._id)


            res.redirect('http://localhost:3000/googleLogin?email='+email+'&googleId='+googleId)


        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
);

module.exports = router