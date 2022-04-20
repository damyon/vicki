class Roof extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 2;
    this.z = 0;
    this.x = 8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/roof/textures/roof.jpg');

    this.loadVoxels(gl, 'script/models/roof/voxels.json');
  }
}
