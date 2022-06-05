class UpperLivingFrameNorth extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 12;
    this.z = -10.1;
    this.x = 7.2;
    this.horizontalScale = 3.7;
    this.verticalScale = 4.05;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperlivingframenorth/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperlivingframenorth/voxels.json');
  }
}
