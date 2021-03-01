
class VoxelModel extends Drawable {

  constructor(index) {
    super();
    this.x = 0;
    this.y = 3.5;
    this.z = 40;
    this.rotate = Math.PI/6;
    this.doSwap = true;
    this.heightOffset = 0;
    this.textures = [];
    this.blend = 0;
    this.vertexCount = 0;
    this.buffers = false;
    this.textureLoaded = new Promise((resolve, reject) => {
      this.textureResolver = resolve;
    });
    this.modelPath = '';
    this.json = [];
    this.currentPositionBuffers = [];
  }

  afterTextureLoaded(callback) {
    return this.textureLoaded.then(callback);
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
    this.x = x;
    this.y = y;
    this.z = z;

    let translatedPositions = [], i = 0, c = 0, s = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    translatedPositions = this.positions.slice();

    // Now locally rotate.
    c = Math.cos(this.rotate);
    s = Math.sin(this.rotate);
    
    // Move - half
    for (i = 0; i < this.getVertexCount(); i++) {
    //  translatedPositions[i * 3] -=0.25*this.size;
    }

    // Local rotate
    for (i = 0; i < this.getVertexCount(); i++) {
      let x = translatedPositions[i * 3];
      let z = translatedPositions[i * 3 + 2];

      translatedPositions[i * 3] = x * c - z * s;
      translatedPositions[i * 3 + 2] = x * s + z * c;
    }
    
    // Move + half
    for (i = 0; i < this.getVertexCount(); i++) {
      //translatedPositions[i * 3] += 0.25*this.size;
    }
    
    // Now translate.
    for (i = 0; i < this.positions.length / 3; i++) {
      translatedPositions[i * 3] += this.x;
      translatedPositions[i * 3 + 1] += this.y;
      translatedPositions[i * 3 + 2] += this.z;
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(translatedPositions), gl.STATIC_DRAW);
  
  }

  getVertexCount() {
    return this.vertexCount;
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

      this.size = this.json.scale;
      const positionBuffer = gl.createBuffer();
      this.positions = [];
      // Select the positionBuffer as the one to apply buffer
      // operations to from here out.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // Now create an array of positions for the terrain.
      const unit = this.size / json.width;
      let offset = 0, offsetX = 0, offsetY = 0, offsetZ = 0, one = 0, i = 0;

      for (z = 0; z < json.height; z++) {
        for (x = 0; x < json.width; x++) {
          for (y = 0; y < json.depth; y++) {
            if (json.slices[z][y][x]) {
              offsetX = x * unit;
              offsetY = y * unit;
              offsetZ = z * unit;
              this.vertexCount += 36;

              this.positions[offset++] = offsetX;
              this.positions[offset++] = offsetY;
              this.positions[offset++] = offsetZ;

              this.positions[offset++] = offsetX + unit;
              this.positions[offset++] = offsetY;
              this.positions[offset++] = offsetZ;

              this.positions[offset++] = offsetX + unit;
              this.positions[offset++] = offsetY;
              this.positions[offset++] = offsetZ + unit;

              this.positions[offset++] = offsetX;
              this.positions[offset++] = offsetY;
              this.positions[offset++] = offsetZ + unit;

              this.positions[offset++] = offsetX;
              this.positions[offset++] = offsetY + unit;
              this.positions[offset++] = offsetZ;

              this.positions[offset++] = offsetX + unit;
              this.positions[offset++] = offsetY + unit;
              this.positions[offset++] = offsetZ;

              this.positions[offset++] = offsetX + unit;
              this.positions[offset++] = offsetY + unit;
              this.positions[offset++] = offsetZ + unit;

              this.positions[offset++] = offsetX;
              this.positions[offset++] = offsetY + unit;
              this.positions[offset++] = offsetZ + unit;
            }
          }
        }
      }

      // Recenter the model around the zero point.
      let centerOffset = this.size / 2;
      for (i = 0; i < (offset); i+=3) {
        this.positions[i] -= centerOffset; // X
        this.positions[i+2] -= centerOffset; // Z
      }

      // Now pass the list of positions into WebGL to build the
      // shape. We do this by creating a Float32Array from the
      // JavaScript array, then use it to fill the current buffer.

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

      let textureCoordinates = [], face = 0;
      offset = 0;

      one = 1;
      
      for (z = 0; z < json.height; z++) {
        for (x = 0; x < json.width; x++) {
          for (y = 0; y < json.depth; y++) {
            if (json.slices[z][y][x]) {
              
                textureCoordinates[offset++] = 0; // X
                textureCoordinates[offset++] = 0; // Y

                textureCoordinates[offset++] = one; // X
                textureCoordinates[offset++] = 0; // Y

                textureCoordinates[offset++] = one; // X
                textureCoordinates[offset++] = one; // Y

                textureCoordinates[offset++] = 0; // X
                textureCoordinates[offset++] = one; // Y

                textureCoordinates[offset++] = one; // X
                textureCoordinates[offset++] = one; // Y

                textureCoordinates[offset++] = 0; // X
                textureCoordinates[offset++] = one; // Y

                textureCoordinates[offset++] = 0; // X
                textureCoordinates[offset++] = 0; // Y

                textureCoordinates[offset++] = one; // X
                textureCoordinates[offset++] = 0; // Y
                
              
            }
          }
        }
      }

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                    gl.STATIC_DRAW);

