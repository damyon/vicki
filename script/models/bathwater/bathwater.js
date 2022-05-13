class BathWater extends VoxelModel {
  constructor() {
    super();
    this.y = 4;
    this.z = 2.9;
    this.x = 9.2;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/bathwater/textures/texture.png');

    this.loadVoxels(gl, 'script/models/bathwater/voxels.json');
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
