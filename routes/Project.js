const express = require('express')
const {
    createProject,
    deleteProject,
    getProject,
    getProjectsByCreator,
    updateProject,
    projectName,
    decreaseProjectMontant,


    FindAllProjects,
    search,

    incrementAmountAlreadyRaised,
    

} = require('../controllers/projectController')

const router = express.Router()

// GET all Projects
router.get('/projects', FindAllProjects)

// GET a single Project
router.get('/:ProjectName', getProject)

// GET Projects by creatorId
router.get('/projects/:Creator', getProjectsByCreator)

// POST a new Project
router.post('/new', createProject)

// DELETE a Project
router.delete('/:id', deleteProject)
    
// UPDATE a Project
router.put('/:ProjectName', updateProject)

// UPDATE a Project
router.patch('/incrementAmountAlreadyRaised/:id/:montant', incrementAmountAlreadyRaised)
router.put('/amount/:id/:amount',decreaseProjectMontant)

router.get('/name/:id', projectName);

 router.get('/search/:key',search)
 
module.exports = router