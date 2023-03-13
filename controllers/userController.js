const dotenv = require('dotenv')
const sgMail = require('@sendgrid/mail')
const bcryptjs = require('bcryptjs')
dotenv.config()
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

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
        const role = user.role 
        // create a token
        const token = createToken(user._id)
         res.status(200).json({email,password,role, token})
    } else {
      res.status(403).json({error: 'Accès interdit you are banned'});
    }
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

//affichage list users 
// const FindAllUser = async(req, res)=>{
// try{
// const data =await User.find(); 
// res.status(201).json(data);
// }catch(error){
//     console.log(error.message) ; 
// }
// }
const FindAllUser = async (req, res) => {
    try {
      // const token = req.headers.authorization.split(' ')[1]; // Récupère le token de l'en-tête de la requête
      // jwt.verify(token, process.env.SECRET); // Vérifie que le token est valide en utilisant la clé secrète

      const users = await User.find({ role: 'user' });
     // res.status(200).set('Authorization', `Bearer ${token}`).json(users); // Définit l'en-tête Authorization dans la réponse
     res.status(200).set('Authorization').json(users);
   
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


module.exports = { signupUser, loginUser,FindAllUser ,DeleteUser,BannAnUser,  forgotpwd, resetpwd}