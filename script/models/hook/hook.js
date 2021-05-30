class Hook extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/hook/textures/hook.jpg');

    this.loadVoxels(gl, 'script/models/hook/voxels.json');
  }
}
