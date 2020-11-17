'use strict';

class Tree extends GLTFModel {
  constructor() {
    super();
    this.scale = 1.6 + Math.random();
    this.heightOffset = -2;
    this.blend = 0;
    this.modelPath = 'model/tree/scene.gltf';
  }

}
