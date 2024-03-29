const express = require('express')
const {
    createProject,
    deleteProject,
    getProject,
    getProjectsByCreator,
    updateProject,
    projectName,
    decreaseProjectMontant,
    getProjects,

    FindAllProjects,
    search,

    incrementAmountAlreadyRaised, VerifyProject,
    

} = require('../controllers/projectController')

const router = express.Router()

// GET all Projects
router.get('/projects', FindAllProjects)
router.get('/getProjects', getProjects)

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
router.patch('/verify/:id',VerifyProject)
router.get('/name/:id', projectName);

 router.get('/search/:key',search)
 
module.exports = router