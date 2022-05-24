class UpperTV extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 9.1;
    this.z = -0.5;
    this.x = 7.9;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/uppertv/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/uppertv/voxels.json');
  }
}
