class MainBathFrame extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 6.8;
    this.z = 4.4;
    this.x = 9.38;
    this.horizontalScale = 2.92;
    this.verticalScale = 2.7;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbathframe/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbathframe/voxels.json');
  }
}
