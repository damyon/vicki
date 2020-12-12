class Boat extends GLTFModel {
  constructor() {
    super();
    this.scale = 6;
    this.size = 6;
    this.boatWidth = this.size / 2;
    this.boatLength = this.size;
    this.doSwap = 1;
    this.heightOffset = 0;
    this.blend = 0;
    this.modelPath = 'model/boat/gltf/boat.gltf';
  }

}
