// const http = require('http');
// const express = require('express')
// const User = require('../models/userModel')
// const passport = require('passport');
// const session = require('express-session');
// const LocalStrategy = require('passport-local').Strategy;
// const socketio = require('socket.io');
// const app = express()

// const server = http.createServer(app);

// // configure passport
// passport.use(new LocalStrategy((email, password, done) => {
//   // authenticate user
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   // find user by id
// });

// // configure session middleware
// app.use(session({
//   secret: 'mysecretkey',
//   resave: false,
//   saveUninitialized: false,
// }));

// // initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

// // initialize socket.io
// const io = socketio(server);

// // middleware to check if user is banned
// const authMiddleware = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     const userId = req.user.id;
//     User.findById(userId, (err, user) => {
//       if (err || !user) {
//         return res.redirect('/api/user');
//       }
//       if (user.isBanned) {
//         // send notification to user using socket.io
//         io.to(req.session.socketId).emit('notification', {
//           message: 'You have been banned by an admin.'
//         });
//         // logout user and destroy session
//         req.logout();
//         req.session.destroy();
//         return res.redirect('/api/user');
//       }
//       return next();
//     });
//   } else {
//     return res.redirect('/api/user');
//   }
// };

// // example route that requires authentication and checks if user is banned


// // socket.io connection handler
// io.on('connection', socket => {
//   console.log('New connection: ', socket.id);
//   socket.on('setUserId', userId => {
//     socket.handshake.session.userId = userId;
//     socket.handshake.session.socketId = socket.id;
//     socket.handshake.session.save();
//   });
// });



// module.exports ={authMiddleware}