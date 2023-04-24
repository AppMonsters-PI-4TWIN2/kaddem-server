const Project = require('../models/Project')
const mongoose = require('mongoose')
const User = require("../models/userModel");
const cloudinary=require("../Utils/Cloudinary");


// get all Projects
const ITEMS_PER_PAGE = 20;
const FindAllProjects = async (req, res) => {
    try {
        const PAGE_SIZE = 3;
        const page = parseInt(req.query.page || "0");
        const total = await Project.countDocuments({});
        const projects = await Project.find({})
          .limit(PAGE_SIZE)
          .skip(PAGE_SIZE * page);
        res.status(200).json({
          totalPages: Math.ceil(total / PAGE_SIZE),
          projects,
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ messagse: 'Internal server error' });
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
        //external api upload image from the cloudinary
        const result= await cloudinary.uploader.upload(Image,{
            folder:"ProjectAssets",
            //width:300,
           // crop:"scale"
        });
        const project = await Project.create({ ProjectName, Description, DetailedDescription,Team,LegalConsiderations,AmountAlreadyRaised,Category,ImpactOrGoal,FundingGoal,ProjectLocation,FundingModel,Website,Stage,FundingDeadline,Creator,
            Image:{
            public_id:result.public_id,
                url:result.secure_url

            }
        })
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
      res.json({ projectName: project.ProjectName, category: project.Category, creator :project.Creator,id:project.id});

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

  const search = async(req,res)=> {
let result = await Project.find({
    "$or":[
        {
            ProjectName:{$regex:req.params.key}
        }
    ]
});
res.send(result)
  }


const incrementAmountAlreadyRaised = async (req, res) => {
    const projectId = req.params.id; // get the project ID from the request parameters
    const montant = Number(req.params.montant); // get the amount to increment from the request parameters

    Project.findByIdAndUpdate(projectId, { $inc: { AmountAlreadyRaised: montant } }, { new: true })
        .then(updatedProject => {
            res.status(200).json(updatedProject); // return the updated project as a JSON response
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        });
}
module.exports = {
    search,
    FindAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject ,
    projectName ,
    decreaseProjectMontant,
    getProjectsByCreator,
    incrementAmountAlreadyRaised
}