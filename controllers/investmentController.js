const investment = require("../models/investment");
const Investment = require("../models/investment");
const Project = require('../models/Project')
const findAllInvestment = async (req ,res) => {

  try{
        const data =await Investment.find(); 
        res.status(201).json(data);
        }catch(error){
            console.log(error.message) ; 
            res.status(500).json({ message: 'Internal server error' });
   
        }

        
}

const findValidInvestmentsByProjectId = async (req, res) => {
  const idProject = req.params.idProject;
  try {
    const data = await Investment.find({ idProject: idProject, isValid: 'accepted'  }).populate({
      path: 'idUser',
      select: 'userName',
    }).sort({ createdAt: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}





const addInvestment = async (req, res) => {
    try {
        const { idUser, idProject, montant } = req.body;

        // const userExists = await User.findOne({ email });

        // if (userExists) return res.status(200).json(userExists);

        const newInvestment = await investment.create({
            idUser,
            idProject,
            montant,
        });

        res.status(200).json(newInvestment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const DeleteInvestment = async(req,res)=>{
    try{
await Investment.deleteOne({_id:req.params.id})
res.status(201).json({message:"Investment deleted with success"})
    }catch(error){
console.log(error.message)
    }
}

const updateInvestment1 = async (req, res) => {
//     const { id } = req.body
//    const investment = await Investment.findOneAndUpdate({_id: id}, {
//         ...req.body
//     })

//     if (!investment) {
//         return res.status(400).json({error: 'No such investment'})
//     }

//     res.status(200).json(investment)

}
const validInvestment =async (req, res) => {
    try {
      const investment = await Investment.findById(req.params.id);
      if (!investment) {
        return res.status(404).json({ message: 'investement non trouvé' });
     
      }
      else if(investment.isValid == false)
      {  
       investment.isValid = true;
      await investment.save();
      res.json({ message: 'Utilisateur banni avec succès' });
      }
      else 
        {  
        investment.isValid = false;
        await investment.save();
        res.json({ message: 'Utilisateur debanni avec succès' });}
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la tentative de bannissement de l\'utilisateur' });
    }
  }



  const updateInvestment = async (req, res) => {
    const { id } = req.params;
    const { isValid } = req.body;
  
    try {
      const investment = await Investment.findByIdAndUpdate(id, { isValid }, { new: true });
  
      if (!investment) {
        return res.status(404).json({ error: 'Investment not found' });
      }
  
      return res.json(investment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
const projectInvestedInByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const investments = await Investment.find({ idUser: id, isValid: 'accepted' });
        const projectNames = [];

        for (const investment of investments) {
            if (investment.idProject) {
                const project = await Project.findById(investment.idProject);
                if (project) {
                    projectNames.push(project.ProjectName);
                }
            }
        }

        res.json(projectNames);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const statsInvestmentByCreatorId = async (req, res) => {
    const { id } = req.params;

    try {
        const projects = await Project.find({ Creator: id });

        let countAcceptedInvestment = 0;
        let countPendingInvestment = 0;
        let totalAmountReceived = 0;

        await Promise.all(
            projects.map(async (project) => {
                const investments = await Investment.find({
                    idProject: project._id,
                    isValid: "accepted",
                });

                countAcceptedInvestment += investments.length;

                const pendingInvestments = await Investment.find({
                    idProject: project._id,
                    isValid: "pending",
                });

                countPendingInvestment += pendingInvestments.length;

                investments.forEach((investment) => {
                    totalAmountReceived += investment.montant;
                });
            })
        );

        return res.json({
            countAcceptedInvestment,
            countPendingInvestment,
            totalAmountReceived,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const statsInvestmentByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const investments = await Investment.find({ idUser: id});
        let countRejectedInvestments = 0;
        let countAcceptedInvestments = 0;
        let countAmountInvested = 0;

        investments.forEach((investment) => {
            if (investment.isValid === "rejected") {
                countRejectedInvestments++;
            } else if (investment.isValid === "accepted") {
                countAcceptedInvestments++;
                countAmountInvested += investment.montant;
            }
        });

        res.json({
            countRejectedInvestments,
            countAcceptedInvestments,
            countAmountInvested
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
  const searchInvestment = async(req,res)=> {
    let result = await Investment.find({
        "$or":[
           
            {
                isValid : {$regex:req.params.key}
            }
        ]
    }); 
    res.send(result)
      }


module.exports ={findValidInvestmentsByProjectId,searchInvestment,findAllInvestment,addInvestment,updateInvestment ,DeleteInvestment,updateInvestment,validInvestment,projectInvestedInByUserId, statsInvestmentByUserId,statsInvestmentByCreatorId}