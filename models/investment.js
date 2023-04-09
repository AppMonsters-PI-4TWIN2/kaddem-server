const mongoose =require('mongoose') ; 
const InvestmentSchema = new mongoose.Schema({
idUser:{
    type: String ,
    // type: mongoose.Schema.Types.ObjectId ,
    // ref:'User'
 } ,
idProject : {
    
    type : mongoose.Schema.Types.ObjectId,
    ref:'Project'} , 
montant :{
    type: Number,
    required: true,
},
isValid :{
    type :Boolean ,
    default :false , 
}

},{timestamps:true});

module.exports = mongoose.model('Investment', InvestmentSchema)