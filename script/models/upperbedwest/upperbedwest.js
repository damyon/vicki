class UpperBedWest extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 8.9;
    this.z = 4.5;
    this.x = 8.8;
    this.horizontalScale = 0.8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperbedwest/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperbedwest/voxels.json');
  }
}
