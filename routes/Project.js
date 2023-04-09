const express = require('express')
const {
    createProject,
    deleteProject,
    getProjects,
    getProject,
    updateProject
} = require('../controllers/projectController')

const router = express.Router()

// GET all Projects
router.get('/', getProjects)

// GET a single Project
router.get('/:ProjectName', getProject)

// POST a new Project
router.post('/new', createProject)

// DELETE a Project
router.delete('/:id', deleteProject)

// UPDATE a Project
router.patch('/:id', updateProject)

module.exports = router