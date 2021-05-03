
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
    this.jsonLOD = [];
    this.lowestLOD = 1;
    this.highestLOD = 1;
    this.distanceLOD = 80;
    this.textureScale = 10;
  }

  setGlobalRotation(gl, globalAngle) {
    this.globalAngle = globalAngle;
    this.setPosition(gl, this.x, this.y, this.z);
  }

  afterTextureLoaded(callback) {
    return this.textureLoaded.then(callback);
  }

  // Vertices will not be updated by this method, call setPosition after.
  setRotation(gl, rotate) {
    this.rotate = rotate;
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
   * Vertices will not be updated by this method, call setPosition after.
   *  
   * @param {*} gl 
   * @param {*} rollOver 
   */
  rotateHorizontal(gl, rollOver) {
    this.rollOver = rollOver;
  }

  setTargetPosition(gl, x, y, z) {
    let delay = 2;
    let diffX = (x - this.x) / delay;
    let diffY = (y - this.y) / delay;
    let diffZ = (z - this.z) / delay;

    let cutoff = 0.1;
    if (this.lastDiffX == undefined) {
      this.lastDiffX = 0;
    }
    if (this.lastDiffY == undefined) {
      this.lastDiffY = 0;
    }
    if (this.lastDiffZ == undefined) {
      this.lastDiffZ = 0;
    }

    
    if (this.lastDiffX > - cutoff && this.lastDiffX < cutoff) {
      this.lastDiffX = 0;
    }
    if (this.lastDiffY > - cutoff && this.lastDiffY < cutoff) {
      this.lastDiffY = 0;
    }
    if (this.lastDiffZ > - cutoff && this.lastDiffZ < cutoff) {
      this.lastDiffZ = 0;
    }

    if (diffX != 0 && this.lastDiffX != 0) {
      if (Math.sign(diffX) != Math.sign(this.lastDiffX)) {
        return;
      }
    }
    if (diffY != 0 && this.lastDiffY != 0) {
      if (Math.sign(diffY) != Math.sign(this.lastDiffY)) {
        return;
      }
    }
    if (diffZ != 0 && this.lastDiffZ != 0) {
      if (Math.sign(diffZ) != Math.sign(this.lastDiffZ)) {
        return;
      }
    }
 
    this.lastDiffX = diffX;
    this.lastDiffY = diffY;
    this.lastDiffZ = diffZ;

    this.setPosition(gl, this.x + diffX, this.y + diffY, this.z + diffZ);
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
    let level = 1;
    this.decimate = json.decimate;
    this.highestLOD = json.decimate;
    this.currentLOD = this.highestLOD;
    // First clone the current JSON so we have a reference to it.
    try {
      this.jsonLOD[level] = JSON.parse(JSON.stringify(json));
    } catch (e) {
    }

    for (level = 1; level < this.decimate; level++) {
      
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
      // Clone the new json.
      this.jsonLOD[level+1] = JSON.parse(JSON.stringify(json));

    }
  }

  defineSquareTexture(textureCoordinates, textureIndex, x, y, unit, width, depth) {
    let xstart = x / width;
    let ystart = y / depth;
    let xend = (x + unit) / width;
    let yend = (y + unit) / depth;
    let scale = this.textureScale;

    xstart *= scale;
    ystart *= scale;
    xend *= scale;
    yend *= scale;

    textureCoordinates[textureIndex++] = xstart; // X
    textureCoordinates[textureIndex++] = ystart; // Y

    textureCoordinates[textureIndex++] = xstart; // X
    textureCoordinates[textureIndex++] = yend; // Y

    textureCoordinates[textureIndex++] = xend; // X
    textureCoordinates[textureIndex++] = yend; // Y

    textureCoordinates[textureIndex++] = xend; // X
    textureCoordinates[textureIndex++] = ystart; // Y  
  }

  defineSquareIndices(indices, indiceOffset, vertexIndex) {
    indices[indiceOffset+0] = vertexIndex + 0;
    indices[indiceOffset+1] = vertexIndex + 1;
    indices[indiceOffset+2] = vertexIndex + 2;

    indices[indiceOffset+3] = vertexIndex + 0;
    indices[indiceOffset+4] = vertexIndex + 2;
    indices[indiceOffset+5] = vertexIndex + 3;
  }

  generatePositionKey(positions, positionOffset) {
    return positions[positionOffset] + ':' + positions[positionOffset+1] + ':' + positions[positionOffset+2];
  }

  defineWeb(positions, webOffset, web) {
    let key = '', i = 0, a, b;
    
    // We are recording that all 3 corners are connected to each other.
    for (i = 0; i < 4; i++) {
      key = this.generatePositionKey(positions, webOffset + (i*3));

      if (!(key in web)) {
        web[key] = [];
      }
      a = i > 0 ? i-1 : 3;
      b = (i+1) % 4;
      web[key].push(positions.slice(webOffset + (a*3), webOffset + 3 + (a*3))); // 0
      web[key].push(positions.slice(webOffset + (i*3), webOffset + 3 + (i*3))); // 1
      web[key].push(positions.slice(webOffset + (b*3), webOffset + 3 + (b*3))); // 2
    }
  }

  defineBottomFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    let webOffset = positionOffset;
    
    let oneLeft, oneBack, oneRight, oneFront, oneBottom;

    // Next concave headache.
    oneLeft = offsetX;
    oneBack = offsetZ + unit;
    oneBottom = offsetY;
    positions[positionOffset++] = oneLeft; // Left
    positions[positionOffset++] = oneBottom;
    positions[positionOffset++] = oneBack; // Back

    // Next concave headache.
    oneLeft = offsetX;
    oneFront = offsetZ;
    oneBottom = offsetY;
    positions[positionOffset++] = oneLeft; // Left
    positions[positionOffset++] = oneBottom;
    positions[positionOffset++] = oneFront; // Front

    // Next concave headache.
    oneRight = offsetX + unit;
    oneFront = offsetZ;
    oneBottom = offsetY;
   
    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneBottom;
    positions[positionOffset++] = oneFront; // Front

    // Next concave headache.
    oneRight = offsetX + unit;
    oneBack = offsetZ + unit;
    oneBottom = offsetY;
   
    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneBottom;
    positions[positionOffset++] = oneBack; // Back

    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    this.defineWeb(positions, webOffset, web);

    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex, offsetX, offsetZ, unit, json.width, json.height);
  }

  defineFrontFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    let webOffset = positionOffset;
    let oneLeft, oneBottom, oneRight, oneTop, oneFront;
    
    // OW! concave hurts.
    oneLeft = offsetX;
    oneBottom = offsetY;
    oneFront = offsetZ;
    
    positions[positionOffset++] = oneLeft;  // Left
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneFront;

    // Next concave headache.
    oneLeft = offsetX;
    oneTop = offsetY + unit;
    oneFront = offsetZ;
    
    positions[positionOffset++] = oneLeft; // Left
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneFront;

    // Next concave headache.
    oneRight = offsetX + unit;
    oneTop = offsetY + unit;
    oneFront = offsetZ;
    
    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneFront;

    // Next concave headache.
    oneRight = offsetX + unit;
    oneBottom = offsetY;
    oneFront = offsetZ;
    
    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneFront;
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    this.defineWeb(positions, webOffset, web);
    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex, offsetX, offsetY, unit, json.width, json.depth * 4);
  }
  
  defineLeftFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    let webOffset = positionOffset;
    let oneBottom, oneTop, oneBack, oneFront, oneLeft;
    
    // Next concave headache.
    oneBottom = offsetY;
    oneBack = offsetZ + unit;
    oneLeft = offsetX;
    
    positions[positionOffset++] = oneLeft;
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneBack; // Back

    // Next concave headache.
    oneTop = offsetY + unit;
    oneBack = offsetZ + unit;
    oneLeft = offsetX;
    
    positions[positionOffset++] = oneLeft;
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneBack; // Back
    
    // Next concave headache.
    oneTop = offsetY + unit;
    oneFront = offsetZ;
    oneLeft = offsetX;
    
    positions[positionOffset++] = oneLeft;
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneFront; // Front

    // Next concave headache.
    oneBottom = offsetY;
    oneFront = offsetZ;
    oneLeft = offsetX;
    
    positions[positionOffset++] = oneLeft;
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneFront; // Front
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    this.defineWeb(positions, webOffset, web);
    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex, offsetZ, offsetY, unit, json.height, json.depth * 4);
  }

  defineBackFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    let webOffset = positionOffset;
    let oneBottom, oneTop, oneLeft, oneRight, oneBack;

    // Next concave headache.
    oneBottom = offsetY;
    oneRight = offsetX + unit;
    oneBack = offsetZ + unit;

    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneBack;

    // Next concave headache.
    oneTop = offsetY + unit;
    oneRight = offsetX + unit;
    oneBack = offsetZ + unit;

    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneBack;

    // Next concave headache.
    oneTop = offsetY + unit;
    oneLeft = offsetX;
    oneBack = offsetZ + unit;

    positions[positionOffset++] = oneLeft; // Left
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneBack;

    // Next concave headache.
    oneBottom = offsetY;
    oneLeft = offsetX;
    oneBack = offsetZ + unit;

    positions[positionOffset++] = oneLeft; // Left
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneBack;

    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    this.defineWeb(positions, webOffset, web);
    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex, offsetX, offsetZ, unit, json.width, json.depth * 4);
  }

  defineRightFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    let webOffset = positionOffset;
    let oneBottom, oneTop, oneBack, oneFront, oneRight;
    
    // Next concave headache.
    oneBottom = offsetY;
    oneFront = offsetZ;
    oneRight = offsetX + unit;
    positions[positionOffset++] = oneRight;
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneFront; // Front

    // Next concave headache.
    oneTop = offsetY + unit;
    oneFront = offsetZ;
    oneRight = offsetX + unit;
    positions[positionOffset++] = oneRight;
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneFront; // Front

    // Next concave headache.
    oneTop = offsetY + unit;
    oneBack = offsetZ + unit;
    oneRight = offsetX + unit;
    positions[positionOffset++] = oneRight;
    positions[positionOffset++] = oneTop; // Top
    positions[positionOffset++] = oneBack; // Back

    // Next concave headache.
    oneBottom = offsetY;
    oneBack = offsetZ + unit;
    oneRight = offsetX + unit;
    positions[positionOffset++] = oneRight;
    positions[positionOffset++] = oneBottom; // Bottom
    positions[positionOffset++] = oneBack; // Back
  
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    this.defineWeb(positions, webOffset, web);
    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex, offsetZ, offsetY, unit, json.height, json.depth * 4);
  }

  defineTopFace(positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web) {
    // Vertex Positions
    let vertexIndex = positionOffset / 3;
    let textureIndex = vertexIndex * 2;
    let webOffset = positionOffset;
    let oneLeft, oneRight, oneBack, oneFront, oneTop;

    // Next concave headache.
    oneLeft = offsetX;
    oneFront = offsetZ;
    oneTop = offsetY + unit;
    positions[positionOffset++] = oneLeft; // Left
    positions[positionOffset++] = oneTop;
    positions[positionOffset++] = oneFront; // Front

    // Next concave headache.
    oneLeft = offsetX;
    oneBack = offsetZ + unit;
    oneTop = offsetY + unit;
    positions[positionOffset++] = oneLeft; // Left
    positions[positionOffset++] = oneTop;
    positions[positionOffset++] = oneBack; // Back

    // Next concave headache.
    oneRight = offsetX + unit;
    oneBack = offsetZ + unit;
    oneTop = offsetY + unit;
    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneTop;
    positions[positionOffset++] = oneBack; // Back

    // Next concave headache.
    oneRight = offsetX + unit;
    oneFront = offsetZ;
    oneTop = offsetY + unit;
    positions[positionOffset++] = oneRight; // Right
    positions[positionOffset++] = oneTop;
    positions[positionOffset++] = oneFront; // Front
  
    // Define 2 triangles out of previous 4 vertices.
    
    this.defineSquareIndices(indices, indiceOffset, vertexIndex);

    this.defineWeb(positions, webOffset, web);
    // Texture coordinates are always the same.
    this.defineSquareTexture(textureCoordinates, textureIndex, offsetX, offsetZ, unit, json.width, json.height);
    
  }

  generate(gl, json) {

    // Count the voxels.
    let voxelCount = 0;
    let x = 0, y = 0, z = 0;
    let smooth = 1;
    if (Object.keys(json).includes('smooth')) {
      smooth = json.smooth;
    }
    this.size = json.scale;
    if (json.textureScale) {
      this.textureScale = json.textureScale;
    }
    
    const positionBuffer = gl.createBuffer();
    this.positions = [];
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the terrain.
    const unit = this.size / json.width;
    let positionOffset = 0, indiceOffset = 0, offsetX = 0, offsetY = 0, offsetZ = 0, one = 0, i = 0, j = 0, joined = 0;
    let start = 0, indices = [], textureCoordinates = [], web = [];
    this.vertexCount = 0;

    for (x = 0; x < json.width; x++) {
      for (y = 0; y < json.depth; y++) {
        for (z = 0; z < json.height; z++) {
          if (this.voxelHit(x, y, z, json)) {
            offsetX = x * unit;
            offsetY = y * unit;
            offsetZ = z * unit;

            // Bottom (CW start bottom left)
            if (!this.voxelHit(x, y-1, z, json)) {
              
              this.defineBottomFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web);
              // This is the number of indexes.
              positionOffset += 4 * 3;
              indiceOffset += 3 * 2;
              this.vertexCount += 3 * 2;
            }

            // Front Face
            if (!this.voxelHit(x, y, z-1, json)) {
              
              this.defineFrontFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web);
              // This is the number of indexes.
              positionOffset += 4 * 3;
              indiceOffset += 3 * 2;
              this.vertexCount += 3 * 2;
            }
            

            // Left
            if (!this.voxelHit(x-1, y, z, json)) {
              
              this.defineLeftFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web);
              // This is the number of indexes.
              positionOffset += 4 * 3;
              indiceOffset += 3 * 2;
              this.vertexCount += 3 * 2;
            }
            

            // Back
            if (!this.voxelHit(x, y, z+1, json)) {
              
              this.defineBackFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web);
              // This is the number of indexes.
              positionOffset += 4 * 3;
              indiceOffset += 3 * 2;
              this.vertexCount += 3 * 2;
            }
            
            
            // Right
            if (!this.voxelHit(x+1, y, z, json)) {
              
              this.defineRightFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web);
              // This is the number of indexes.
              positionOffset += 4 * 3;
              indiceOffset += 3 * 2;
              this.vertexCount += 3 * 2;
            }
            

            // Top
            if (!this.voxelHit(x, y+1, z, json)) {
              
              this.defineTopFace(this.positions, positionOffset, offsetX, offsetY, offsetZ, indices, indiceOffset, unit, textureCoordinates, json, web);
              // This is the number of indexes.
              positionOffset += 4 * 3;
              indiceOffset += 3 * 2;
              this.vertexCount += 3 * 2;
            }
          }
        }
      }
    }

    // Smooooth.
    /*
    let key = '', averageX = 0, averageY = 0, averageZ = 0;
    if (smooth) {
      for (i = 0; i < (positionOffset); i+=3) {
        // We take the average for x, y and z.
        key = this.generatePositionKey(this.positions, i*3);

        if ((key in web)) {
          averageX = averageY = averageZ = 0;
          for (j = 0; j < web[key].length; j++) {
            averageX += web[key][j][0];
            averageY += web[key][j][1];
            averageZ += web[key][j][2];
          }
          averageX /= web[key].length;
          averageY /= web[key].length;
          averageZ /= web[key].length;

          this.positions[i] = averageX;
          this.positions[i+1] = averageY;
          this.positions[i+2] = averageZ;
          
        }
      }
    }*/
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
      this.subdivide(json);

      this.generate(gl, json);

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

  evaluateLOD(gl, cameraX, cameraY, cameraZ) {
    let distance = Math.abs(this.x - cameraX) + Math.abs(this.y - cameraY) + Math.abs(this.z - cameraZ);

    let expected = this.highestLOD - Math.floor(distance / this.distanceLOD);
    if (expected < this.lowestLOD) {
      expected = this.lowestLOD;
    }
    if (this.currentLOD != expected) {
      // Force change!
      this.currentLOD = expected;

      // Recalculate all the bits!
      try {
        this.json = JSON.parse(JSON.stringify(this.jsonLOD[this.currentLOD]));
      } catch (e) {
        // oops!
      }
      this.generate(gl, this.json);
    }
  }
}