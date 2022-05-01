class Couch extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 3;
    this.z = -12.5;
    this.x = 12;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/couch/textures/leather.jpg');

    this.loadVoxels(gl, 'script/models/couch/voxels.json');
  }
}
