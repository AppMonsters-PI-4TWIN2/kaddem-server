const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
    ProjectName: {
        type: String,
        required: true,
        unique:true
    },
    Description: {
        type: String,
        required: true
    },
    DetailedDescription:{
        type: String,
        required: true
    },
    Category:{
        type: String
    },
    ImpactOrGoal:{
        type: String
    },
    FundingGoal:{
    type: Number
    },
    AmountAlreadyRaised:{
        type: Number
    },
    ProjectLocation:{
        type: String
    },
    Stage:{
        type: String
    },
    FundingModel:{
        type: String
    },
    Team:{
        type: String
    },
    LegalConsiderations:{
        type: String
    },
    Website:{
        type: String
    },
    Image:{
        type: String
    },
    FundingDeadline:{
        type: Date
    },
    Creator : {
        type : mongoose.Schema.Types.ObjectId,ref:'User'
    } ,

}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)