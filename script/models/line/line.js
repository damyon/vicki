class Line extends VoxelModel {
  constructor() {
    // There is a better way to create a line, but this will do for now.
    super();
    this.verticalScale = 20;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
   initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/line/textures/line.jpg');

    this.loadVoxels(gl, 'script/models/line/voxels.json');
  }

  updateLength(gl, length) {
    this.verticalScale = length;
    this.setPosition(gl, this.x, this.y, this.z);
  }
}
