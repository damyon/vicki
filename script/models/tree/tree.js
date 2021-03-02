class Tree extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/tree/textures/tree.jpg');

    this.loadVoxels(gl, 'script/models/tree/voxels.json');
  }
}
