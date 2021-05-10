class Legs extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/legs/textures/denim.png');

    this.loadVoxels(gl, 'script/models/legs/voxels.json');
  }
}
