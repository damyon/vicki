class Rod extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/rod/textures/rod.jpg');

    this.loadVoxels(gl, 'script/models/rod/voxels.json');
  }
}
