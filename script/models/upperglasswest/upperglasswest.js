class UpperGlassWest extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 8.8;
    this.z = -4.7;
    this.x = -4.2;
    this.rotate = Math.PI/2;
    this.horizontalScale = 120;
    this.verticalScale = 60;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperglasswest/textures/texture.png');

    this.loadVoxels(gl, 'script/models/upperglasswest/voxels.json');
  }
}
