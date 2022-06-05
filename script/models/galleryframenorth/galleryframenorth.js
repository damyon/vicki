class GalleryFrameNorth extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 12;
    this.z = -10.3;
    this.x = -3.2;
    this.horizontalScale = 1.1;
    this.verticalScale = 1;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/galleryframenorth/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/galleryframenorth/voxels.json');
  }
}
