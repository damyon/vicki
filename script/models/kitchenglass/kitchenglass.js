class KitchenGlass extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 4.8;
    this.z = -15.9;
    this.x = 6.3;
    this.horizontalScale = 180;
    this.verticalScale = 40;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/kitchenglass/textures/texture.png');

    this.loadVoxels(gl, 'script/models/kitchenglass/voxels.json');
  }
}
