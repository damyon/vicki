class Cloud extends VoxelModel {
  constructor() {
    super();
    this.rotate = Math.random();
    this.blend = 1;
  }

  /**
   * draw
   * Draw the sea.
   * @param gl
   * @param camera
   * @param deltaTime
   * @param absTime
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

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/cloud/textures/cloud.png');

    this.loadVoxels(gl, 'script/models/cloud/voxels.json');
  }
}
