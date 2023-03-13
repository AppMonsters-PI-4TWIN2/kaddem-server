const express = require('express')

// controller functions
const { loginUser, signupUser, FindAllUser } = require('../controllers/userController')
const requireAuthAndNotBanned = require('../middleware/requireAuthAndNotBanned')
const { route } = require('./listUser')


const router = express.Router()

// login route
router.post('/login',loginUser)

// signup route
router.post('/signup', signupUser)


module.exports = router