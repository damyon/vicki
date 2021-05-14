class Eyes extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/eyes/texture/white.png');

    this.loadVoxels(gl, 'script/models/eyes/voxels.json');
  }
}
