class GalleryFrameWest extends VoxelModel {
  constructor() {
    super();
//    this.rotate = Math.random();
    this.y = 12;
    this.z = -9.74;
    this.x = -4.7;
    this.horizontalScale = 1.25;
    this.verticalScale = 1;
    this.rotate = Math.PI/2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/galleryframewest/textures/texture.jpg');

    this.loadVoxels(gl, 'script/models/galleryframewest/voxels.json');
  }
}
