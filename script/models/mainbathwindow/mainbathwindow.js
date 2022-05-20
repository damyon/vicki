class MainBathWindow extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 6.8;
    this.z = 3.8;
    this.x = 9.3;
    this.horizontalScale = 50;
    this.verticalScale = 10;
    this.blend = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbathwindow/textures/texture.png');

    this.loadVoxels(gl, 'script/models/mainbathwindow/voxels.json');
  }
}
