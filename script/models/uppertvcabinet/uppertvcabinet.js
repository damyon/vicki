class UpperTVCabinet extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 9.1;
    this.z = -0.5;
    this.x = 8.9;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/uppertvcabinet/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/uppertvcabinet/voxels.json');
  }
}
