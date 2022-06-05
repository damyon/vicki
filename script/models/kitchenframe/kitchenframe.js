class KitchenFrame extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 6.4;
    this.z = -15.4;
    this.x = 1.45;
    this.horizontalScale = 4;
    this.verticalScale = 1.35;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/kitchenframe/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/kitchenframe/voxels.json');
  }
}
