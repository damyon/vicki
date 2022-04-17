
class Controls {

  constructor(canvas) {
    // We set up controls so that we can drag our mouse or finger to adjust the rotation of
    // the camera about the X and Y axes
    this.canvasIsPressed = false;
    this.yRotation = 0;
    this.xRotation = -Math.PI / 15;
    
    this.x = 0;
    this.y = -4.5;
    this.z = -10;
    
    this.maxSpeed = 1;
    this.forwardSpeed = 0;
    this.groundLimit = -0.36;
    this.lastPressX;
    this.lastPressY;
   
    this.actionForward = false;
    this.actionBackward = false;
    this.actionRight = false;
    this.actionLeft = false;
    this.actionCast = false;
    this.rodRotate = Math.PI/4;

    canvas.onclick = function() {
      this.requestPointerLock();
    };
    this.canvas = canvas;
    document.addEventListener('pointerlockchange', this.togglePointerLock.bind(this), false);
    
    window.addEventListener('keydown', function (e) {
      switch(e.keyCode) {
        case 38:
        case 87:
          this.actionForward = true;
          break;
        case 83:
        case 40:
          this.actionBackward = true;
          break;
        case 65:
        case 37:
          this.actionLeft = true;
          break;
        case 68:
        case 39:
          this.actionRight = true;
          break;
        case 32:
          if (!this.toggleCast) {
            this.actionCast = !this.actionCast;
          }
          this.toggleCast = true;
          break;
      }
      
    }.bind(this), false);

    window.addEventListener('keyup', function (e) {
      switch(e.keyCode) {
        case 38:
        case 87:
          this.actionForward = false;
          break;
        case 83:
        case 40:
          this.actionBackward = false;
          break;
        case 65:
        case 37:
          this.actionLeft = false;
          break;
        case 68:
        case 39:
          this.actionRight = false;
          break;
        case 32:
          this.toggleCast = false;
          break;
      }
      
    }.bind(this), false);

    // As you drag your finger we move the camera
    canvas.addEventListener('touchstart', function (e) {
      this.lastPressX = e.touches[0].clientX;
      this.lastPressY = e.touches[0].clientY;
    }.bind(this));
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      this.xRotation += (this.lastPressY - e.touches[0].clientY) / 500;
      this.yRotation += (e.touches[0].clientX - this.lastPressX) / 500;

      this.xRotation = Math.min(this.xRotation, Math.PI / 2.5);
      this.xRotation = Math.max(this.xRotation, -Math.PI / 2.5);

      this.lastPressX = e.touches[0].clientX;
      this.lastPressY = e.touches[0].clientY;
    }.bind(this));
  }

  onmousemove(e) {
    if (this.canvasIsPressed) {
      this.xRotation -= (e.movementY) / 3550;
      this.yRotation += (e.movementX) / 3550;

      this.xRotation = Math.min(this.xRotation, Math.PI / 2.5);
      this.xRotation = Math.max(this.xRotation, -Math.PI / 2.5);

      this.lastPressX = e.pageX;
      this.lastPressY = e.pageY;
    }
  }

  togglePointerLock() {
    let canvas = this.canvas;
    let handler = this.onmousemove.bind(this);
    if (document.pointerLockElement === canvas) {
      this.canvasIsPressed = true;
      console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", handler, false);
    } else {
      this.canvasIsPressed = false;
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", handler, false);
    }
  }

  processKeys() {
    let moveSpeed = 0.1;

    if (this.actionForward) {
      this.forwardSpeed += moveSpeed;
    }
    if (this.actionBackward) {
      this.forwardSpeed -= moveSpeed;
    }
    if (this.forwardSpeed) {
      var positionChange = this.moveForward();

      this.x = this.x - positionChange[0];
      this.z = this.z + positionChange[2];
    }
    this.forwardSpeed *= 0.3;
  }
  

  moveForward() {
    var cameraMatrix = mat4.create();
    var xRotMatrix = mat4.create();
    var yRotMatrix = mat4.create();
    
    mat4.rotateY(yRotMatrix, yRotMatrix, this.yRotation);
    mat4.multiply(cameraMatrix, yRotMatrix, cameraMatrix);
    mat4.invert(cameraMatrix, cameraMatrix);

    // Speed limit.
    this.forwardSpeed = Math.min(this.forwardSpeed, 1.6);
    this.forwardSpeed = Math.max(this.forwardSpeed, -1.6);
    
    return [cameraMatrix[2] * this.forwardSpeed,
      cameraMatrix[6] * this.forwardSpeed,
      cameraMatrix[10] * this.forwardSpeed
    ];
  }

}
