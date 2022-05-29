class GarageDoorEast extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 3.7;
    this.z = -8.35;
    this.x = 2.8;
    this.horizontalScale = 16;
    this.verticalScale = 94;
    this.blend = 0;
    this.textureScale = 20;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/garagedooreast/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/garagedooreast/voxels.json');
  }
}
