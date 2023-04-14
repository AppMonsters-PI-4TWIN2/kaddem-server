const express = require('express')
const {
    createProject,
    deleteProject,
    getProject,
    getProjectsByCreator,
    updateProject,
    projectName,
    decreaseProjectMontant,

    FindAllProjects

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

router.put('/amount/:id/:amount',decreaseProjectMontant)

router.get('/name/:id', projectName);

module.exports = router