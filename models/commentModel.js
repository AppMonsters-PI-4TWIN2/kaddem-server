const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    numberOfLikes: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Comment', commentSchema)