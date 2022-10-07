import {
  Scene,
  Engine,
  FreeCamera,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Texture,
  SceneLoader,
} from '@babylonjs/core';
import '@babylonjs/loaders';

export class CustomModels {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();
    this.importModel();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  createScene(): Scene {
    // create new scene
    const scene = new Scene(this.engine);
    // add camera
    // const camera = new FreeCamera('camera', new Vector3(0, 0.2, -1.1), scene);
    // camera.setTarget(Vector3.Zero());
    // camera.attachControl(true);

    var camera = new ArcRotateCamera(
      'Camera',
      0,
      0,
      10,
      new Vector3(0, 0, 0),
      scene
    );
    camera.setPosition(new Vector3(0, 0.2, -1.1));
    camera.attachControl(true);
    camera.speed = 0.05;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;

    // add light
    const hemiLight = new HemisphericLight(
      'hemiLight',
      new Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 0.5;

    // add ground
    // const ground = MeshBuilder.CreateGround(
    //   'ground',
    //   {
    //     width: 10,
    //     height: 10,
    //   },
    //   scene
    // );

    // const groundMaterial = new StandardMaterial('Ground Material', scene);

    // groundMaterial.diffuseColor = Color3.White();

    // ground.material = groundMaterial;

    return scene;
  }

  async importModel(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      '',
      './models/',
      'switch.glb',
      this.scene
    );

    const base = meshes[1];
    console.log(base);

    base.rotation = new Vector3(-Math.PI / 4, 0, 0);

    const knob = meshes[2];
    knob.rotation = new Vector3(-Math.PI / 4, 0, 0);

    console.log(knob);
  }
}
