var express = require('express');
const { token } = require('morgan');
var router = express.Router();
const  requireAuth  = require('../middleware/requireAuth');
const User = require('../models/userModel')
const Message =require('../models/Message');
const jwt = require('jsonwebtoken')
/* GET users . */
const jwtSecret =  process.env.jwt_Secret

// async function getUserFromRequest(req) {
//     return new Promise((resolve, reject)=> {
//       const token = req.cookies?.token ;
//       if(token){
//         jwt.verify(token, jwtSecret, {}, (err, userData) => {
//           if(err) throw err ; 
//       resolve(userData) ; 
//         });
//       }else {
//         reject('no token ')
//       }
//     });
//   }


  async function getUserFromRequest(req) {
    return new Promise((resolve, reject) => {
      const token = req.cookies?.token;
      if (!token) {
        reject('no token');
        return;
      }
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(userData);
      });
    });
  }
  
  
// router.get('/messages/:userId',async(req,res)=> {
//     const {userId} = req.params ; 
//     const userData = await getUserFromRequest(req);
//     const ourUserId = userData.userId
//    const messages = await Message.find({
//      sender:{$in:[userId,ourUserId]}, 
//        recipient:{$in:[userId,ourUserId]}
//     }).sort({createdAt: 1}) ; 
//     res.json(messages)
//    })

   router.get('/messages/:userId',async(req,res)=> {
    try {
      const {userId} = req.params ; 
      const userData = await getUserFromRequest(req);
      const ourUserId = userData.userId
      const messages = await Message.find({
        sender:{$in:[userId,ourUserId]}, 
        recipient:{$in:[userId,ourUserId]}
      }).sort({createdAt: 1}) ; 
      res.json(messages)
    } catch (error) {
      res.status(401).json({error: "Unauthorized access: " + error});
    }
  })

  
router.get('/people',async (req,res) => {
    const users = await  User.find({}, {'_id':1 ,email:1 ,firstName :1 ,lastName :1})
   res.json(users)
   })


module.exports = router;
