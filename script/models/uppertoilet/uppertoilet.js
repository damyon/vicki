class UpperToilet extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 9.3;
    this.z = -2.8;
    this.x = -2.8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/uppertoilet/textures/texture.png');

    this.loadVoxels(gl, 'script/models/uppertoilet/voxels.json');
  }
}
