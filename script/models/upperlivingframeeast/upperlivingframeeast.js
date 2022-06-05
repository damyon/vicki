class UpperLivingFrameEast extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 12;
    this.z = -6;
    this.x = 11.95;
    this.horizontalScale = 2.7;
    this.verticalScale = 4.05;
    this.rotate = Math.PI/2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperlivingframeeast/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperlivingframeeast/voxels.json');
  }
}
