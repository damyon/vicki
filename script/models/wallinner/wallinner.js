class WallInner extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 2;
    this.z = 0;
    this.x = 8;
    this.textureScale = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/wallinner/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/wallinner/voxels.json');
  }
}
