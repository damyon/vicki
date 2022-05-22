class KitchenDoor extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 3.7;
    this.z = -10.6;
    this.x = -4.2;
    this.rotate = Math.PI/2;
    this.horizontalScale = 80;
    this.verticalScale = 50;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/kitchendoor/textures/texture.png');

    this.loadVoxels(gl, 'script/models/kitchendoor/voxels.json');
  }
}
