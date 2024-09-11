//
//
//
//
//
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { fragmentShader } from "./frag.js";
import { vertexShader } from "./vert.js";
import { fragBG } from "./fragBG.js";
import { vertBG } from "./vertBG.js";

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

function loadSVG(url) {
  return new Promise((resolve, reject) => {
    const loader = new SVGLoader();
    loader.load(
      url,
      data => resolve(data),  // 成功時
      undefined,
      error => reject(error)   // エラー時
    );
  });
}

async function getSVGPoints(svgUrl) {
    const data = await loadSVG(svgUrl);  // SVGデータを非同期で取得
    const svgPoints = [];
    const offset = new THREE.Vector3(0.0, 0.0, 0.0);  // オフセットの設定
  
    data.paths.forEach(path => {
      path.subPaths.forEach(subPath => {
        const points = subPath.getPoints();
        points.forEach(point => {
          // SVGの座標をWebGL用にスケール調整し、新しいベクトルを作成
          const vector = new THREE.Vector3(point.x * 0.5, point.y * 0.5, 0);
          
          // オフセットを適用
          vector.add(offset);
          
          // オフセット適用後のベクトルを配列に追加
          svgPoints.push(vector);
        });
      });
    });
  
    return svgPoints;
  }
  

// レンダラーを作成
const canvasElement = document.querySelector(Three.canvasId);
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement,
  alpha: false
});
renderer.setClearColor(0xcccccc, 1);
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

  if (intersects) {
    // シェーダーに渡すマウスの3D位置を更新
    shaderMaterial.uniforms.mouse.value.set(intersects.x, intersects.y);
  }
});

// シェーダーマテリアルを作成
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    mouse: { value: new THREE.Vector2(0, 0) }, // マウスの座標をuniformとして渡す
    color1: { value: new THREE.Color(0xf2ff9d) },  // 最初の色（赤）
    color2: { value: new THREE.Color(0xffffff) },  // 2番目の色（青）
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
  const y = THREE.MathUtils.randFloatSpread(-250, 0);
  const z = THREE.MathUtils.randFloatSpread(500);
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

// 背景シェーダーマテリアルを作成
const backgroundMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    color1: { value: new THREE.Color(0xffe2f4) },  // 赤
    color2: { value: new THREE.Color(0xfff9e2) },  // 緑
    color3: { value: new THREE.Color(0xe2faff) },  // 青
  },
  fragmentShader: fragBG,
  vertexShader: vertBG,
  side: THREE.DoubleSide
});

// 背景用の大きな平面を作成
const backgroundGeometry = new THREE.PlaneGeometry(2000, 2000);
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
backgroundMesh.position.z = -500;
scene.add(backgroundMesh);

// ライト
const ambientLight = new THREE.AmbientLight(Three.light.ambient, 0.1);
scene.add(ambientLight);

let svgPoints = [];
let moveToShape = false;

// SVGの座標を非同期で読み込む
async function loadAndAnimateSVG() {
  svgPoints = await getSVGPoints('./circleoflife.svg');  // SVGを読み込んで座標を取得
  setTimeout(() => {
    moveToShape = true;  // 8秒後にSVG形状への集合を開始
  }, 3000);
}

// アニメーション関数
function animate() {
  requestAnimationFrame(animate);

  // 時間を進める
  shaderMaterial.uniforms.time.value += 0.01;
  backgroundMaterial.uniforms.time.value += 0.0008;

  // マウスの座標をシェーダーに渡す
  shaderMaterial.uniforms.mouse.value.x = mouse.x * 250.0;
  shaderMaterial.uniforms.mouse.value.y = mouse.y * 250.0;

  points.rotation.y += 0.0001;

  // 8秒経過後にパーティクルをSVGの座標に移動させる
  if (moveToShape && svgPoints.length > 0) {
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length / 3; i++) {
      const target = svgPoints[i % svgPoints.length];  // SVGのポイントをループで取得
      const currentPos = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

      // 線形補間で徐々に移動
      currentPos.lerp(target, 0.05);  // 0.05 は移動速度を調整するパラメータ
      positions[i * 3] = currentPos.x;
      positions[i * 3 + 1] = currentPos.y;
      positions[i * 3 + 2] = currentPos.z;
    }
    geometry.attributes.position.needsUpdate = true;  // パーティクル位置の更新を通知
  }

  // レンダリング
  renderer.render(scene, camera);
}
loadAndAnimateSVG();
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
