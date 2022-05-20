class UpperGlassNorth extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 8.8;
    this.z = -10.7;
    this.x = 3.8;
    this.horizontalScale = 160;
    this.verticalScale = 60;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperglassnorth/textures/texture.png');

    this.loadVoxels(gl, 'script/models/upperglassnorth/voxels.json');
  }
}
