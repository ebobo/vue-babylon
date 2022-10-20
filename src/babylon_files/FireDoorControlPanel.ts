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
  //the black handler part of the knub
  knubBodys: Map<string, AbstractMesh>;
  //the white indicator part of the knub
  knubHeaders: Map<string, AbstractMesh>;
  //on/off status
  controlStatus: Map<string, boolean>;
  //on/off status
  indicators: Map<string, AbstractMesh>;

  redMaterial: StandardMaterial;
  whiteMaterial: StandardMaterial;

  constructor(private canvas: HTMLCanvasElement) {
    super();
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();
    this.createEnvironment();
    this.knubBodys = new Map();
    this.knubHeaders = new Map();
    this.controlStatus = new Map();
    this.indicators = new Map();

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
    camera.setPosition(new Vector3(0, 0, 1.8));
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
      'FireDoorControlWithIcon.glb',
      this.scene
    );

    // console.log(meshes.length);

    meshes.forEach((mesh) => {
      if (mesh.name.includes('Indicator') && mesh.name.includes('primitive1')) {
        mesh.material = this.whiteMaterial;
        const tag = mesh.name
          .replace('Indicator', '')
          .replace('_primitive1', '');
        this.indicators.set(tag, mesh);
      } else if (
        mesh.name.includes('BaseZ') &&
        mesh.name.includes('primitive0')
      ) {
        mesh.material = this.createBaseMaterial();
      } else if (mesh.name.includes('Knub')) {
        //put the knob to initial close position
        //primitive1 is the white part, primitive0 is the black part
        if (mesh.name.includes('primitive0')) {
          const tag = mesh.name.replace('Knub', '').replace('_primitive0', '');
          this.knubBodys.set(tag, mesh);
          this.controlStatus.set(tag, true);
        } else if (mesh.name.includes('primitive1')) {
          const tag = mesh.name.replace('Knub', '').replace('_primitive1', '');
          this.knubHeaders.set(tag, mesh);
        }
        mesh.rotation = new Vector3(0, 0, Math.PI / 4);
      }
    });

    this.createActions();
  }

  createActions(): void {
    console.log('createActions');
    if (this.scene && this.knubBodys.size > 0) {
      this.knubBodys.forEach((mesh, tag) => {
        mesh.actionManager = new ActionManager(this.scene);
        mesh.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, () => {
            this.rotateSwitch(tag);
          })
        );
      });
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

  rotateSwitch(name: string): void {
    if (!this.controlStatus.has(name)) return;
    const status = this.controlStatus.get(name);

    const body = this.knubBodys.get(name);
    if (body) {
      body.rotation.z += status ? -Math.PI / 2 : Math.PI / 2;
    }
    const header = this.knubHeaders.get(name);
    if (header) {
      header.rotation.z += status ? -Math.PI / 2 : Math.PI / 2;
    }

    const indicator = this.indicators.get(name);
    if (indicator) {
      indicator.material = status ? this.redMaterial : this.whiteMaterial;
    }

    this.controlStatus.set(name, !status);

    // this.switchStatus = !this.switchStatus;
    // this.meshes[3].rotation.z += this.switchStatus ? Math.PI / 2 : -Math.PI / 2;
    // this.meshes[4].rotation.z += this.switchStatus ? Math.PI / 2 : -Math.PI / 2;

    // const indicator = this.meshes[6];

    // if (this.switchStatus) {
    //   indicator.material = this.redMaterial;
    // } else {
    //   indicator.material = this.whiteMaterial;
    // }

    // this.emit('switchStatus', this.switchStatus);
  }
}
