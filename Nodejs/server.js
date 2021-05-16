if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true, connectTimeoutMS: 30000, keepAlive: 1
});
client.connect()

const express = require('express')
const http = require('http');
const fs=require('fs');
const path = require('path');

var app = express();
var server=http.createServer(app);
var io = require('socket.io-client');
io = require('socket.io')(server,{
  cors: {
    origin: "http://localhost:100",
    methods: ["GET", "POST"]
}
});
server.listen(100)

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const mongodb = require('./mongodb');
const updatedb = require('./updatedb');
const initializePassport = require('./passport-config');


const {v4 :uuidV4}=require('uuid')

//for chat
const formatMessage = require('./chat_function/utils/messages')
  const {
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./chat_function/utils/users')


initializePassport.initialize(passport,
  async username => await mongodb.findusername(client, username),
  async id => await mongodb.findusernameid(client, id)
)

app.set('view-engine', 'ejs')
app.use(express.static(__dirname + '/views'));


app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: 'baby' })
})
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
})
const botName = 'ChatCord Bot';

  // Run when client connects
  io.on('connection', socket => {
    socket.on('join-video-chat',(roomId,userId)=>{
      console.log(roomId,userId);
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('video-user-connected',userId);
    })
    
    socket.on('video-disconnect',()=>
    {
      socket.to(roomId).broadcast.emit('video-user-disconnected', userId)
    })
    socket.on('joinRoom',  ({ username, room }) => {
      const user =  userJoin(socket.id, username, room);

      socket.join(user.room);

      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users:  getRoomUsers(user.room)
      });
    });

    // Listen for chatMessage
    socket.on('chatMessage',  msg => {
      const user =  getCurrentUser(socket.id);

      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect',  () => {
      const user =  userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users:  getRoomUsers(user.room)
        });
      }
    });
  });
app.get('/chat', checkAuthenticated, (req, res) => {
  app.use(express.static(path.join(__dirname, '/chat_function/public')));
  res.sendFile('E:/Desktop/Nodejs/chat_function/public/index.html');
})

app.get('/videochat', checkAuthenticated, (req,res)=>{
  res.redirect(`/videochat/${uuidV4()}`)
})

app.get('/videochat/:room', checkAuthenticated,(req,res)=>{
  res.render('room.ejs',{roomId:req.params.room});//HERE
})

app.post('/login', checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.'
  }
  ))
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.sendFile('E:/Desktop/Nodejs/views/register.html')

})
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await mongodb.createlisting(client, {
      id: Date.now().toString(), username: req.body.username,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
