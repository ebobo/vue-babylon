import { createApp } from 'vue';
import {
  Scene,
  Engine,
  FreeCamera,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color4,
  Texture,
  SceneLoader,
  AbstractMesh,
  AxesViewer,
  Color3,
  CubeTexture,
} from '@babylonjs/core';
import '@babylonjs/loaders';

export class CustomModels {
  scene: Scene;
  engine: Engine;
  meshes: AbstractMesh[];
  redMaterial: StandardMaterial;
  whiteMaterial: StandardMaterial;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();
    this.createEnvironment();
    this.meshes = [];

    this.whiteMaterial = new StandardMaterial('white');
    this.whiteMaterial.alpha = 1;
    this.whiteMaterial.diffuseColor = new Color3(1, 1, 1);

    this.redMaterial = new StandardMaterial('red');

    this.redMaterial.roughness = 0;
    this.redMaterial.diffuseColor = new Color3(1, 0, 0);
    this.redMaterial.specularColor = new Color3(0.5, 0, 0);
    this.redMaterial.ambientColor = new Color3(0.23, 0, 0);

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

    scene.clearColor = new Color4(1, 1, 1);

    scene.ambientColor = new Color3(1, 1, 1);

    var camera = new ArcRotateCamera(
      'Camera',
      0,
      0,
      10,
      new Vector3(0, 0, 0),
      scene
    );
    // set the camera position x, y, z axis
    camera.setPosition(new Vector3(0, -2, 5));
    camera.attachControl(true);
    camera.speed = 0.01;
    // camera.upperBetaLimit = (Math.PI / 2) * 0.99;

    // add light
    const hemiLight = new HemisphericLight(
      'hemiLight',
      new Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 1;
    hemiLight.diffuse = new Color3(1, 1, 1);
    hemiLight.specular = new Color3(1, 1, 1);
    hemiLight.groundColor = new Color3(1, 1, 1);

    // add axes
    // const axes = new AxesViewer(scene, 1.5);

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

  createEnvironment(): void {
    if (this.scene) {
      const envTex = CubeTexture.CreateFromPrefilteredData(
        './environments/workshop.env',
        this.scene
      );

      this.scene.environmentTexture = envTex;
      this.scene.createDefaultSkybox(envTex, true);
    }
  }

  async importModel(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      '',
      './models/',
      'switchAll.glb',
      this.scene
    );

    console.log(meshes.length);
    console.log(meshes);

    // const axes = new AxesViewer(this.scene, 1);

    const baseP1 = meshes[1];
    const baseP2 = meshes[2];
    const knubP1 = meshes[3];
    const knubP2 = meshes[4];

    const indicator = meshes[6];

    indicator.material = this.whiteMaterial;

    // axes.xAxis.parent = base;
    // axes.yAxis.parent = base;
    // axes.zAxis.parent = base;

    // console.log(base);
    this.meshes = meshes;

    console.log(meshes[1]);
    // this.meshes.forEach((m) => {
    //   console.log(m);
    //   m.rotation.z = -Math.PI / 4;
    // });

    // base.rotation = new Vector3(0, -Math.PI, 0);
    knubP1.rotation = new Vector3(0, 0, -Math.PI / 4);
    knubP2.rotation = new Vector3(0, 0, -Math.PI / 4);

    // knub.position = new Vector3(0, 0, -0.01);

    // base.rotation.x = Math.PI;
    // base.rotation.x -= 0.5;
    // knub.rotation.x -= 0.5;
  }

  rotateMeshX(direction: boolean): void {
    // this.meshes.forEach((m) => {
    //   m.rotation.z += direction ? -Math.PI / 2 : Math.PI / 2;
    // });

    this.meshes[3].rotation.z += direction ? Math.PI / 2 : -Math.PI / 2;
    this.meshes[4].rotation.z += direction ? Math.PI / 2 : -Math.PI / 2;

    const indicator = this.meshes[6];

    if (direction) {
      indicator.material = this.redMaterial;
    } else {
      indicator.material = this.whiteMaterial;
    }
  }
}
