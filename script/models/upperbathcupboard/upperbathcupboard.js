class UpperBathCupboard extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 9.2;
    this.z = -1.8;
    this.x = -2.2;
    this.textureScale = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperbathcupboard/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperbathcupboard/voxels.json');
  }
}
