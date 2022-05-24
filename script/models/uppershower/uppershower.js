class UpperShower extends VoxelModel {
  constructor() {
    super();
    this.y = 9.3;
    this.z = -5.3;
    this.x = -2.8;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/uppershower/textures/texture.png');

    this.loadVoxels(gl, 'script/models/uppershower/voxels.json');
  }

  /**
   * Support transcluency
   */
  draw(gl, camera, shadow, deltaTime, absTime) {
   
    if (shadow) {
      gl.uniform1i(camera.isWater, 1);
    } else {
      return;
    }

    // Call the parent.
    VoxelModel.prototype.draw.call(this, gl, camera, shadow, deltaTime, absTime);
  }
}
