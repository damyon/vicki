var cubeRotation = 0.0;

main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }


  gl.enable(gl.DEPTH_TEST);

  const controls = new Controls(canvas);
  // Expose controls to the window.
  this.controls = controls;
  const camera = new Camera();

  /**
   * Section 2 - Shaders
   */

  camera.buildShaders(gl);
  camera.useCameraShader(gl);
  
  let terrain = new Terrain();
  let cloud1 = new Cloud();

  let slab = new Slab();
  let carpet = new Carpet();
  let wall = new Wall();
  let wallinner = new WallInner();
  let upper = new Upper();
  let upperinner = new UpperInner();
  let roof = new Roof();
  let couch = new Couch();
  let uppercouch = new UpperCouch();
  let benchlegs = new BenchLegs();
  let benchtop = new BenchTop();
  let kitchenbenchtopnorth = new KitchenBenchTopNorth();
  let kitchencupboardsnorth = new KitchenCupboardsNorth();
  let kitchenbenchtopsouth = new KitchenBenchTopSouth();
  let kitchencupboardssouth = new KitchenCupboardsSouth();
  let kitchenshelves = new KitchenShelves();
  let kitchenglass = new KitchenGlass();
  let tvcabinet = new TVCabinet();
  let uppertvcabinet = new UpperTVCabinet();
  let tv = new TV();
  let uppertv = new UpperTV();
  let coffeetable = new CoffeeTable();
  let mainbed = new MainBed();
  let upperbedwest = new UpperBedWest();
  let upperbedeast = new UpperBedEast();
  let mainbedwindow = new MainBedWindow();
  let mainbedglass = new MainBedGlass();
  let livingglass = new LivingGlass();
  let kitchendoor = new KitchenDoor();
  let upperglasseast = new UpperGlassEast();
  let upperglassnorth = new UpperGlassNorth();
  let upperglasssouth = new UpperGlassSouth();
  let upperglasswest = new UpperGlassWest();
  let mainbedsidenorth = new MainBedSideNorth();
  let mainbedsidesouth = new MainBedSideSouth();
  let mainbedtvcabinet = new MainBedTVCabinet();
  let mainbedtv = new MainBedTV();
  let walkinrobeshelves = new WalkInRobeShelves();
  let bath = new Bath();
  let bathwater = new BathWater();
  let mainshower = new MainShower();
  let uppershower = new UpperShower();
  let mainbathcupboard = new MainBathCupboard();
  let upperbathcupboard = new UpperBathCupboard();
  let mainbathmirror = new MainBathMirror();
  let mainbathwindow = new MainBathWindow();
  let mainbathframe = new MainBathFrame();
  let mainbathsink = new MainBathSink();
  let upperbathsink = new UpperBathSink();
  let maintoilet = new MainToilet();
  let uppertoilet = new UpperToilet();
  let garageface = new GarageFace();
  let fridge = new Fridge();
  let frontdoor = new FrontDoor();
  let toiletdoor = new ToiletDoor();
  let mainbeddoor = new MainBedDoor();
  let upperbeddooreast = new UpperBedDoorEast();
  let upperbedcupboardeast = new UpperBedCupboardEast();
  let upperbedcupboardwest = new UpperBedCupboardWest();
  let upperbathdoor = new UpperBathDoor();
  let upperbeddoorwest = new UpperBedDoorWest();
  let mainbathdoor = new MainBathDoor();
  let garagedooreast = new GarageDoorEast();
  let garagedoornorth = new GarageDoorNorth();
  let garagedoor = new GarageDoor();
  let throttleLOD = 10.0;
  let targetFPS = 5;
  let i = 0;
  let lastLOD = [];

  for (i = 0; i < 10; i++) {
    lastLOD[i] = 0;
  }

  let drawables = [
    terrain,
    new Sea(1, 0, 1),
    cloud1,
    slab,
    carpet,
    wall,
    wallinner,
    upper,
    upperinner,
    couch,
    uppercouch,
    benchlegs,
    benchtop,
    kitchenbenchtopnorth,
    kitchencupboardsnorth,
    kitchenbenchtopsouth,
    kitchencupboardssouth,
    kitchenshelves,
    tvcabinet,
    uppertvcabinet,
    tv,
    uppertv,
    coffeetable,
    mainbed,
    upperbedwest,
    upperbedeast,
    mainbedtvcabinet,
    mainbedtv,
    mainbedsidenorth,
    mainbedsidesouth,
    mainbathcupboard,
    upperbathcupboard,
    mainbathmirror,
    mainbathsink,
    upperbathsink,
    maintoilet,
    uppertoilet,
    walkinrobeshelves,
    bath,
    garageface,
    fridge,
    frontdoor,
    garagedooreast,
    toiletdoor,
    mainbeddoor,
    upperbeddooreast,
    upperbedcupboardeast,
    upperbedcupboardwest,
    upperbathdoor,
    upperbeddoorwest,
    mainbathdoor,
    garagedoornorth,
    garagedoor,
    roof,
    mainbathframe,
    bathwater,
    mainshower,
    uppershower,
    kitchenglass,
    mainbedwindow,
    mainbedglass,
    livingglass,
    kitchendoor,
    upperglasswest,
    upperglasseast,
    upperglassnorth,
    upperglasssouth,
    mainbathwindow,
  ];
  
  for (model of drawables) {
    model.initBuffers(gl);
  }
  
  cloud1.setPosition(gl, 100, 400, -480);
  
  /**
   * Camera shader setup
   */

  /**
   * Light shader setup
   */

  camera.useLightShader(gl);

  camera.createShadowDepthTexture(gl);

  // We create an orthographic projection and view matrix from which our light
  // will view the scene
  camera.createLightViewMatrices(gl);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  /**
   * Scene uniforms
   */
  camera.bindCameraUniforms(gl);

  // Draw our model onto the shadow map
  function drawShadowMap(sceneCamera, sceneControls, sceneDrawables, deltaTime, absTime) {

    sceneCamera.prepareShadowFrame(gl, sceneControls);

    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, sceneCamera.lightModelViewMatrix, modelViewMatrix);
    gl.uniformMatrix4fv(sceneCamera.shadowModelViewMatrix, false, modelViewMatrix);
    
    for (model of sceneDrawables) {
      model.draw(gl, sceneCamera, false, deltaTime, absTime);
    }

    sceneCamera.finishShadowFrame(gl);
  }

  // Draw our model and floor onto the scene
  function drawModels(sceneCamera, sceneControls, sceneDrawables, deltaTime, absTime, sceneLastLOD) {
    sceneCamera.prepareCameraFrame(gl, sceneControls);

    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, sceneCamera.cameraMatrix, modelViewMatrix);
    gl.uniformMatrix4fv(sceneCamera.uMVMatrix, false, modelViewMatrix);

    gl.uniform3fv(sceneCamera.uColor, [1.0, 1.0, 0.8]);
    let modelIndex = 0;
    let updateIndex = -1;
    for (model of sceneDrawables) {
      modelIndex = ((modelIndex + 1) % 10);

      if (((absTime + modelIndex) - sceneLastLOD[modelIndex]) / 10 > throttleLOD) {
      
        model.evaluateLOD(gl, sceneControls.x, sceneControls.y, sceneControls.z);
        updateIndex = modelIndex;
      }
    }
    if (updateIndex > 0) {
      sceneLastLOD[updateIndex] = absTime;
    }

    for (model of sceneDrawables) {
      model.predraw(gl);
      model.draw(gl, sceneCamera, true, deltaTime, absTime);
      model.postdraw(gl);
    }

    sceneCamera.finishCameraFrame(gl);
  }

  var then = 0;
  var absTime = 0;

  function resize() {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {
   
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;

      camera.width = displayWidth;
      camera.height = displayHeight;
    }
  }

  // Draw our shadow map and light map every request animation frame
  function draw(sceneCamera, sceneControls, sceneDrawables, drawLastLOD, now) {
    now *= 0.01;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    resize();
   
    sceneControls.processKeys();

    let targetRotate = Math.PI/4;
    if (sceneControls.actionCast) {
      targetRotate = Math.PI/3;
    }
    let rotateDelta = (targetRotate - sceneControls.rodRotate) / 10;
    sceneControls.rodRotate += rotateDelta;
    sceneControls.rodRotate = Math.PI/3;

    drawShadowMap(sceneCamera, sceneControls, sceneDrawables, deltaTime, absTime);
    drawModels(sceneCamera, sceneControls, sceneDrawables, deltaTime, absTime, drawLastLOD);

    absTime += deltaTime;

    // We don't want full throttle.
    let delay = 1000 / targetFPS;
    window.setTimeout(function() {
      window.requestAnimationFrame(draw.bind(this, sceneCamera, sceneControls, sceneDrawables, lastLOD));
    }, delay);
  }
  window.requestAnimationFrame(draw.bind(this, camera, controls, drawables, lastLOD));
}

function up() {
  this.controls.up();
}

function down() {
  this.controls.down();
}

function forward() {
  this.controls.forward();
}
