class MainBathMirror extends VoxelModel {
  constructor() {
    super();
    this.y = 6;
    this.z = -0.2;
    this.x = 6.4;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbathmirror/textures/texture.png');

    this.loadVoxels(gl, 'script/models/mainbathmirror/voxels.json');
  }
}
