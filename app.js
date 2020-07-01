var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('body-parser');
const port = 8000
var app = require('express')();
var http = require('http');
var server = app.listen(port);
let io     = require('socket.io')(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let username = ''
app.get('/', function(req, res, next) {
  app = req.app.get('ssoHostname')
  console.log('bab')
  res.render('register');
});
//save name
app.post('/chat', function(req, res, next) {

  username = req.body.username
  res.send({url:'chat', username: username})
});

app.get('/chat', function(req, res, next) {
  console.log(username)
  if (username.length ===0){
    res.redirect('/');
  }
  res.render('chatroom',{username : username});
});
io.on('connection', (socket) => {


  socket.on('chat message', (msg) => {

    socket.broadcast.emit('chat message', {text:msg,username:socket.username});


  });

  socket.on('new user',(username)=>{
    socket.username = username
    var message = username + ' connected ';
    socket.broadcast.emit('user connected',{text:message,username:socket.username})



  })
  socket.on('disconnect', function() {
    var msg =   socket.username +' disconnected'
    socket.broadcast.emit('chat message', {text:msg,username:''});
  });
  socket.on('typing', function(typing, stopped){
    var msg =socket.username+' is typing...'
    if (typing === false ){
      socket.broadcast.emit('typing', {text:msg,username:''} )
    }else if(stopped === true){
      socket.broadcast.emit('stopped');
    }
  });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
