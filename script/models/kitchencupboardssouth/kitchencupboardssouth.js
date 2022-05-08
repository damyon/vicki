class KitchenCupboardsSouth extends VoxelModel {
  constructor() {
    super();
    this.y = 3;
    this.z = -6;
    this.x = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/kitchencupboardssouth/textures/bench.jpg');

    this.loadVoxels(gl, 'script/models/kitchencupboardssouth/voxels.json');
  }
}
