const express = require('express')
const { findAllInvestment, addInvestment, DeleteInvestment, updateInvestment, validInvestment } = require('../controllers/investmentController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

router.get('/all',findAllInvestment)
router.post('/add',addInvestment)
router.delete('/delete/:id',DeleteInvestment)
router.post('/update/:id',updateInvestment)
router.put('/valid/:id',validInvestment)
module.exports = router