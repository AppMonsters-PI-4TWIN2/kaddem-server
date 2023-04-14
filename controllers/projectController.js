const Project = require('../models/Project')
const mongoose = require('mongoose')
const User = require("../models/userModel");

// get all Projects
const FindAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();

        res.status(200).json(projects);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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
const getProjectsByCreator = async (req, res) => {
    try {
        const { Creator } = req.params
        const projects = await Project.find({Creator:Creator})
        res.status(200).json(projects);
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
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such project'})
    }

    const project = await Project.findOneAndDelete({_id: id})

    if(!project) {
        return res.status(400).json({error: 'No such project'})
    }

    res.status(200).json(project)

}

const updateProject = async (req, res) => {
    const { ProjectName } = req.params

    const project = await Project.findOneAndUpdate({ProjectName: ProjectName}, {
        ...req.body
    })

    if (!project) {
        return res.status(400).json({error: 'No such project'})
    }

    res.status(200).json(project)
}
const projectName =async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).select('ProjectName Category Creator');
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json({ projectName: project.ProjectName, category: project.Category, creator :project.Creator});
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue.' });
      }
  }


  const decreaseProjectMontant = async (projectId, amount) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      project.AmountAlreadyRaised -= amount;
      await project.save();
      return project;
    } catch (error) {
      throw new Error(error.message);
    }
  };
module.exports = {
    FindAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject ,
    projectName ,
    decreaseProjectMontant,
    getProjectsByCreator
}