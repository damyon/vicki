class FenceWest extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 2.8;
    this.z = -5;
    this.x = -9.3;
    this.rotate = Math.PI/2;
    this.horizontalScale = 260;
    this.verticalScale = 60;
    this.textureScale = 20;
    //this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/fencewest/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/fencewest/voxels.json');
  }
}
