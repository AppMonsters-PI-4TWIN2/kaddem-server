const express = require('express')
const { findAllInvestment, addInvestment, DeleteInvestment, updateInvestment, validInvestment, searchInvestment, findValidInvestmentsByProjectId } = require('../controllers/investmentController')
const requireAuth = require('../middleware/requireAuth')
const investment = require('../models/investment')
const router = express.Router()

//router.use(requireAuth)

router.get('/all',findAllInvestment)
router.post('/add',addInvestment)
router.delete('/delete/:id',DeleteInvestment)
router.post('/update/:id',updateInvestment)
router.put('/valid/:id',validInvestment)
router.put('/investment/:id',updateInvestment);
router.get('/search/:key',searchInvestment)
router.get('/findById/:idProject',findValidInvestmentsByProjectId)
module.exports = router