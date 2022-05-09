class Fridge extends VoxelModel {
  constructor() {
    super();
    this.y = 3;
    this.z = -10;
    this.x = 3;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/fridge/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/fridge/voxels.json');
  }
}
