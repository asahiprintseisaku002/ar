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
 //const controls = new OrbitControls(camera, canvasElement);
 
 // シェーダーマテリアルを作成
 const shaderMaterial = new THREE.ShaderMaterial({
 
 uniforms: {
     time: { value: 1.0 },
     resolution: { value: new THREE.Vector4() },
     progress: { type: "f", value: 0 },
 },
 fragmentShader: fragmentShader,
 vertexShader: vertexShader,
 
 });

 //パーティクルを作成
const vertices = [];

const velocityY = 0.01;     // パーティクルの上昇速度
const waveAmplitude = 3;  // 左右に揺れる幅
const waveFrequency = 0.005;  // 左右の揺れの速さ

for ( let i = 0; i < 10000; i ++ ) {
	const x = THREE.MathUtils.randFloatSpread( 2000 );
	const y = THREE.MathUtils.randFloatSpread( -1000, 0 );
	const z = THREE.MathUtils.randFloatSpread( 2000 );

	vertices.push( x, y, z );
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const material = new THREE.PointsMaterial( { color: 0x888888 } );
const points = new THREE.Points( geometry, material );
scene.add( points );

 const planeGeometry = new THREE.PlaneGeometry(16, 9);
 //const material = new THREE.MeshBasicMaterial(Three.material.color, Three.material.side);
 const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
 scene.add(plane);

 //ライト
 const ambientLight = new THREE.AmbientLight(Three.light.ambient); 

 // シーンに追加
 scene.add(ambientLight);
 //scene.add(directionalLight1);

 let time = 0;  // 時間を保持する変数

 // アニメーション関数を作成
 function animate() {
   requestAnimationFrame(animate);

   const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        // y座標を上に移動させる
        positions[i + 1] += velocityY;

        // x座標をサイン波で左右に揺らす
        positions[i] += Math.sin(time + i) * waveAmplitude * waveFrequency;

        // パーティクルが画面上部を超えたら下部に戻す
        if (positions[i + 1] > 1000) {
            positions[i + 1] = -1000;
        }
    }
    
    // 位置属性の更新を指定
    geometry.attributes.position.needsUpdate = true;
   
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
     shaderMaterial.uniforms.resolution.value.set(width, height);
 }


