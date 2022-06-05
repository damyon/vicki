class UpperBathFrame extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 12.4;
    this.z = -2.6;
    this.x = -4.7;
    this.horizontalScale = 0.8;
    this.verticalScale = 0.65;
    this.rotate = Math.PI/2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperbathframe/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/upperbathframe/voxels.json');
  }
}
