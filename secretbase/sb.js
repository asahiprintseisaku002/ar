 //
 //
 //
 //
 //
 import * as THREE from "three";
 import { OrbitControls } from "three/addons/controls/OrbitControls.js";
 import { fragmentShader } from "./frag.js";
 import { vertexShader } from "./vert.js";

 class Three {
     static width = window.innerWidth;
     static height = window.innerHeight;
     static canvasId = '#myCanvas';
     static camera = {
       fov: 45,
       aspect: window.innerWidth / window.innerHeight,
       position: { x: 0, y: 0, z: 9.5 }
     };
     static light = {
       ambient: 0xffffff,
       // directional: 0xffffff,
       // directionalPosition: { x: 1, y: 1, z: 1 }
     };
     static material = {
       color: 0xffffff,
       side: THREE.DoubleSide
     };

 }

 
 // レンダラーを作成
 const canvasElement = document.querySelector(Three.canvasId);
 const renderer = new THREE.WebGLRenderer({
   canvas: canvasElement,
   alpha: false
 });
 renderer.setClearColor(0x080808, 1);
 renderer.setSize(Three.width, Three.height);

 // シーンを作成
 const scene = new THREE.Scene();

 // カメラを作成
 const camera = new THREE.PerspectiveCamera(Three.camera.fov, Three.camera.aspect);
 // カメラの初期座標を設定
 camera.position.set(Three.camera.position.x, Three.camera.position.y, Three.camera.position.z);
 camera.lookAt(new THREE.Vector3(0, 0, 0));

 // カメラコントローラーを作成
 const controls = new OrbitControls(camera, canvasElement);

// ビデオエレメントを作成
const video1 = document.createElement('video');
video1.src = './sb-movie.mp4'; // 動画ファイルのパスを指定
video1.load();
video1.autoplay = true; // 自動再生を設定
video1.playsInline = true;
video1.loop = true; // ループを設定
video1.muted = true; // 音声をミュートに設定

const video2 = document.createElement('video');
video2.src = './sb-movie-sample02';  // 動画2のパス
video2.load();
video2.autoplay = true;
video2.loop = true;
video2.muted = true;

video1.addEventListener('canplaythrough', () => {
  video1.play();
});

video2.addEventListener('canplaythrough', () => {
  video2.play();
});

const videoTexture1 = new THREE.VideoTexture(video1);
const videoTexture2 = new THREE.VideoTexture(video2);

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    videoTexture1: { value: videoTexture1 },  // 動画1のテクスチャ
    videoTexture2: { value: videoTexture2 },  // 動画2のテクスチャ
    time: { value: 0.0 }  // 時間をシェーダーに渡す
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide
});

// テクスチャを読み込む
//const textureLoader = new THREE.TextureLoader();
//const planeMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
const planeGeometry = new THREE.PlaneGeometry(16, 9);
//const material = new THREE.MeshBasicMaterial(Three.material.color, Three.material.side);
const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
plane.position.set(-5.0, 0.0, -10.0);
plane.rotation.y = 0.5;
scene.add(plane);

 //ライト
 const ambientLight = new THREE.AmbientLight(Three.light.ambient); 

 // シーンに追加
 scene.add(ambientLight);
 //scene.add(directionalLight1);

 // アニメーション関数を作成
 function animate(time) {
   requestAnimationFrame(animate);

   shaderMaterial.uniforms.time.value = time * 0.001;
   
   renderer.render(scene, camera);
 }

 animate();

 // 初期化のために実行
 onResize();
 // リサイズイベント発生時に実行
 window.addEventListener("resize", onResize);

 function onResize() {
     // サイズを取得
     const width = window.innerWidth;
     const height = window.innerHeight;

     // レンダラーのサイズを調整する
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(width, height);

     // カメラのアスペクト比を正す
     camera.aspect = width / height;
     camera.updateProjectionMatrix();
 }

