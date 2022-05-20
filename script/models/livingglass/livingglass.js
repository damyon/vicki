class LivingGlass extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 2.8;
    this.z = -10.6;
    this.x = 16.3;
    this.rotate = Math.PI/2;
    this.horizontalScale = 70;
    this.verticalScale = 60;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/livingglass/textures/texture.png');

    this.loadVoxels(gl, 'script/models/livingglass/voxels.json');
  }
}
