class Leaves extends VoxelModel {
  constructor() {
    super();

    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/leaves/textures/leaves.png');

    this.loadVoxels(gl, 'script/models/leaves/voxels.json');
  }
}
