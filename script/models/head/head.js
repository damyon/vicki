class Head extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/head/texture/skin.png');

    this.loadVoxels(gl, 'script/models/head/voxels.json');
  }
}
