class UpperBedDoorEast extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.rotate = Math.PI/2;
    this.y = 8.7;
    this.z = -0.5;
    this.x = 4.5;
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
    this.texture = this.loadTexture(gl, 'script/models/upperbeddooreast/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperbeddooreast/voxels.json');
  }
}
