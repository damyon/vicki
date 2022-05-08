class TVCabinet extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 2.9;
    this.z = -5.8;
    this.x = 11.5;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/tvcabinet/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/tvcabinet/voxels.json');
  }
}
