
class VoxelModel extends Drawable {

  constructor(index) {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotate = 0;
    this.rollOver = 0;
    this.texture = null;
    this.globalAngle = 0;
    this.decimate = 1;
    this.blend = 0;
    this.vertexCount = 0;
    this.buffers = false;
    this.textureLoaded = new Promise((resolve, reject) => {
      this.textureResolver = resolve;
    });
    this.modelPath = '';
    this.json = [];
  }

  setGlobalRotation(gl, globalAngle) {
    this.globalAngle = globalAngle;
    this.setPosition(gl, this.x, this.y, this.z);
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
   * Move and spin.
   *  
   * @param {*} gl 
   * @param {*} rollOver 
   */
  rotateHorizontal(gl, rollOver) {
    this.rollOver = rollOver;
    this.setPosition(gl, this.x, this.y, this.z);
  }

  /**
   * Apply an offset to the position of all the vertices.
   *
   */
  setPosition(gl, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    if (!this.buffers) {
      return;
    }
    let translatedPositions = [], i = 0, c = 0, s = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    translatedPositions = this.positions.slice();

    c = Math.cos(this.rollOver);
    s = Math.sin(this.rollOver);

    // Local rotate Horizontal
    for (i = 0; i < this.getVertexCount(); i++) {
      let y = translatedPositions[i * 3 + 1];
      let z = translatedPositions[i * 3 + 2];

      translatedPositions[i * 3 + 1] = y * c - z * s;
      translatedPositions[i * 3 + 2] = y * s + z * c;
    }

    // Now locally rotate.
    c = Math.cos(this.rotate);
    s = Math.sin(this.rotate);
    
    // Local rotate
    for (i = 0; i < this.getVertexCount(); i++) {
      let x = translatedPositions[i * 3];
      let z = translatedPositions[i * 3 + 2];

      translatedPositions[i * 3] = x * c - z * s;
      translatedPositions[i * 3 + 2] = x * s + z * c;
    }

     // Now global rotation.
     c = Math.cos(this.globalAngle);
     s = Math.sin(this.globalAngle);
 
     // Global rotate
     for (i = 0; i < this.getVertexCount(); i++) {
       let x = translatedPositions[i * 3];
       let z = translatedPositions[i * 3 + 2];
 
       translatedPositions[i * 3] = x * c - z * s;
       translatedPositions[i * 3 + 2] = x * s + z * c;
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

  voxelHit(x, y, z, json) {
    if (x < 0 || y < 0 || z < 0) {
      return 0;
    }
    if (x >= json.width || y >= json.depth || z >= json.height) {
      return 0;
    }

    return json.slices[json.depth - y - 1][z][x];
  }

  subdivide(json) {
    let i = 1;
    this.decimate = json.decimate;
    
    for (i = 1; i < this.decimate; i++) {
      // Every unit decimate is > 1 we will subdivide the json.

      let newWidth = json.width * 2;
      let newHeight = json.height * 2;
      let newDepth = json.depth * 2;

      // Hmm. interpolate...
      let x = 0, y = 0, z = 0, newSlices = [];

      // All 0s.
      for (y = 0; y <= newDepth; y++) {
        newSlices[y] = [];
        for (z = 0; z <= newHeight; z++) {
          newSlices[y][z] = [];
          for (x = 0; x <= newWidth; x++) {
            newSlices[y][z][x] = 0;
          }
        }
      }

      for (x = 0; x < json.width; x++) {
        for (y = 0; y < json.depth; y++) {
          for (z = 0; z < json.height; z++) {
            if (json.slices[y][z][x]) {
              let newX = x * 2;
              let newY = y * 2;
              let newZ = z * 2;
              newSlices[newY][newZ][newX] = 1;
              newSlices[newY][newZ][newX+1] = 1;
              newSlices[newY][newZ+1][newX] = 1;
              newSlices[newY][newZ+1][newX+1] = 1;
              newSlices[newY+1][newZ][newX] = 1;
              newSlices[newY+1][newZ][newX+1] = 1;
              newSlices[newY+1][newZ+1][newX] = 1;
              newSlices[newY+1][newZ+1][newX+1] = 1;
            }
          }
        }
      }
      // Smooth
      let required = 3;
      let count = 0, i = 0;
      let hits = [];
      for (y = 1; y < newDepth; y++) {
        for (z = 1; z < newHeight; z++) {
          for (x = 1; x < newWidth; x++) {
            if (!newSlices[y][z][x]) {
              count = 0;
              if (newSlices[y-1][z-1][x-1]) {
                count++;
              }
              if (newSlices[y+1][z-1][x-1]) {
                count++;
              }
              if (newSlices[y-1][z+1][x-1]) {
                count++;
              }
              if (newSlices[y-1][z-1][x+1]) {
                count++;
              }
              if (newSlices[y+1][z+1][x-1]) {
                count++;
              }
              if (newSlices[y-1][z+1][x+1]) {
                count++;
              }
              if (newSlices[y+1][z-1][x+1]) {
                count++;
              }
              if (newSlices[y+1][z+1][x+1]) {
                count++;
              }

              if (count >= required) {
                hits.push([y, z, x]);
              }
            }
          }
        }
      }
      for (i = 0; i < hits.length; i++) {
        y = hits[i][0];
        x = hits[i][1];
        z = hits[i][2];
        
        newSlices[y][x][z] = 1;
      }


      json.width = newWidth;
      json.height = newHeight;
      json.depth = newDepth;
      json.slices = newSlices;
    }
  }

  defineSquareTexture(textureCoordinates, textureIndex) {
    textureCoordinates[textureIndex++] = 0; // X
    textureCoordinates[textureIndex++] = 0; // Y

    textureCoordinates[textureIndex++] = 0; // X
    textureCoordinates[textureIndex++] = 1; // Y

    textureCoordinates[textureIndex++] = 1; // X
    textureCoordinates[textureIndex++] = 1; // Y

    textureCoordinates[textureIndex++] = 1; // X
    textureCoordinates[textureIndex++] = 0; // Y  
  }

  defineSquareIndices(indices, indiceOffset, vertexIndex) {
    indices[indiceOffset+0] = vertexIndex + 0;
    indices[indiceOffset+1] = vertexIndex + 1;
    indices[indiceOffset+2] = vertexIndex + 2;

    indices[indiceOffset+3] = vertexIndex + 0;
    indices[indiceOffset+4] = vertexIndex + 2;
    indices[indiceOffset+5] = vertexIndex + 3;
  }

  defineBottomFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    
    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ + unit;
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex);
  }

  defineFrontFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    
    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ;
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex);
  }
  
  defineLeftFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    
    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ;
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex);
  }

  defineBackFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    
    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ + unit;
  
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex);
  }

  defineRightFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    
    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY;
    positions[positionOffset++] = offsetZ + unit;
  
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex);
  }

  defineTopFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    
    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ;

    positions[positionOffset++] = offsetX;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ + unit;

    positions[positionOffset++] = offsetX + unit;
    positions[positionOffset++] = offsetY + unit;
    positions[positionOffset++] = offsetZ;
  
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex);
    
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

      this.subdivide(json);
      // The end of the sub divide is a sweetness..

      // Now create an array of positions for the terrain.
      const unit = this.size / json.width;
      let positionOffset = 0, indiceOffset = 0, offsetX = 0, offsetY = 0, offsetZ = 0, one = 0, i = 0, j = 0, joined = 0;
      let start = 0, indices = [], textureCoordinates = [];
      
      for (x = 0; x < json.width; x++) {
        for (y = 0; y < json.depth; y++) {
          for (z = 0; z < json.height; z++) {
            if (this.voxelHit(x, y, z, json)) {
              offsetX = x * unit;
              offsetY = y * unit;
              offsetZ = z * unit;
              // Bottom (CW start bottom left)
              if (!this.voxelHit(x, y-1, z, json)) {
                this.defineBottomFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates);
                // This is the number of indexes.
                positionOffset += 4 * 3;
                indiceOffset += 3 * 2;
                this.vertexCount += 3 * 2;
              }

              // Front Face
              if (!this.voxelHit(x, y, z-1, json)) {
                this.defineFrontFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates);
                // This is the number of indexes.
                positionOffset += 4 * 3;
                indiceOffset += 3 * 2;
                this.vertexCount += 3 * 2;
              }
              

              // Left
              if (!this.voxelHit(x-1, y, z, json)) {
                this.defineLeftFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates);
                // This is the number of indexes.
                positionOffset += 4 * 3;
                indiceOffset += 3 * 2;
                this.vertexCount += 3 * 2;
              }
              

              // Back
              if (!this.voxelHit(x, y, z+1, json)) {
                this.defineBackFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates);
                // This is the number of indexes.
                positionOffset += 4 * 3;
                indiceOffset += 3 * 2;
                this.vertexCount += 3 * 2;
              }
              
              
              // Right
              if (!this.voxelHit(x+1, y, z, json)) {
                this.defineRightFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates);
                // This is the number of indexes.
                positionOffset += 4 * 3;
                indiceOffset += 3 * 2;
                this.vertexCount += 3 * 2;
              }
              

              // Top
              if (!this.voxelHit(x, y+1, z, json)) {
                this.defineTopFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates);
                // This is the number of indexes.
                positionOffset += 4 * 3;
                indiceOffset += 3 * 2;
                this.vertexCount += 3 * 2;
              }
              

            }
          }
        }
      }

      // Recenter the model around the zero point.
      let centerOffset = this.size / 2;
      for (i = 0; i < (positionOffset); i+=3) {
        this.positions[i] -= centerOffset; // X
        this.positions[i+2] -= centerOffset; // Z
      }

      // Now pass the list of positions into WebGL to build the
      // shape. We do this by creating a Float32Array from the
      // JavaScript array, then use it to fill the current buffer.

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                    gl.STATIC_DRAW);

      // Build the element array buffer; this specifies the indices
      // into the vertex arrays for each face's vertices.

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      // This array defines each cube as 16 triangles, using the
      // indices into the vertex array to specify each triangle's
      // position.
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