'use strict';

// Defines the API for talking from client to server and sending state back and forth.
class Server {
  constructor(gl, drawables, controls, drawMethod) {
    this.clientID = false;
    this.socket = io();
    this.map = [];
    this.drawables = drawables;
    this.drawMethod = drawMethod;
    this.classMap = {
      'Dhufish': Dhufish,
      'Shark': Shark,
      'Boat': Boat,
      'Rod': Rod,
      'Legs': Legs,
      'Shirt': Shirt,
      'Head': Head,
      'Eyes': Eyes,
      'Hook': Hook,
      'Line': Line,
    };

    this.socket.emit("CONNECT", (clientID, load) => {
      console.log('registered with client id ' + clientID);
      this.clientID = clientID;
      controls.x += (load * 10);
      this.drawMethod();
    });
  
    this.socket.on("UPDATESTATE", (state) => {
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
        if ("length" in value) {
          this.map[key].updateLength(gl, value.length);
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

  updateLegPositionRotation(x, y, z, rotate) {
    this.socket.emit("LEGSTATE", { x: x, y: y, z: z, rotate: rotate});
  }

  updateShirtPositionRotation(x, y, z, rotate) {
    this.socket.emit("SHIRTSTATE", { x: x, y: y, z: z, rotate: rotate});
  }

  updateEyesPositionRotation(x, y, z, rotate) {
    this.socket.emit("EYESSTATE", { x: x, y: y, z: z, rotate: rotate});
  }

  updateHeadPositionRotation(x, y, z, rotate) {
    this.socket.emit("HEADSTATE", { x: x, y: y, z: z, rotate: rotate});
  }

  updateRodPositionRotation(x, y, z, rotate, rotateHorizontal) {
    this.socket.emit("RODSTATE", { x: x, y: y, z: z, rotate: rotate, rotateHorizontal: rotateHorizontal});
  }

  updateHookPositionRotation(x, y, z, rotate, rotateHorizontal) {
    this.socket.emit("HOOKSTATE", { x: x, y: y, z: z, rotate: rotate, rotateHorizontal: rotateHorizontal});
  }

  updateLinePositionRotation(x, y, z, rotate, rotateHorizontal, length) {
    this.socket.emit("LINESTATE", { x: x, y: y, z: z, rotate: rotate, rotateHorizontal: rotateHorizontal, length});
  }

}
