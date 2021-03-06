class SharkTail extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/sharktail/textures/sharktail.jpg');

    this.loadVoxels(gl, 'script/models/sharktail/voxels.json');
  }

  setWaveRotation(gl, offset) {

    let angle = Math.sin(offset * 0.2) / 14;
    
    this.setPositionRotation(gl, this.x, this.y, this.z, angle);
  }
  

  /**
   * draw
   * Draw the terrain.
   * @param gl
   * @param programInfo
   * @param deltaTime
   * @param absTime
   * @param matrices
   */
  draw(gl, camera, shadow, deltaTime, absTime) {
    // Call the parent.
    ProjectedModel.prototype.draw.call(this, gl, camera, shadow, deltaTime, absTime);

    this.setWaveRotation(gl, absTime);
  }
}
