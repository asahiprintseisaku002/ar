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
renderer.setClearColor(0x080808, 1);
renderer.setSize(Three.width, Three.height);

// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(Three.camera.fov, Three.camera.aspect);
camera.position.set(Three.camera.position.x, Three.camera.position.y, Three.camera.position.z);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// カメラコントローラーを作成
const controls = new OrbitControls(camera, canvasElement);

// マウスの初期位置をウィンドウの中央に設定
const mouse = new THREE.Vector2(0, 0);

// マウスムーブイベントでカーソルの位置を取得
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  // -1から1の範囲に正規化
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // -1から1の範囲に正規化
});

// シェーダーマテリアルを作成
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    mouse: { value: new THREE.Vector2(0, 0) }, // マウスの座標をuniformとして渡す
  },
  fragmentShader: fragmentShader,
  vertexShader: vertexShader,
  transparent: true,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});

// パーティクルを作成
const vertices = [];
const speeds = [];  // ランダムな速度を保持する配列

for (let i = 0; i < 10000; i++) {
  const x = THREE.MathUtils.randFloatSpread(500);
  const y = THREE.MathUtils.randFloatSpread(500);
  const z = THREE.MathUtils.randFloatSpread(10);
  vertices.push(x, y, z);

  // 速度をランダムに設定 (0.5〜2.0の範囲でランダムに設定)
  const speed = Math.random() * 0.9 + 0.1;
  speeds.push(speed);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

// パーティクルのサイズ情報もシェーダーに送る場合は、size属性も追加します
const sizes = new Float32Array(10000).fill(50.0);  // すべてのパーティクルのサイズを5.0に設定
geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

// ランダムな速度もattributeとしてシェーダーに渡す
geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1));  // 各パーティクルの速度

// パーティクルシステムを作成
const points = new THREE.Points(geometry, shaderMaterial);
scene.add(points);


// ライト
const ambientLight = new THREE.AmbientLight(Three.light.ambient);
scene.add(ambientLight);

// アニメーション関数
function animate() {
  requestAnimationFrame(animate);

  // 時間を進める
  shaderMaterial.uniforms.time.value += 0.01;


  // マウスの座標をシェーダーに渡す
  shaderMaterial.uniforms.mouse.value.x = mouse.x * 250.0;
  shaderMaterial.uniforms.mouse.value.y = mouse.y * 250.0;

  // レンダリング
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
