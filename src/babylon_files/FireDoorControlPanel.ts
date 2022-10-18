import { createApp } from 'vue';
import {
  Scene,
  Engine,
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
  ExecuteCodeAction,
  ActionManager,
  SetValueAction,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { EventEmitter } from 'events';

export class FireDoorControlPanel extends EventEmitter {
  scene: Scene;
  engine: Engine;
  meshes: AbstractMesh[];
  knubBase: AbstractMesh | null;
  redMaterial: StandardMaterial;
  whiteMaterial: StandardMaterial;
  switchStatus: boolean;

  constructor(private canvas: HTMLCanvasElement) {
    super();
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();
    this.createEnvironment();
    this.meshes = [];
    this.switchStatus = false;
    this.knubBase = null;

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
    camera.setPosition(new Vector3(0, 0, 2));
    camera.attachControl(true);
    camera.speed = 0.01;

    // camera.upperBetaLimit = (Math.PI / 2) * 0.99;

    // add light
    const hemiLight = new HemisphericLight(
      'hemiLight',
      new Vector3(1, 0, 0),
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
      'fireDoorControl.glb',
      this.scene
    );

    console.log(meshes.length);
    console.log(meshes);

    meshes.forEach((mesh) => {
      if (mesh.name.includes('Indicator') && mesh.name.includes('primitive1')) {
        mesh.material = this.whiteMaterial;
      } else if (
        mesh.name.includes('BaseZ') &&
        mesh.name.includes('primitive0')
      ) {
        mesh.material = this.createBaseMaterial();
      } else if (mesh.name.includes('Knub')) {
        //put the knob to initial close position
        mesh.rotation = new Vector3(0, 0, Math.PI / 4);
      }
    });

    // const axes = new AxesViewer(this.scene, 1);

    const baseP1 = meshes[1];
    // baseP1.material = this.createBaseMaterial();

    const baseP2 = meshes[2];
    // baseP2.material = this.createPlasticMaterial();

    const knubP1 = meshes[3];

    const knubP2 = meshes[4];

    const indicator = meshes[6];
    indicator.material = this.whiteMaterial;

    // knubP1.actionManager?.registerAction(
    //   new SetValueAction(
    //     ActionManager.OnPickDownTrigger,
    //     knubP1,
    //     'scaling',
    //     new Vector3(1.5, 1.5, 1.5)
    //   )
    // );
    // display object axis
    // axes.xAxis.parent = base;
    // axes.yAxis.parent = base;
    // axes.zAxis.parent = base;

    // console.log(base);
    this.meshes = meshes;
    this.knubBase = knubP1;
    // console.log(meshes[1]);
    // this.meshes.forEach((m) => {
    //   console.log(m);
    //   m.rotation.z = -Math.PI / 4;
    // });

    // base.rotation = new Vector3(0, -Math.PI, 0);
    // knubP1.rotation = new Vector3(0, 0, -Math.PI / 4);
    // knubP2.rotation = new Vector3(0, 0, -Math.PI / 4);

    // knub.position = new Vector3(0, 0, -0.01);

    // base.rotation.x = Math.PI;
    // base.rotation.x -= 0.5;
    // knub.rotation.x -= 0.5;
    this.createActions();
  }

  createActions(): void {
    console.log('createActions');
    if (this.scene && this.knubBase) {
      this.knubBase.actionManager = new ActionManager(this.scene);
      this.knubBase.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, () => {
          this.rotateSwitch();
        })
      );
    }
  }

  createBaseMaterial(): StandardMaterial {
    const baseMat = new StandardMaterial('baseMat', this.scene);
    const diffuseTex = new Texture(
      './textures/metal/metal_diffuse.jpg',
      this.scene
    );
    baseMat.diffuseTexture = diffuseTex;

    const normalTex = new Texture(
      './textures/metal/metal_normal.jpg',
      this.scene
    );

    baseMat.bumpTexture = normalTex;
    baseMat.invertNormalMapX = true;
    baseMat.invertNormalMapY = true;

    const aoTex = new Texture('./textures/metal/metal_ao.jpg', this.scene);
    baseMat.ambientTexture = aoTex;

    const specTex = new Texture('./textures/metal/metal_spec.jpg', this.scene);
    baseMat.specularTexture = specTex;
    baseMat.specularPower = 4;
    return baseMat;
  }

  createPlasticMaterial(): StandardMaterial {
    const plasticMat = new StandardMaterial('plasticMat', this.scene);
    const diffuseTex = new Texture(
      './textures/plastic/plastic_diffuse.jpg',
      this.scene
    );
    plasticMat.diffuseTexture = diffuseTex;

    const normalTex = new Texture(
      './textures/plastic/plastic_normal.jpg',
      this.scene
    );

    plasticMat.bumpTexture = normalTex;
    plasticMat.invertNormalMapX = true;
    plasticMat.invertNormalMapY = true;

    const aoTex = new Texture('./textures/plastic/plastic_ao.jpg', this.scene);
    plasticMat.ambientTexture = aoTex;

    const specTex = new Texture(
      './textures/plastic/plastic_spec.jpg',
      this.scene
    );
    plasticMat.specularTexture = specTex;
    plasticMat.specularPower = 8;
    return plasticMat;
  }

  rotateSwitch(): void {
    // this.meshes.forEach((m) => {
    //   m.rotation.z += direction ? -Math.PI / 2 : Math.PI / 2;
    // });

    this.switchStatus = !this.switchStatus;
    this.meshes[3].rotation.z += this.switchStatus ? Math.PI / 2 : -Math.PI / 2;
    this.meshes[4].rotation.z += this.switchStatus ? Math.PI / 2 : -Math.PI / 2;

    const indicator = this.meshes[6];

    if (this.switchStatus) {
      indicator.material = this.redMaterial;
    } else {
      indicator.material = this.whiteMaterial;
    }

    this.emit('switchStatus', this.switchStatus);
  }
}
