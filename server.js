require('dotenv').config()
const passport = require('passport')
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const listUser = require('./routes/listUser')
const User = require('./models/userModel')
const chatRoute =require('./routes/chat')
//chat 
const fs =require('fs')
const jwt = require('jsonwebtoken')
const Message =require('./models/Message')
const cookieParser = require('cookie-parser');
const jwtSecret =  process.env.jwt_Secret
const ws =require('ws')

const postRoutes = require('./routes/post')
// express app
const app = express()
app.use('/uploads', express.static(__dirname + '/uploads'));
// middleware
app.use(express.json())

app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/list',listUser)
app.use('/chat',chatRoute)


app.use('/post',postRoutes )

app.use("/posts", express.static("public"));

app.get('/users/:email', async (req, res) => {
  try {
    // Récupérer l'utilisateur en utilisant son adresse e-mail
    const user = await User.findOne({ email: req.params.email }).select('firstName lastName');

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas." });
    }

    // Retourner le prénom et le nom de famille de l'utilisateur
    res.json({ firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
});

require('./config/passport')(app);
// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        const server=  app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
        function notifyAboutOnlinePeople(){
          //notify everyone about online people
          [...wss.clients].forEach(client => {
           client.send(JSON.stringify({
             online : [...wss.clients].map(c =>({userId:c.userId,email:c.email,firstName :c.firstName, lastName :c.lastName}))
          }))
          } )
       }
        
       //chat        
const wss = new ws.WebSocketServer({server})    
wss.on('connection',(connection,req) => {




connection.isAlive = true ; 
connection.timer =  setInterval(() => {
  connection.ping() ; 
  connection.deathTimer= setTimeout(() => {
    connection.isAlive =false ; 
   connection.terminate();
   notifyAboutOnlinePeople()
  },1000) 
},3000)

connection.on('pong' ,() => {
 clearTimeout(connection.deathTimer) 
})

    // read username and id from the cookie for this connection 
const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
          jwt.verify(token, jwtSecret, {}, (err, userData) => {
          const {userId, email,firstName , lastName} = userData;
          connection.userId = userId;
          connection.email = email ;
          connection.firstName = firstName ;
          connection.lastName =lastName ; 
          console.log("useerrrrr daaaaata")
          console.log(userData)
        });
      }
    }
  }

connection.on('message',async (message ) => {
const messageData = JSON.parse( message.toString() );   
console.log(messageData) 
const{recipient , text ,file} =messageData 
if(file){
  const parts = file.name.split('.');
  const ext = parts[parts.length - 1];
  filename = Date.now() + '.'+ext;
  const path = __dirname + '/uploads/' + filename;
  const bufferData = new Buffer(file.data.split(',')[1], 'base64');
fs.writeFile(path, bufferData, () => {
   console.log('file saved:'+path);
      });
}
if(recipient && (text || file)){
  const messageDoc =  await Message.create({
      sender:connection.userId , 
      recipient , 
      text  ,
      file :filename || null , 
    });


    [...wss.clients]
    .filter(c => c.userId === recipient )
    .forEach(c => c.send(JSON.stringify({
        text,
        sender:connection.userId,
        recipient , 
        file :file ? filename : null ,
        _id:messageDoc._id
        })))   ; 
          
}

});

notifyAboutOnlinePeople();
 

});
    })
    
    .catch((error) => {
        console.log(error)
    })

