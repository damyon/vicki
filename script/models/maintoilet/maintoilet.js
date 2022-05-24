class MainToilet extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 3.5;
    this.z = -5.2;
    this.x = 6.8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/maintoilet/textures/texture.png');

    this.loadVoxels(gl, 'script/models/maintoilet/voxels.json');
  }
}
