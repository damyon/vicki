class Rod extends VoxelModel {
  constructor() {
    super();

    this.rotatePassiveTarget = Math.PI/4;
    this.rotateActiveTarget = Math.PI/3;
    this.rotateVertical = (Math.PI * 0.85);
    this.rotateRod = Math.PI/4;
    this.rotateSpeed = 2;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/rod/textures/rod.jpg');

    this.loadVoxels(gl, 'script/models/rod/voxels.json');
  }

  updateRodRotation(gl, delta, isCast) {
    let target = isCast ? this.rotateActiveTarget : this.rotatePassiveTarget;

    let diff = (((target - this.rotateRod) * delta) / this.rotateSpeed);

    if (diff > 0.01 || diff < -0.01) {
      this.rotateRod += diff;
      this.rotateHorizontal(gl, this.rotateRod);
      this.setPosition(gl, this.x, this.y, this.z);
    }
  }
}
