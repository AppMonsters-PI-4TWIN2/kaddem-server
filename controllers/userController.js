const dotenv = require('dotenv')
const sgMail = require('@sendgrid/mail')
const bcryptjs = require('bcryptjs')
dotenv.config()
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const cloudinary=require("../Utils/Cloudinary");


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
       
        const user = await User.login(email, password)
        if(user.isBanned==false )
        {
        const id =user.id    
        const role = user.role
        const firstName=user.firstName
        const lastName=user.lastName
        const avatar=user.avatar
        const aboutMe=user.aboutMe
        const country=user.country
        const region=user.region
        const phoneNumber=user.phoneNumber
        const userName=user.userName
        // create a token
        const token = createToken(user._id)
        jwt.sign({userId:user._id,email,firstName,lastName}, process.env.JWT_SECRET, {}, (err, token) => {
         res.status(200).cookie('token', token, {sameSite:'lax', secure:true}).json({id,email,role, token,firstName,lastName,avatar,aboutMe,country,region,phoneNumber,userName})
        }) ;
        } else {
      res.status(403).json({error: 'Accès interdit you are banned'});
    }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const loginUserGoogle = async (req, res) => {
    const {email, googleId} = req.body

    try {
        const user = await User.loginGoogle(email, googleId)

        // create a token
        const token = createToken(user._id)
        const id =user.id
        const role = user.role
        const firstName=user.firstName
        const lastName=user.lastName
        const avatar=user.avatar
        const aboutMe=user.aboutMe
        const country=user.country
        const region=user.region
        const phoneNumber=user.phoneNumber
        const userName=user.userName

        jwt.sign({userId:user._id,email,firstName ,token , lastName}, process.env.JWT_SECRET, {}, (err, token) => {
            res.status(200).cookie('token', token, {sameSite:'lax', secure:true}).json({id,email,role, token,firstName,lastName,avatar,aboutMe,country,region,phoneNumber,userName})
           }) ;   
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
// signup a user
const signupUser = async (req, res) => {
    const {email, password} = req.body
    const URL="http://localhost:3000/login"

    try {
        const user = await User.signup(email, password)

        // create a token
        const token = createToken(user._id)
      
        const id =user.id  
        jwt.sign({userId:user._id,email}, process.env.JWT_SECRET, {}, (err, token) => {
        res.cookie('token', token, {sameSite:'lax', secure:true}).status(200).json({email,id , token, message: "User added successfully ... plz verify your email to activate the account"})
    });
     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "Kaddemproject@gmail.com",
                subject: "Welcome to Kaddem Project",
                html: `
				<h2>Click the link to verify your Account</h2>
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
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const signupUserGoogle = async (req, res) => {
    const email = req.user.email
    const googleId = req.googleId

    try {
        const user = await User.signupGoogle(email, googleId)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//affichage list users 
// const FindAllUser = async(req, res)=>{
// try{
// const data =await User.find(); 
// res.status(201).json(data);
// }catch(error){
//     console.log(error.message) ; 
// }
// }
const findUser=async (req,res) =>{
    try {
        const userName=req.params.userName
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        else   {

            res.status(200).json(user);
        }
    }
        catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }

}

const findUserById=async (req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        else   {

            res.status(200).json(user);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }

}

const FindAllUser = async (req, res) => {
    try {
          const users = await User.find({ role: 'user' });

     res.status(200).json(users);
   
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const DeleteUser = async(req,res)=>{
    try{
await User.deleteOne({_id:req.params.id})
res.status(201).json({message:"Usser deleted with success"})
    }catch(error){
console.log(error.message)
    }
}

const BannAnUser =async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }else if(user.isBanned == false)
   {   user.isBanned = true;
      await user.save();
      res.json({ message: 'Utilisateur banni avec succès' });}
      else   {  
         user.isBanned = false;
        await user.save();
        res.json({ message: 'Utilisateur debanni avec succès' });}
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la tentative de bannissement de l\'utilisateur' });
    }
  }

  const forgotpwd = async (req,res) => {
    const {email} = req.body
    const URL="http://localhost:3000/resetpwd"

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
        const { email, password, newpassword } = req.body;

        try {
            const user = await User.findOne({ email });
            const user2 = await User.resetpwd(password, newpassword)
            if (user2) {
                res.status(400).json({ error: "passwords don't match" });
            }
            if (!user) {
                res.status(400).json({ error: "User don't exists" });
            } else{
                const salt = await bcryptjs.genSalt(10);
                user.password = await bcryptjs.hash(password, salt);
                await user.save();
        
                res.status(200).json({ message: "password changed" });
            }
    
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
const updateUser = async (req, res) => {
    const { email } = req.body



    const user = await User.findOneAndUpdate({email: email}, {
        ...req.body
    })

    if (!user) {
        return res.status(400).json({error: 'No such user'})
    }

    const id =user.id
    const role = user.role
    const firstName=user.firstName
    const lastName=user.lastName
    const avatar=user.avatar
    const aboutMe=user.aboutMe
    const country=user.country
    const region=user.region
    const phoneNumber=user.phoneNumber
    const userName=user.userName
    // create a token
    const token = createToken(user._id)
    jwt.sign({userId:user._id,email,firstName,lastName}, process.env.JWT_SECRET, {}, (err, token) => {
        res.status(200).cookie('token', token, {sameSite:'lax', secure:true}).json({id,email,role, token,firstName,lastName,avatar,aboutMe,country,region,phoneNumber,userName})
    }) ;

}
const firstNameAndLastname = async (req, res) => {
    try {
      // Récupérer l'utilisateur en utilisant son adresse e-mail
      const user = await User.findById(req.params.id).select('firstName lastName');
  
      if (!user) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas." });
      }
  
      // Retourner le prénom et le nom de famille de l'utilisateur
      res.json({ firstName: user.firstName, lastName: user.lastName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue.' });
    } 
}

const searchUser = async(req,res)=> {
    let result = await User.find({
        "$or":[
            {
                firstName :{$regex:req.params.key}
            } ,
            {
                lastName : {$regex:req.params.key}
            }
        ]
    }); 
    res.send(result)
      }


module.exports = { searchUser ,signupUser,updateUser, loginUser,FindAllUser ,createToken,firstNameAndLastname,signupUserGoogle,loginUserGoogle,DeleteUser,BannAnUser,  forgotpwd, resetpwd,findUser,findUserById}