class GarageDoorNorth extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.rotate = Math.PI;
    this.y = 2.4;
    this.z = -10.5;
    this.x = -6.55;
    this.horizontalScale = 21;
    this.verticalScale = 98;
    this.blend = 0;
    this.textureScale = 20;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/garagedoornorth/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/garagedoornorth/voxels.json');
  }
}
