class FrontDoor extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 3.7;
    this.z = 3.8;
    this.x = 4.99;
    this.horizontalScale = 21;
    this.verticalScale = 44;
    this.blend = 0;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/frontdoor/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/frontdoor/voxels.json');
  }
}
