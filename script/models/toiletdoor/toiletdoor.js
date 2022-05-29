class ToiletDoor extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 2.7;
    this.z = -4.5;
    this.x = 10.7;
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
    this.texture = this.loadTexture(gl, 'script/models/toiletdoor/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/toiletdoor/voxels.json');
  }
}
