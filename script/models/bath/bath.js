class Bath extends VoxelModel {
  constructor() {
    super();
    this.y = 4;
    this.z = 2.9;
    this.x = 9.2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/bath/textures/texture.png');

    this.loadVoxels(gl, 'script/models/bath/voxels.json');
  }
}
