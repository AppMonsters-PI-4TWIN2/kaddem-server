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
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    FundingDeadline:{
        type: Date
    },
    IsVerified:{
        type: Number,
        default:0
    },
    Creator : {
        type : mongoose.Schema.Types.ObjectId,ref:'User'
    } ,

}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)