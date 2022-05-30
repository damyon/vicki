class MainBathFrame extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 6.8;
    this.z = 3.8;
    this.x = 9.3;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbathframe/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbathframe/voxels.json');
  }
}
