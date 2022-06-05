class MainBedFrameNorth extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 3.7;
    this.z = -6;
    this.x = 20;
    this.horizontalScale = 4.3;
    this.verticalScale = 3.6;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbedframenorth/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbedframenorth/voxels.json');
  }
}
