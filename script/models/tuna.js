
class Tuna extends Drawable {

  constructor(index) {
    super();
    this.LOD = 16;
    this.size = 3;
    this.offset = 1;
    this.buffers = null;
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.sourcePositions = [];
    this.index = index + 1;
    this.blend = 1;
    this.currentLOD = 3;
    this.lowestLOD = 3;
    this.highestLOD = 3;

    this.gltfModel = null;
  }

  /**
   * Apply an offset to the position of all the vertices.
   *
   */
  setPosition(gl, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    
    
  }

  getLOD() {
    let LOD = this.LOD, reduce = this.currentLOD;

    while (reduce != this.highestLOD) {
      LOD /= 2;
      reduce += 1;
    }

    return LOD;
  }

  getVertexCount() {
    return this.getLOD() * 3 * 4;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    gltf.loadModel(gl, 'model/a/BoxTextured.gltf').then((model) => {
      this.gltfModel = model;
    });
    
    return this.buffers;
  }

  /**
   * draw
   * Draw the rock.
   * @param gl
   * @param camera
   */
  draw(gl, camera, shadow) {
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    if (shadow) {
      gl.uniform1i(camera.isWater, 0);
    }

    if (this.gltfModel) {
      const mesh = this.gltfModel.meshes[0];
      
      if (shadow) {
        camera.translate(gl, this.x, this.y, this.z);
      }

      // Points.
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positions.buffer);
     
      // Indices.
      const vertexPosition = gl.getAttribLocation(camera.lightShaderProgram, 'aVertexPosition');
      
      gl.vertexAttribPointer(vertexPosition, mesh.positions.size, mesh.positions.type, false, 0, 0);
      gl.enableVertexAttribArray(vertexPosition);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
     
      gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);

    }

  }
}