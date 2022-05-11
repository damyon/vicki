class CoffeeTable extends VoxelModel {
  constructor() {
    super();
    //this.rotate = Math.random();
    this.y = 3;
    this.z = -10.5;
    this.x = 12;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/coffeetable/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/coffeetable/voxels.json');
  }
}
