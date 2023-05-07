const mongoose =require('mongoose') ; 
const ReportSchema = new mongoose.Schema({

    reported:{type: mongoose.Schema.Types.ObjectId ,ref:'User' } ,

    reportedBy : {type : mongoose.Schema.Types.ObjectId,ref:'User'} , 

    reason:String ,
     date: {
    type: Date,
    default: Date.now ,
 },  
  isTraited: { 
    type: Boolean
  },
 project :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
 }

},{timestamps:true});

const ReportModel = mongoose.model('Report',ReportSchema)
module.exports = ReportModel