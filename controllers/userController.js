const dotenv = require('dotenv')
const sgMail = require('@sendgrid/mail')
const bcryptjs = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
dotenv.config()
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email,password, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup a user
const signupUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.signup(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const forgotpwd = async (req,res) => {
    const {email} = req.body
    const URL="http://localhost:3001/resetpwd"

    try {
        const user = await User.findOne({email})
        if (!user){
            res.status(404).json({message: "Error : user doesn't exist"})           
        }
        else {
            res.status(200).json({message: "Welcome"})
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "Kaddemproject@gmail.com",
                subject: "Welcome to Kaddem Project",
                html: `
				<h2>Click the link to reset your password</h2>
				<p>${URL}</p>
			`
                //templateId: 'd-e09cf57a0a0e45e894027ffd5b6caebb',
            };
            sgMail
                .send(msg)
                .then(() => {
                    console.log("Email sent");
                })
                .catch((error) => {
                    console.error(error);
                });
            };
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }

   const resetpwd = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "User don't exists" });
        } else {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);
            await user.save();
    
            res.status(200).json({ message: "password changed" });
        }
    }

module.exports = { signupUser, loginUser, forgotpwd, resetpwd }