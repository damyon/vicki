class UpperCouch extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 8.8;
    this.z = -6.8;
    this.x = 7;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/uppercouch/textures/leather.jpg');

    this.loadVoxels(gl, 'script/models/uppercouch/voxels.json');
  }
}
