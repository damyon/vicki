class BenchLegs extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 3;
    this.z = -9.5;
    this.x = 6.2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/benchlegs/textures/legs.jpg');

    this.loadVoxels(gl, 'script/models/benchlegs/voxels.json');
  }
}
