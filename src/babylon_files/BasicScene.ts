import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Texture,
} from '@babylonjs/core';

export class BasicScene {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  createScene(): Scene {
    // create new scene
    const scene = new Scene(this.engine);
    // add camera
    const camera = new FreeCamera('camera', new Vector3(0, 2, -5), scene);
    camera.attachControl();

    // add light
    const hemiLight = new HemisphericLight(
      'hemiLight',
      new Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 0.5;

    // add ground
    const ground = MeshBuilder.CreateGround(
      'ground',
      {
        width: 10,
        height: 10,
      },
      scene
    );

    const groundMaterial = new StandardMaterial('Ground Material', scene);

    groundMaterial.diffuseColor = Color3.White();

    ground.material = groundMaterial;

    const sphere = MeshBuilder.CreateSphere(
      'sphere',
      { diameter: 2, segments: 32 },
      scene
    );
    sphere.position = new Vector3(0, 1, 0);
    return scene;
  }
}
