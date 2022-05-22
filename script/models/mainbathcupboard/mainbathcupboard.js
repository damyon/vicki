class MainBathCupboard extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 3;
    this.z = 1.5;
    this.x = 3.5;
    this.textureScale = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbathcupboard/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbathcupboard/voxels.json');
  }
}
