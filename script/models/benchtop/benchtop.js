class BenchTop extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 3;
    this.z = -10.5;
    this.x = 7;
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
