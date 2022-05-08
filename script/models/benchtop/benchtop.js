class BenchTop extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 2.9;
    this.z = -9.3;
    this.x = 6.5;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/benchtop/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/benchtop/voxels.json');
  }
}
