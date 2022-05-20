class MainBedWindow extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 4.8;
    this.z = 3.8;
    this.x = 19.3;
    this.horizontalScale = 70;
    this.verticalScale = 40;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbedwindow/textures/texture.png');

    this.loadVoxels(gl, 'script/models/mainbedwindow/voxels.json');
  }
}
