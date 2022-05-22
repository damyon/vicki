class GarageDoor extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 2;
    this.z = 5.3;
    this.x = -2.3;
    this.horizontalScale = 110;
    this.verticalScale = 60;
    this.blend = 0;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/garagedoor/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/garagedoor/voxels.json');
  }
}
