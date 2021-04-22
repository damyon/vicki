'use strict';

// Defines the API for talking from client to server and sending state back and forth.
class Server {
  constructor() {
    this.clientID = false;
    this.socket = io();

    this.socket.emit("CONNECT", (clientID) => {
      console.log('registered with client id ' + clientID);
      this.clientID = clientID;
    });
  
    this.socket.onAny((event, ...args) => {
      console.log('client' + event, args);
    });

    /*
    // GET SOME DRAWABLES FROM SERVER
  var socket = io();

  console.log('ycheese?');
  socket.emit("whycheese", (answer) => {
    console.log('anything:' + answer);
  });

  socket.onAny((event, ...args) => {
    console.log('client' + event, args);
  });
  // END GET SOME DRAWABLES FROM SERVER

  // RESPOND TO A UPDATESTATE EVENT BY POSITIONING ALL THE DRAWABLES
*/
  }
}