class MainBathDoor extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 2.7;
    this.z = -3.9;
    this.x = 14.5;
    this.horizontalScale = 16;
    this.verticalScale = 97;
    this.blend = 0;
    this.textureScale = 20;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbathdoor/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbathdoor/voxels.json');
  }
}
