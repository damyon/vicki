class Fridge extends VoxelModel {
  constructor() {
    super();
    this.y = 3;
    this.z = -10;
    this.x = 3;
    this.textureScale = 3;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/fridge/textures/texture.png');

    this.loadVoxels(gl, 'script/models/fridge/voxels.json');
  }
}
