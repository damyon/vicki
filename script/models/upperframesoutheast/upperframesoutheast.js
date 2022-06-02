class UpperFrameSouthEast extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 10.4;
    this.z = 5.9;
    this.x = 8.9;
    this.horizontalScale = 3.5;
    this.verticalScale = 2.3;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperframesoutheast/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperframesoutheast/voxels.json');
  }
}
