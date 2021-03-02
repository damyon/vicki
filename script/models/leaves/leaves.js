class Leaves extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/leaves/textures/leaves.png');

    this.loadVoxels(gl, 'script/models/leaves/voxels.json');
  }
}
