class KitchenBenchTopNorth extends VoxelModel {
  constructor() {
    super();
    this.y = 3;
    this.z = -10.1;
    this.x = 3;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/kitchenbenchtopnorth/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/kitchenbenchtopnorth/voxels.json');
  }
}
