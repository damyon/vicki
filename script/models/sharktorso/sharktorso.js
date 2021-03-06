class SharkTorso extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/sharktorso/textures/sharktorso.jpg');

    this.loadVoxels(gl, 'script/models/sharktorso/voxels.json');
  }
}
