const Project = require('../models/Project')
const mongoose = require('mongoose')
const User = require("../models/userModel");

// get all Projects
const getProjects = async (req, res) => {
    const projects = await Project.find({}).sort({createdAt: -1})

    res.status(200).json(projects)
}

// get a single project
const getProject = async (req, res) => {
    try {
        const { ProjectName } = req.params
        const project = await Project.findOne({ProjectName})
        if (!project) {
            return res.status(404).json({ message: 'No such Project' });
        }
        else   {

            res.status(200).json(project);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
}

// create a new project
const createProject = async (req, res) => {
    const {ProjectName, Description, DetailedDescription,Team,LegalConsiderations,AmountAlreadyRaised,Category,ImpactOrGoal,FundingGoal,ProjectLocation,FundingModel,Website,Stage,FundingDeadline,Creator,Image} = req.body

    // add to the database
    try {
        const project = await Project.create({ ProjectName, Description, DetailedDescription,Team,LegalConsiderations,AmountAlreadyRaised,Category,ImpactOrGoal,FundingGoal,ProjectLocation,FundingModel,Website,Stage,FundingDeadline,Creator,Image })
        res.status(200).json(project)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteProject = async (req, res) => {

}

const updateProject = async (req, res) => {

}

module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
}