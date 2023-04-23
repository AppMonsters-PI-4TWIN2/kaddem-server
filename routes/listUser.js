var express = require('express');
const { token } = require('morgan');
var router = express.Router();
 const {FindAllUser,DeleteUser,BannAnUser, searchUser }= require('../controllers/userController');
const  requireAuth  = require('../middleware/requireAuth');
const User = require('../models/userModel');
const { app } = require('../config/keys');
router.use(requireAuth)
/* GET users listing. */
router.get('/users', FindAllUser);

router.delete('/users/:id',DeleteUser) ;

router.put('/users/ban/:id', BannAnUser );

router.get('/search/:key',searchUser)


module.exports = router;
