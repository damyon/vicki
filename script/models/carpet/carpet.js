class Carpet extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 2;
    this.z = 0;
    this.x = 8;
    this.textureScale = 80;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/carpet/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/carpet/voxels.json');
  }
}
