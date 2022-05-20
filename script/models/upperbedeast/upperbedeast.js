class UpperBedEast extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.rotate = Math.PI;
    this.y = 8.5;
    this.z = 0.5;
    this.x = -0.8;
    this.horizontalScale = 0.8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperbedeast/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperbedeast/voxels.json');
  }
}
