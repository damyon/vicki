class Rock extends VoxelModel {
  constructor() {
    super();
    this.rotate = Math.random();
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/rock/textures/rock.jpg');

    this.loadVoxels(gl, 'script/models/rock/voxels.json');
  }
}
