const express = require('express')

// controller functions
const { loginUser, signupUser, forgotpwd, resetpwd } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

//forgot password
router.post('/forgotpwd', forgotpwd)

//reset password

router.put('/resetpwd', resetpwd)

module.exports = router