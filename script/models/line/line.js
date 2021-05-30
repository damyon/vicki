class Line extends VoxelModel {
  constructor() {
    // There is a better way to create a line, but this will do for now.
    super();
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

  updateLength(length) {
    // Dance.
  }
}
