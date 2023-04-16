const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const postSchema = new Schema({
    owner: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
     },
     caption: {
         type: String,
         required: true,
     },
    project : {
    type : mongoose.Schema.Types.ObjectId,ref:'projects'
    },
image: {
         type: String,
     },
     likes: [
         {
             type: Schema.Types.ObjectId,
             ref: "User",
             default: [],
         },
     ],
     comments: [
         {
             type: Schema.Types.ObjectId,
             ref: "Comment",
             default: [],
         },
     ],
     createdAt: {
         type: Date,
         default: Date.now,
     },
     numberOfLikes: {
         type: Number,
         default: 0,
     },
     numberOfComments: {
         type: Number,
         default: 0,
     },
     numberOfComments: {
         type: Number,
         default: 0,
     },
     numberOfShares: {
         type: Number,
         default: 0,
     },
 });

 module.exports = mongoose.model('Post', postSchema)