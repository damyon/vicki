class MainBedGlass extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 2.8;
    this.z = -6.6;
    this.x = 20.3;
    this.horizontalScale = 70;
    this.verticalScale = 60;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbedglass/textures/texture.png');

    this.loadVoxels(gl, 'script/models/mainbedglass/voxels.json');
  }
}