      // Build the element array buffer; this specifies the indices
      // into the vertex arrays for each face's vertices.

      const indexBuffer = gl.createBuffer();
      let start = 0, indices = [];
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      // This array defines each cube as 16 triangles, using the
      // indices into the vertex array to specify each triangle's
      // position.
      offset = 0;
      start = 0;
      for (z = 0; z < json.height; z++) {
        for (x = 0; x < json.width; x++) {
          for (y = 0; y < json.depth; y++) {
            if (json.slices[z][y][x]) {
              // Bottom
              indices[offset++] = start + 0;
              indices[offset++] = start + 2;
              indices[offset++] = start + 1;
      
              indices[offset++] = start + 0;
              indices[offset++] = start + 3;
              indices[offset++] = start + 2;

              // Front
              indices[offset++] = start + 0;
              indices[offset++] = start + 5;
              indices[offset++] = start + 1;

              indices[offset++] = start + 0;
              indices[offset++] = start + 4;
              indices[offset++] = start + 5;
              
              // Right
              indices[offset++] = start + 1;
              indices[offset++] = start + 6;
              indices[offset++] = start + 2;

              indices[offset++] = start + 1;
              indices[offset++] = start + 5;
              indices[offset++] = start + 6;

              // Back
              indices[offset++] = start + 2;
              indices[offset++] = start + 6;
              indices[offset++] = start + 3;

              indices[offset++] = start + 3;
              indices[offset++] = start + 7;
              indices[offset++] = start + 6;

              // Left
              indices[offset++] = start + 3;
              indices[offset++] = start + 4;
              indices[offset++] = start + 0;

              indices[offset++] = start + 3;
              indices[offset++] = start + 7;
              indices[offset++] = start + 4;

              // Top
              indices[offset++] = start + 4;
              indices[offset++] = start + 7;
              indices[offset++] = start + 5;

              indices[offset++] = start + 5;
              indices[offset++] = start + 6;
              indices[offset++] = start + 7;
              
              // 8 vertices in a cube.
              start += 8;
            }
          }
        }
      }

      // Now send the element array to GL

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

      this.buffers = {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
      };
      this.setPositionRotation(gl, this.x, this.y, this.z, this.rotate);
      
      this.textureResolver(true);
    });
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    this.texture = this.loadTexture(gl, 'script/models/bush/textures/leaves.png');

    this.loadVoxels(gl, 'script/models/bush/voxels.json');
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
    if (shadow) {
      gl.uniform1i(camera.isWater, 0);
      gl.uniform1i(camera.isSand, 0);
    }

    if (!this.buffers) {
      return;
    }

    this.setPositionRotation(gl, this.x, this.y, this.z, this.rotate + 0.1);
    
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

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      const textureCoord = gl.getAttribLocation(camera.cameraShaderProgram, 'aTextureCoord')

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureCoord);
      gl.vertexAttribPointer(
          textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          textureCoord);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    
    // Tell WebGL we want to affect texture unit 0

    var uSampler = gl.getUniformLocation(shadow?camera.lightShaderProgram:camera.cameraShaderProgram, 'uSampler');
    gl.activeTexture(gl.TEXTURE1);

    // Bind the texture to texture unit 1
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Tell the shader we bound the texture to texture unit 0
    if (shadow) {
      gl.uniform1i(uSampler, 1);
    }

    {
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      
      gl.drawElements(gl.TRIANGLES, this.getVertexCount(), type, offset);
    }
    

  }
}