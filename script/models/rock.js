class Rock extends GLTFModel {
  constructor() {
    super();
    this.scale = 4;
    this.doSwap = 1;
    this.heightOffset = -0.5;
    this.blend = 0;
    this.modelPath = 'model/rock/gltf/rock.gltf';
  }

}
