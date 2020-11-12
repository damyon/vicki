
class GLTFModel extends Drawable {

  constructor(index) {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.scale = 1.0;
    this.doSwap = true;
    this.heightOffset = 0;

    this.blend = 1;
    
    this.gltfModel = null;

    this.modelPath = 'model/a/BoxTextured.gltf';

    this.currentPositionBuffer = null;
  }

  /**
   * Apply an offset to the position of all the vertices.
   *
   */
  setPosition(gl, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z + this.heightOffset;

    // Recalculate the current Position Buffer;
    if (this.currentPositionBuffer) {
      gl.deleteBuffer(this.currentPositionBuffer);
    }
    if (this.gltfModel) {
      this.currentPositionBuffer = getPositionBufferFromName(gl, 
      this.gltfModel.gltf, 
      this.gltfModel.buffers, 
      this.gltfModel.meshes[0].mesh, 
      this.x, 
      this.y, 
      this.z,
      this.scale,
      this.doSwap);
    }
  }

  getVertexCount() {
    const mesh = this.gltfModel.meshes[0];
      
    return mesh.elementCount;
  }

  /**
   * initBuffers
   *
   * Initialize the buffers we'll need.
   */
  initBuffers(gl) {
    gltf.loadModel(gl, this.modelPath).then((model) => {
      this.gltfModel = model;

      this.setPosition(gl, this.x, this.y, this.z);
    });
    
    return this.gltfModel;
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
    }
  
    if (this.gltfModel) {

      for (var index in this.gltfModel.meshes) {
        const mesh = this.gltfModel.meshes[index];
    
        // Points.
        if (this.currentPositionBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.currentPositionBuffer.buffer);
        } else {
          gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positions.buffer);
        }
      
        // Indices.
        const vertexPosition = gl.getAttribLocation(camera.lightShaderProgram, 'aVertexPosition');
        
        gl.vertexAttribPointer(vertexPosition, mesh.positions.size, mesh.positions.type, false, 0, 0);
        gl.enableVertexAttribArray(vertexPosition);

        // Tell WebGL how to pull out the texture coordinates from
        // the texture coordinate buffer into the textureCoord attribute.
        if (mesh.texCoord) {
          const numComponents = 2;
          const type = gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;

          const textureCoord = gl.getAttribLocation(camera.cameraShaderProgram, 'aTextureCoord');
          gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texCoord.buffer);
          gl.vertexAttribPointer(
              textureCoord,
              mesh.texCoord.size,
              mesh.texCoord.type,
              normalize,
              stride,
              offset);
          gl.enableVertexAttribArray(textureCoord);
        }


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
      
        // Material
        const materialId = mesh.material;
        const material = this.gltfModel.materials[materialId];

        if (shadow) {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, material.baseColorTexture);
        }
        
        gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);
      }
    }

  }
}