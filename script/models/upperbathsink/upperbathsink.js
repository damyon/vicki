class UpperBathSink extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 10.6;
    this.z = -3.05;
    this.x = 0.9;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/upperbathsink/textures/texture.png');

    this.loadVoxels(gl, 'script/models/upperbathsink/voxels.json');
  }
}
