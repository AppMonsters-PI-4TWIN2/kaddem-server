const investment = require("../models/investment");
const Investment = require("../models/investment");

const findAllInvestment = async (req ,res) => {

  try{
        const data =await Investment.find(); 
        res.status(201).json(data);
        }catch(error){
            console.log(error.message) ; 
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

const updateInvestment = async (req, res) => {
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




module.exports ={findAllInvestment,addInvestment,DeleteInvestment,updateInvestment,validInvestment}