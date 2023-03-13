
// middleware pour vérifier le jeton JWT
function authenticateToken(req, res, next) {
    // récupérer le jeton d'authentification du header de la requête
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401); // le jeton est manquant
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // jeton invalide
      }
  
      req.user = user;
      next();
    });
  }
  
  module.export =  authenticateToken 