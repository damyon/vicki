
class LineModel extends Drawable {

  constructor(index) {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.vertexCount = 1;
    this.buffers = false;
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
  setVertices(gl, from, to) {
    this.from = from;
    this.to = to;
    this.updateVertices(gl);
  }
  
  /**
   * Apply an offset to the position of all the vertices.
   *
   */
  
  getVertexCount() {
    return this.vertexCount;
  }

  
  updateVertices(gl) {
    
    const positionBuffer = gl.createBuffer();
    this.positions = [];
    this.indices = [];
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the line.

    // Start
    this.positions[0] = this.from.x;
    this.positions[1] = this.from.y;
    this.positions[2] = this.from.z;

    // End
    this.positions[3] = this.to.x;
    this.positions[4] = this.to.y;
    this.positions[5] = this.to.z;
    
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for the line.

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines the line as 2 points, using the
    // indices into the vertex array to specify each point
    // position.
    // Now send the element array to GL
    this.indices[0] = 0;
    this.indices[1] = 1;

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    this.buffers = {
      position: positionBuffer,
      indices: indexBuffer,
    };
  }
  
  /**
   * draw
   * Draw the model.
   * @param gl
   * @param camera
   */
  draw(gl, camera, shadow) {
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
  
    if (!this.buffers) {
      return;
    }

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      const vertexPosition = gl.getAttribLocation(camera.lightShaderProgram, 'aVertexPosition')

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
      gl.vertexAttribPointer(
          vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          vertexPosition);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    
    // Tell WebGL we want to affect texture unit 0

    {
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      
      gl.drawElements(gl.LINES, 2, type, offset);
    }
    

  }

  
}