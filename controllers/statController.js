const Investment = require("../models/investment");
const User = require('../models/userModel')
const Project = require('../models/Project')
const Message = require('../models/Message')
const Post = require('../models/postModel')

const CountList = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const projectCount = await Project.countDocuments();
        const messageCount = await Message.countDocuments();
        const postCount = await Post.countDocuments();
        const investmentCount = await Investment.countDocuments();
        const acceptedInvestmentCount = await Investment.countDocuments({isValid: "accepted"});
        const verifiedProjectCount = await Project.countDocuments({IsVerified: 1});
        const bannedUsersCount = await User.countDocuments({isBanned: true});


        return res.json({userCount,projectCount,messageCount,postCount,investmentCount,verifiedProjectCount,bannedUsersCount,acceptedInvestmentCount});
    } catch (error) {
        throw new Error(error.message);
    }
}
module.exports ={CountList}