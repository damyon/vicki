class KitchenDoorFrame extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 3.6;
    this.z = -12.8;
    this.x = -4.7;
    this.horizontalScale = 1.1;
    this.verticalScale = 4;
    this.rotate = Math.PI/2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/kitchendoorframe/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/kitchendoorframe/voxels.json');
  }
}
