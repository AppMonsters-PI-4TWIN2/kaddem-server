const express = require('express')
const { findAllReport, addReport, Traited } = require('../controllers/reportController')

const router = express.Router()
router.get('/all',findAllReport)
router.post('/add',addReport)
router.put('/traited/:id',Traited)



module.exports = router