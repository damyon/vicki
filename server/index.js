const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require('uuid');

app.use('/', express.static(__dirname +'/..'));
let fishCount = 4;
let sharkCount = 1;
let state = initState(fishCount, sharkCount);

io.on('connection', (socket) => {
  let clientID = uuidv4();
  console.log('a user connected: ' + clientID);
  
  socket.on('disconnect', () => {
    console.log('user disconnected: ' + clientID);
    
    delete state[clientID + '-boat'];
    delete state[clientID + '-hook'];
    delete state[clientID + '-rod'];
    delete state[clientID + '-legs'];
    delete state[clientID + '-shirt'];
    delete state[clientID + '-head'];
    delete state[clientID + '-eyes'];
  });

  // PSEUDO LOGIN
  socket.on("CONNECT", (callback) => {
    
    state[clientID + '-boat'] = {
      type: 'Boat',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      animator: clientDrivenAnimator      
    };
    state[clientID + '-rod'] = {
      type: 'Rod',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      roll: Math.PI/3,
      animator: clientDrivenAnimator      
    };
    state[clientID + '-hook'] = {
      type: 'Hook',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      roll: Math.PI/3,
      animator: clientDrivenAnimator      
    };
    state[clientID + '-legs'] = {
      type: 'Legs',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      animator: clientDrivenAnimator      
    };
    state[clientID + '-shirt'] = {
      type: 'Shirt',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      animator: clientDrivenAnimator      
    };
    state[clientID + '-head'] = {
      type: 'Head',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      animator: clientDrivenAnimator      
    };
    state[clientID + '-eyes'] = {
      type: 'Eyes',
      x: 10 * state.length,
      y: 0,
      z: 102,
      rotation: Math.PI,
      animator: clientDrivenAnimator      
    };
    
    initClientDrivenAnimator(state[clientID + '-boat']);
    initClientDrivenAnimator(state[clientID + '-rod']);
    initClientDrivenAnimator(state[clientID + '-legs']);
    initClientDrivenAnimator(state[clientID + '-shirt']);
    initClientDrivenAnimator(state[clientID + '-head']);
    initClientDrivenAnimator(state[clientID + '-eyes']);
    
    callback(clientID, Object.keys(state).length - fishCount - sharkCount);
  });

  socket.on("BOATSTATE", (position) => {
    if (state[clientID + '-boat']) {
      state[clientID + '-boat'].x = position.x;
      state[clientID + '-boat'].y = position.y;
      state[clientID + '-boat'].z = position.z;
      state[clientID + '-boat'].rotate = position.rotate;
    }
  });

  socket.on("LEGSTATE", (position) => {
    if (state[clientID + '-legs']) {
      state[clientID + '-legs'].x = position.x;
      state[clientID + '-legs'].y = position.y;
      state[clientID + '-legs'].z = position.z;
      state[clientID + '-legs'].rotate = position.rotate;
    }
  });

  socket.on("SHIRTSTATE", (position) => {
    if (state[clientID + '-shirt']) {
      state[clientID + '-shirt'].x = position.x;
      state[clientID + '-shirt'].y = position.y;
      state[clientID + '-shirt'].z = position.z;
      state[clientID + '-shirt'].rotate = position.rotate;
    }
  });

  socket.on("EYESSTATE", (position) => {
    if (state[clientID + '-eyes']) {
      state[clientID + '-eyes'].x = position.x;
      state[clientID + '-eyes'].y = position.y;
      state[clientID + '-eyes'].z = position.z;
      state[clientID + '-eyes'].rotate = position.rotate;
    }
  });

  socket.on("HEADSTATE", (position) => {
    if (state[clientID + '-head']) {
      state[clientID + '-head'].x = position.x;
      state[clientID + '-head'].y = position.y;
      state[clientID + '-head'].z = position.z;
      state[clientID + '-head'].rotate = position.rotate;
    }
  });
  
  socket.on("RODSTATE", (position) => {
    if (state[clientID + '-rod']) {
      state[clientID + '-rod'].x = position.x;
      state[clientID + '-rod'].y = position.y;
      state[clientID + '-rod'].z = position.z;
      state[clientID + '-rod'].rotate = position.rotate;
      state[clientID + '-rod'].roll = position.rotateHorizontal;
    }
  });

  socket.on("HOOKSTATE", (position) => {
    if (state[clientID + '-hook']) {
      state[clientID + '-hook'].x = position.x;
      state[clientID + '-hook'].y = position.y;
      state[clientID + '-hook'].z = position.z;
      state[clientID + '-hook'].rotate = position.rotate;
      state[clientID + '-hook'].roll = position.rotateHorizontal;
    }
  });

  // RESPOND TO AN INPUT EVENT BY UPDATING ONE BOAT + ROD
  socket.on("INPUT", (callback, ...args) => {
    console.log('server:' + event, args);
  });

});
function initClientDrivenAnimator() {

}

function clientDrivenAnimator(model) {

}

// AT INTERVALS, RESEND ALL THE DRAWABLES POSITIONS WITH AN UPDATESTATE EVENT
let stateUpdateInterval = 100;


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


