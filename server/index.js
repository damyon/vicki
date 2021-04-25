const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require('uuid');

app.use('/', express.static(__dirname +'/..'));
let fishCount = 8;
let sharkCount = 3;
let state = initState(fishCount, sharkCount);

io.on('connection', (socket) => {
  let clientID = uuidv4();
  console.log('a user connected: ' + clientID);
  
  socket.on('disconnect', () => {
    console.log('user disconnected' + clientID);
    delete state[clientID];
  });

  // PSEUDO LOGIN
  socket.on("CONNECT", (callback) => {
    
    state[clientID] = {
      type: 'Boat',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      animator: clientDrivenAnimator      
    };
    initClientDrivenAnimator(state[clientID]);
    
    callback(clientID, Object.keys(state).length - fishCount - sharkCount);
  });

  socket.on("BOATSTATE", (position) => {
    if (state[clientID]) {
      state[clientID].x = position.x;
      state[clientID].y = position.y;
      state[clientID].z = position.z;
      state[clientID].rotate = position.rotate;
    }
  });
  // RESPOND TO AN INPUT EVENT BY UPDATING ONE BOAT + ROD
  socket.on("INPUT", (callback, ...args) => {
    console.log('server:' + event, args);
    callback('dog');
  });

});
function initClientDrivenAnimator() {

}

function clientDrivenAnimator(model) {

}

// AT INTERVALS, RESEND ALL THE DRAWABLES POSITIONS WITH AN UPDATESTATE EVENT
let stateUpdateInterval = 200;


function updateCharacterPath(model) {
  let randomScale = 5;
  // Rotate a random little bit.
  let skewAngle = (-0.5 + Math.random()) * randomScale;
  let skewVerticalAngle = (-0.5 + Math.random()) * randomScale;
  let skewSpeed = (-0.5 + Math.random());
  let minSpeed = 30;

  skewAngle += model.globalRotation;
  skewSpeed *=  minSpeed / 2;
  skewSpeed += minSpeed;
  
  model.targetAngle = skewAngle;
  model.targetSpeed = skewSpeed;
  model.targetVerticalAngle = skewVerticalAngle;
}

function moveCharacterForward(model, deltaTime) {
  let step = {
    x: -deltaTime / 20000 * model.targetSpeed,
    y: 0,
    z: 0
  };
  let q = 0.05;

  let smoothAngle = model.globalRotation + ((model.targetAngle - model.globalRotation) * q);

  // Now global rotation.
  let c = Math.cos(smoothAngle);
  let s = Math.sin(smoothAngle);

  // Global rotate
  let targetX = step.x * c - step.z * s;
  let targetZ = step.x * s + step.z * c;
  let targetY = 0;

  targetX += model.x;
  targetY += model.y;
  targetZ += model.z;

  // Apply changes to model.
  model.globalRotation = smoothAngle;
  model.x = targetX;
  model.y = targetY;
  model.z = targetZ;
}

function characterAnimator(model) {
  updateCharacterPath(model);
  moveCharacterForward(model, stateUpdateInterval);
}

function initCharacterAnimator(model) {
  model.targetAngle = 0;
  model.targetSpeed = 0;
  model.targetVerticleAngle = 0;
  model.pathThrottle = 10;
  model.globalRotation = 0;
}

function initState(fishCount, sharkCount) {
  let i = 0, init = {};

  for (i = 0; i < fishCount; i++) {
    let stateID = uuidv4();
    
    init[stateID] = {
      type: 'Dhufish',
      x: 100*Math.sin(10*i),
      y: -3,
      z: 100*Math.cos(10*i),
      animator: characterAnimator      
    };
    initCharacterAnimator(init[stateID]);
  }

  for (i = 0; i < sharkCount; i++) {
    let stateID = uuidv4();
    
    init[stateID] = {
      type: 'Shark',
      x: 50*Math.sin(10*i),
      y: -3,
      z: 50*Math.cos(10*i),
      animator: characterAnimator      
    };
    initCharacterAnimator(init[stateID]);
  }

  return init;
}



setInterval(() => {
  let key = '';
  for (key in state) {
    let model = state[key];

    model.animator(model);
  }

  io.emit('UPDATESTATE', state);
}, stateUpdateInterval);

server.listen(3000, () => {
  console.log('listening on *:3000');
});


