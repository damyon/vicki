class UpperBedCupboardWest extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.rotate = Math.PI/2;
    this.y = 8.85;
    this.z = 3;
    this.x = 2.9;
    this.horizontalScale = 48;
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
    this.texture = this.loadTexture(gl, 'script/models/upperbedcupboardwest/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperbedcupboardwest/voxels.json');
  }
}
