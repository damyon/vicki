class MainBedFrameEast extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 5.2;
    this.z = 4.3;
    this.x = 21.8;
    this.horizontalScale = 1.3;
    this.verticalScale = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbedframeeast/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbedframeeast/voxels.json');
  }
}
