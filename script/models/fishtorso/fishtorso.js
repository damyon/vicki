class FishTorso extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/fishtorso/textures/fishtorso.jpg');

    this.loadVoxels(gl, 'script/models/fishtorso/voxels.json');
  }
}
