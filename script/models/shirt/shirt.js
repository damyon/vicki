class Shirt extends VoxelModel {
  constructor() {
    super();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/shirt/texture/shirt.png');

    this.loadVoxels(gl, 'script/models/shirt/voxels.json');
  }
}
