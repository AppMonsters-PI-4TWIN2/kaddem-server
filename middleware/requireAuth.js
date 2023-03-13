const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
 
  if (!token) {
    console.log("wkefna leeeeen a");
    return res.sendStatus(401); // Unauthorized
   
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
      console.log("wala len a");
    }
    req.user = user;
    next();
  });
}

const requireAuth = async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({ _id }).select('_id')
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request is not authorized'})
    }
}

module.exports ={ requireAuth ,authenticateToken}