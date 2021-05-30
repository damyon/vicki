class Line extends VoxelModel {
  constructor() {
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
}
