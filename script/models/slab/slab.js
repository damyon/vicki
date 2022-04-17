class Slab extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 2;
    this.z = 0;
    this.x = 0;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/slab/textures/slab.jpg');

    this.loadVoxels(gl, 'script/models/slab/voxels.json');
  }
}
