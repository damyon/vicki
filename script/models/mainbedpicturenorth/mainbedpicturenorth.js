class MainBedPictureNorth extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 5.8;
    this.z = -4.2;
    this.x = 23.4;
    this.rotate = Math.PI/2;
    this.horizontalScale = 20;
    this.verticalScale = 17;
    this.textureScale = 10;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbedpicturenorth/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbedpicturenorth/voxels.json');
  }
}
