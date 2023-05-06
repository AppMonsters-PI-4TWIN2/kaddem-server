const express = require('express')
const { token } = require('morgan');
const router = express.Router()
const {CountList}= require('../controllers/statController');


router.get('/count', CountList);


module.exports = router;