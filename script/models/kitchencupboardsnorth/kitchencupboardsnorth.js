class KitchenCupboardsNorth extends VoxelModel {
  constructor() {
    super();
    this.y = 3;
    this.z = -10;
    this.x = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/kitchencupboardsnorth/textures/bench.jpg');

    this.loadVoxels(gl, 'script/models/kitchencupboardsnorth/voxels.json');
  }
}
