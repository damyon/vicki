class LivingWindowFrameWest extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 5.6;
    this.z = -15.4;
    this.x = 11.2;
    this.horizontalScale = 1.1;
    this.verticalScale = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/livingwindowframewest/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/livingwindowframewest/voxels.json');
  }
}
