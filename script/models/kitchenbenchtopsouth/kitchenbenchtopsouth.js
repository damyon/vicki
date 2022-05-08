class KitchenBenchTopSouth extends VoxelModel {
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
    this.texture = this.loadTexture(gl, 'script/models/kitchenbenchtopsouth/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/kitchenbenchtopsouth/voxels.json');
  }
}
