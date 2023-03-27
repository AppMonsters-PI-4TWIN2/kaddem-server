var express = require('express');
const { token } = require('morgan');
var router = express.Router();
 const {FindAllUser,DeleteUser,BannAnUser }= require('../controllers/userController');
const  requireAuth  = require('../middleware/requireAuth');

router.use(requireAuth)
/* GET users listing. */
router.get('/users', FindAllUser);

router.delete('/users/:id',DeleteUser) ;

router.put('/users/ban/:id', BannAnUser );


module.exports = router;
