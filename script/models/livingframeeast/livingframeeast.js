class LivingFrameEast extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 3.7;
    this.z = -10.5;
    this.x = 15.5;
    this.horizontalScale = 4.6;
    this.verticalScale = 3.6;
    this.rotate = Math.PI/2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/livingframeeast/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/livingframeeast/voxels.json');
  }
}
