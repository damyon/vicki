class UpperBathDoor extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 8.7;
    this.z = -6.3;
    this.x = 0.9;
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
    this.texture = this.loadTexture(gl, 'script/models/upperbathdoor/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperbathdoor/voxels.json');
  }
}
