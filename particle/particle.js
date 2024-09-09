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
       // directional: 0xffffff,
       // directionalPosition: { x: 1, y: 1, z: 1 }
     };
     static material = {
       color: 0xffffff,
       //side: THREE.DoubleSide
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
 
 // シェーダーマテリアルを作成
 const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },  // 時間の変化に応じた動作が必要な場合
},
 fragmentShader: fragmentShader,
 vertexShader: vertexShader,
 });

 //パーティクルを作成
const vertices = [];

for ( let i = 0; i < 10000; i ++ ) {
	const x = THREE.MathUtils.randFloatSpread( 500 );
	const y = THREE.MathUtils.randFloatSpread( 500 );
	const z = THREE.MathUtils.randFloatSpread( 500 );

	vertices.push( x, y, z );
}

//const material = new THREE.PointsMaterial( { color: 0xffffff, size:0.5 } );
const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const points = new THREE.Points(geometry, shaderMaterial); //シェーダーのマテリアルを使用する！
scene.add( points );

 //ライト
 const ambientLight = new THREE.AmbientLight(Three.light.ambient); 

 // シーンに追加
 scene.add(ambientLight);
 //scene.add(directionalLight1);

 // アニメーション関数を作成
 function animate() {
   requestAnimationFrame(animate);

  // 時間を進める
  shaderMaterial.uniforms.time.value += 0.01;
   
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
     //shaderMaterial.uniforms.resolution.value.set(width, height);
 }


