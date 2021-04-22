const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require('uuid');

app.use('/', express.static(__dirname +'/..'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // PSEUDO LOGIN
  socket.on("CONNECT", (callback) => {
    let clientID = uuidv4();
    callback(clientID);
  });
  // RESPOND TO AN INPUT EVENT BY UPDATING ONE BOAT + ROD
  socket.on("INPUT", (callback, ...args) => {
    console.log('server:' + event, args);
    callback('dog');
  });

  // AT INTERVALS, RESEND ALL THE DRAWABLES POSITIONS WITH AN UPDATESTATE EVENT
  /*
  console.log('send the cheese');
  io.emit('cheese', 'please');
  */
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});


