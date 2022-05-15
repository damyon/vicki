class MainBathSink extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 5.5;
    this.z = 0.2;
    this.x = 6.8;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/mainbathsink/textures/texture.png');

    this.loadVoxels(gl, 'script/models/mainbathsink/voxels.json');
  }
}
