const ReportModel = require("../models/report");

const findAllReport = async (req ,res) => {

    try{
          const data =await ReportModel.find().populate('reported','userName')
          .populate('reportedBy','userName') 
          .populate('project','ProjectName').sort({createdAt: -1});  
          res.status(201).json(data);
          }catch(error){
              console.log(error.message) ; 
              res.status(500).json({ message: 'Internal server error' });
     
          }
  
  }

  const addReport = async (req, res) => {
    try {
        const { reported, reportedBy,isTraited,project, reason } = req.body;

        // const userExists = await User.findOne({ email });

        // if (userExists) return res.status(200).json(userExists);

        const newReport = await ReportModel.create({
            reported,
            reportedBy,
            reason,
            project,
            isTraited
        });

        res.status(200).json(newReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const Traited =async (req, res) => {
    try {
      const report = await ReportModel.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Report non trouvé' });
      }else if(report.isTraited == false) {
           report.isTraited = true;
          await report.save();
      res.json({ message: 'Utilisateur banni avec succès' });}
      else   {  
        report.isTraited = false;
        await report.save();
        res.json({ message: 'Utilisateur debanni avec succès' });}
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la tentative de bannissement de l\'utilisateur' });
    }
  }


module.exports = { findAllReport ,addReport,Traited}