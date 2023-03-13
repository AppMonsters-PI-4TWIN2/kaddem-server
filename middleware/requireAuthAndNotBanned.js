
const jwt = require('jsonwebtoken');
const requireAuthAndNotBanned = async (req, res, next) => {
    // vérifier si l'utilisateur est authentifié
    const { authorization } = req.headers;
  
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
  
    const token = authorization.split(' ')[1];
  
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
  
      // vérifier si l'utilisateur est banni
      const user = await User.findById(decodedToken._id);
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      if (user.isBanned) {
        // détruire le jeton d'authentification
        res.clearCookie('token');
        return res.status(401).json({ error: 'Your account has been banned' });
      }
  
      // ajouter l'utilisateur à l'objet de demande
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid authorization token' });
    }
  };



module.exports =  requireAuthAndNotBanned