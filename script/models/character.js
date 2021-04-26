'use strict';

class Character extends Drawable {
  constructor() {
    // Allow passing configuration data to the constructor.
    super();
    this.main = null;
    this.members = [];
    this.lastPath = 0;
    this.targetAngle = 0;
    this.targetSpeed = 0;
    this.targetVerticleAngle = 0;
    this.pathThrottle = 10;
    this.globalRotation = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  setTargetPosition(gl, x, y, z) {
    let delay = 2;
    let diffX = (x - this.x) / delay;
    let diffY = (y - this.y) / delay;
    let diffZ = (z - this.z) / delay;

    let cutoff = 0.1;
    if (this.lastDiffX == undefined) {
      this.lastDiffX = 0;
    }
    if (this.lastDiffY == undefined) {
      this.lastDiffY = 0;
    }
    if (this.lastDiffZ == undefined) {
      this.lastDiffZ = 0;
    }
    
    if (this.lastDiffX > - cutoff && this.lastDiffX < cutoff) {
      this.lastDiffX = 0;
    }
    if (this.lastDiffY > - cutoff && this.lastDiffY < cutoff) {
      this.lastDiffY = 0;
    }
    if (this.lastDiffZ > - cutoff && this.lastDiffZ < cutoff) {
      this.lastDiffZ = 0;
    }

    if (diffX != 0 && this.lastDiffX != 0) {
      if (Math.sign(diffX) != Math.sign(this.lastDiffX)) {
        return;
      }
    }
    if (diffY != 0 && this.lastDiffY != 0) {
      if (Math.sign(diffY) != Math.sign(this.lastDiffY)) {
        return;
      }
    }
    if (diffZ != 0 && this.lastDiffZ != 0) {
      if (Math.sign(diffZ) != Math.sign(this.lastDiffZ)) {
        return;
      }
    }
 
    this.lastDiffX = diffX;
    this.lastDiffY = diffY;
    this.lastDiffZ = diffZ;

    this.setPosition(gl, this.x + diffX, this.y + diffY, this.z + diffZ);
  }

  updatePathThrottle(elapsed) {
    if ((elapsed - this.lastPath) / 10 > this.pathThrottle) {
      this.updatePath();
      this.lastPath = elapsed;
    }
  }

  updatePath() {
    let randomScale = 5;
    // Rotate a random little bit.
    let skewAngle = (-0.5 + Math.random()) * randomScale;
    let skewVerticleAngle = (-0.5 + Math.random()) * randomScale;
    let skewSpeed = (-0.5 + Math.random());
    let minSpeed = 30;

    skewAngle += this.globalRotation;
    skewSpeed *=  minSpeed / 2;
    skewSpeed += minSpeed;
    
    this.targetAngle = skewAngle;
    this.targetSpeed = skewSpeed;
    this.targetVerticleAngle = skewVerticleAngle;
  }

  moveForward(gl, deltaTime, absTime) {
    let stepTime = Math.max(absTime - this.lastPath, 0) / 10;
    let step = {
      x: -deltaTime / 1000 * this.targetSpeed,
      y: 0,
      z: 0
    };
    let q = stepTime / (this.pathThrottle*20);

    if (stepTime > this.pathThrottle*20) {
      q = 1;
    }
    if (this.lastPath == 0) {
      q = 0;
    }

    let smoothAngle = this.globalRotation + ((this.targetAngle - this.globalRotation) * q);

    // Now global rotation.
    let c = Math.cos(smoothAngle);
    let s = Math.sin(smoothAngle);

    // Global rotate
    let targetX = step.x * c - step.z * s;
    let targetZ = step.x * s + step.z * c;
    let targetY = 0;

    targetX += this.x;
    targetY += this.y;
    targetZ += this.z;

    // Apply changes to model.
    this.setGlobalRotation(gl, smoothAngle);
    this.setPosition(gl, targetX, targetY, targetZ);
  }

  /**
   * Apply an offset to the position of all the vertices.
   *
   */
  setPosition(gl, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.main.setPosition(gl, x, y, z);
    let element = null;

    for (element of this.members) {
      element.setPosition(gl, x, y, z)
    }
  }

  evaluateLOD(gl, x, y, z) {
    this.main.evaluateLOD(gl, x, y, z);
    let element = null;

    for (element of this.members) {
      element.evaluateLOD(gl, x, y, z);
    }
  }

  setGlobalRotation(gl, angle) {
    this.globalRotation = angle;
    this.main.setGlobalRotation(gl, angle);
    let element = null;

    for (element of this.members) {
      element.setGlobalRotation(gl, angle);
    }
  }

  initBuffers(gl) {
    this.main.initBuffers(gl);
    let element = null;

    for (element of this.members) {
      element.initBuffers(gl);
    }
  }

  draw(gl, camera, shadow, deltaTime, absTime) {
    let element = null;
    //this.updatePathThrottle(absTime);

    //this.moveForward(gl, deltaTime, absTime);

    if (shadow) {
      gl.uniform1i(camera.isSand, 0);
      this.main.predraw(gl);
      for (element of this.members) {
        element.predraw(gl);
      }
      
    }
    this.main.draw(gl, camera, shadow, deltaTime, absTime);
    for (element of this.members) {
      element.draw(gl, camera, shadow, deltaTime, absTime);
    };
    if (shadow) {
      this.main.postdraw(gl);
      for (element of this.members) {
        element.postdraw(gl);
      }
    }
  }

}
