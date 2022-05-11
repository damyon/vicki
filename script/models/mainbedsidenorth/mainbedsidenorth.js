class MainBedSideNorth extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 3;
    this.z = -3;
    this.x = 19.8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbedsidenorth/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/mainbedsidenorth/voxels.json');
  }
}
