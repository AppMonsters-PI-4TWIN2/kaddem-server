require('dotenv').config()
const passport = require('passport')
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const listUser = require('./routes/listUser')

const User = require('./models/userModel')
const chatRoute =require('./routes/chat')
//chat 
const jwt = require('jsonwebtoken')
const Message =require('./models/Message')
const cookieParser = require('cookie-parser');
const jwtSecret =  process.env.jwt_Secret
const ws =require('ws')

const postRoutes = require('./routes/post')
// express app
const app = express()

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
const{recipient , text } =messageData 
if(recipient && text){
  const messageDoc =  await Message.create({
      sender:connection.userId , 
      recipient , 
      text  
    });


    [...wss.clients]
    .filter(c => c.userId === recipient )
    .forEach(c => c.send(JSON.stringify({
        text,
        sender:connection.userId,
        recipient , 
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

