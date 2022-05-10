class MainBedTVCabinet extends VoxelModel {
  constructor() {
    super();
    this.rotate = Math.PI/2;
    this.y = 2.9;
    this.z = 1.8;
    this.x = 14.5;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbedtvcabinet/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/mainbedtvcabinet/voxels.json');
  }
}
