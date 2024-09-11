 //
 //
 //
 //
 //
 import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { fragmentShader } from "./frag.js";
import { vertexShader } from "./vert.js";
import { fragmentShader2 } from "./fragGround.js";
import { vertexShader2} from "./vertGround.js";

class Three {
  static width = window.innerWidth;
  static height = window.innerHeight;
  static canvasId = '#myCanvas';
  static camera = {
    fov: 45,
    aspect: window.innerWidth / window.innerHeight,
    position: { x: 0, y: 0, z: 200 }
  };
  static light = {
    ambient: 0xffffff,
  };
}

// レンダラーを作成
const canvasElement = document.querySelector(Three.canvasId);
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement,
  alpha: false
});
renderer.setClearColor(0xffba9d, 1);
renderer.setSize(Three.width, Three.height);

// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(Three.camera.fov, Three.camera.aspect);
camera.position.set(Three.camera.position.x, Three.camera.position.y, Three.camera.position.z);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// カメラコントローラーを作成
const controls = new OrbitControls(camera, canvasElement);

const raycaster = new THREE.Raycaster();  // Raycasterの作成
const mouse = new THREE.Vector2();  // マウスの2Dスクリーン座標

// マウスムーブイベントでカーソルの位置を取得
window.addEventListener('mousemove', (event) => {
  // マウスのスクリーン座標を正規化 (-1 から 1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycasterを使ってマウスの位置を3Dワールド空間に変換
  raycaster.setFromCamera(mouse, camera);  // カメラに基づいてスクリーン座標をワールド座標に変換

  // 3D空間上の位置を取得するため、ゼロ平面（z = 0）との交点を取得
  const intersects = raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), new THREE.Vector3());

});

// Planeジオメトリの作成 (地面)
const planeGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);  // 横20, 縦20, セグメント数100
planeGeometry.rotateX(-Math.PI / 2);  // 地面を水平にする

// 法線ベクトルを再計算
planeGeometry.computeVertexNormals();

// シェーダーマテリアルの作成
const planeShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },  // 時間を渡す
    lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() }, 
  },
  vertexShader: vertexShader2,  // 頂点シェーダー（波打つ動き）
  fragmentShader: fragmentShader2,  // フラグメントシェーダー（地面の色）
  blending: THREE.NormalBlending,  // ブレンドを通常に設定
  depthTest: true,   // 深度テストを有効にする
  depthWrite: true,  // 深度書き込みを有効にする
  transparent: false,
  wireframe: false,
});

// Plane（地面）を作成してシーンに追加
const plane = new THREE.Mesh(planeGeometry, planeShaderMaterial);
plane.position.y = -50;
scene.add(plane);

// ライト
const ambientLight = new THREE.AmbientLight(Three.light.ambient, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 50, 50);  // ライトの位置
scene.add(directionalLight);
// ライトの方向を正しくシェーダーに渡す
const lightDirection = new THREE.Vector3(-directionalLight.position.x, -directionalLight.position.y, -directionalLight.position.z).normalize();
planeShaderMaterial.uniforms.lightDirection.value = lightDirection;


// アニメーション関数
function animate() {
  requestAnimationFrame(animate);

  planeShaderMaterial.uniforms.time.value += 0.01;

  //plane.rotation.y += 0.001;

  // レンダリング
  renderer.clear(true, true, true); 
  renderer.render(scene, camera);
}

animate();

// リサイズ処理
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

onResize();
window.addEventListener("resize", onResize);
