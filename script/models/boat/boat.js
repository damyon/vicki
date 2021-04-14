class Boat extends VoxelModel {
  constructor() {
    super();
    this.boatWidth = 4;
    this.boatLength = 8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/boat/textures/boat.jpg');

    this.loadVoxels(gl, 'script/models/boat/voxels.json');
  }

  evaluateLOD(gl, cameraX, cameraY, cameraZ) {
    // Boat is always close.
  }
}
