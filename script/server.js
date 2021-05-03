'use strict';

// Defines the API for talking from client to server and sending state back and forth.
class Server {
  constructor(gl, drawables, controls) {
    this.clientID = false;
    this.socket = io();
    this.map = [];
    this.drawables = drawables;
    this.classMap = {
      'Dhufish': Dhufish,
      'Shark': Shark,
      'Boat': Boat,
      'Rod': Rod
    };

    this.socket.emit("CONNECT", (clientID, load) => {
      console.log('registered with client id ' + clientID);
      this.clientID = clientID;
      controls.x += (load * 10);
    });
  
    this.socket.on("UPDATESTATE", (state) => {
      console.log('state', state);
      let key = '', value = {}, i = 0;

      for (key in state) {
        value = state[key];

        if (!(key in this.map)) {
          // value.type is a classname and using window accesses that class in global scope.
          this.map[key] = new (this.classMap[value.type])();
          this.map[key].initBuffers(gl);
          this.drawables.unshift(this.map[key]);
        }

        if ("rotate" in value) {
          this.map[key].setRotation(gl, value.rotate);
        }
        if ("globalRotation" in value) {
          this.map[key].setGlobalRotation(gl, value.globalRotation);
        }
        if ("roll" in value) {
          this.map[key].rotateHorizontal(gl, value.roll);
        }
        this.map[key].setTargetPosition(gl, value.x, value.y, value.z);
        
      }
      // Delete stuff that is in map but no longer in state.
      for (key in this.map) {
       
        if (!(key in state)) {
          // Purge it!
          for (i in this.drawables) {
            if (this.drawables[i] == this.map[key]) {
              this.drawables.splice(i, 1);
            }
          }

          this.map.splice(key, 1);

        }
      }

    });

  }

  updateBoatPositionRotation(x, y, z, rotate) {
    this.socket.emit("BOATSTATE", { x: x, y: y, z: z, rotate: rotate});
  }

  updateRodPositionRotation(x, y, z, rotate) {
    this.socket.emit("RODSTATE", { x: x, y: y, z: z, rotate: rotate});
  }
}