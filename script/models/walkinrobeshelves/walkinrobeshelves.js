class WalkInRobeShelves extends VoxelModel {
  constructor() {
    super();
    this.y = 3;
    this.z = 2.1;
    this.x = 14.2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/walkinrobeshelves/textures/top.jpg');

    this.loadVoxels(gl, 'script/models/walkinrobeshelves/voxels.json');
  }
}
