
class VoxelModel extends Drawable {

  constructor(index) {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotate = 0;
    this.scale = 1.0;
    this.doSwap = true;
    this.heightOffset = 0;
    this.textures = [];
    this.blend = 1;
    
    this.modelPath = '';
    this.json = [];
    this.currentPositionBuffers = [];
  }

  /**
   * Move and spin.
   *  
   * @param {*} gl 
   * @param {*} x 
   * @param {*} y 
   * @param {*} z 
   * @param {*} rotate 
   */
  setPositionRotation(gl, x, y, z, rotate) {
    this.rotate = rotate;
    this.setPosition(gl, x, y, z);
  }

  /**
   * Apply an offset to the position of all the vertices.
   *
   */
  setPosition(gl, x, y, z) {
    
  }

  getVertexCount() {
    return 6 * 8 * this.voxelCount;
  }

  loadVoxels(gl, path) {
    fetch(path)
    .then(response => { 
      return response.json(); 
    })
    .then(json => {
      return this.json = json;
     })
    .then(json => {
      // Count the voxels.
      let voxelCount = 0;
      let x = 0, y = 0, z = 0;
      for (z = 0; z < json.height; z++) {
        for (x = 0; x < json.width; x++) {
          for (y = 0; y < json.depth; y++) {
            if (json.slices[z][y][x]) {
              voxelCount++;

              
            }
          }
        }  
      }
      this.voxelCount = voxelCount;
    });
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.textures[0] = this.loadTexture(gl, 'script/models/bush/textures/leaves.png');

    this.loadVoxels(gl, 'script/models/bush/voxels.json');
  }

  /**
   * draw
   * Draw the model.
   * @param gl
   * @param camera
   */
  draw(gl, camera, shadow) {
    
    

  }
}