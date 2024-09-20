 //
 //
 //
 //
 //
 import * as THREE from "three";
 import { OrbitControls } from "three/addons/controls/OrbitControls.js";
 import { fragmentShader } from "./change.js";
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

// ビデオエレメントを作成
const video = document.createElement('video');
video.src = './bk-movie.mp4'; // 動画ファイルのパスを指定
video.load();
video.autoplay = true; // 自動再生を設定
video.playsInline = true;
video.loop = true; // ループを設定
video.muted = true; // 音声をミュートに設定

video.addEventListener('canplaythrough', () => {
  video.play();
});

const videoTexture = new THREE.VideoTexture(video);

// テクスチャを読み込む
const textureLoader = new THREE.TextureLoader();
const texturePromises = [
    Promise.resolve(videoTexture), // ビデオテクスチャはすでに作成済み
    textureLoader.loadAsync('./bk1.jpg'),
    textureLoader.loadAsync('./bk2.jpg'),
    textureLoader.loadAsync('./bk3.jpg'),
    textureLoader.loadAsync('./bk4.jpg'),
    textureLoader.loadAsync('./bk5.jpg'),
    textureLoader.loadAsync('./bk6.jpg')
];

Promise.all(texturePromises).then((textures) => {
    let currentTextureIndex = 0;
 
 // シェーダーマテリアルを作成
 const shaderMaterial = new THREE.ShaderMaterial({
 
 uniforms: {
     time: { value: 1.0 },
     resolution: { value: new THREE.Vector4() },
     texture1: { value: textures[currentTextureIndex] },
     texture2: { value: textures[(currentTextureIndex +1 ) % textures.length] },
     progress: { type: "f", value: 0 },
     intensity: { type: "f", value: 0 },
     width: { type: "f", value: 0 },
     scaleX: { type: "f", value: 40 },
     scaleY: { type: "f", value: 40 },
     transition: { type: "f", value: 40 },
     radius: { type: "f", value: 0 },
     swipe: { type: "f", value: 0 },
     displacement: { type: "f", value: currentTextureIndex },
 },
 fragmentShader: fragmentShader,
 vertexShader: vertexShader,
 
 });

 const planeGeometry = new THREE.PlaneGeometry(16, 9);
 //const material = new THREE.MeshBasicMaterial(Three.material.color, Three.material.side);
 const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
 scene.add(plane);

 //ライト
 const ambientLight = new THREE.AmbientLight(Three.light.ambient); 

 // シーンに追加
 scene.add(ambientLight);
 //scene.add(directionalLight1);


 let startTime = null;
 let duration = 1.2; // アニメーションの持続時間（秒）
 // アニメーション関数を作成
 function animate(time) {
   requestAnimationFrame(animate);

   videoTexture.needsUpdate = true;

   if (startTime !== null) {
     let elapsedTime = (time - startTime) / 1000; // 経過時間（秒）
     shaderMaterial.uniforms.progress.value = Math.min(elapsedTime / duration, 1.0);
     if (elapsedTime >= duration) {
       startTime = null; // アニメーション終了
       shaderMaterial.uniforms.texture1.value = shaderMaterial.uniforms.texture2.value; // テクスチャを切り替え
       shaderMaterial.uniforms.progress.value = 0.0; // progressをリセット
       currentTextureIndex = (currentTextureIndex + 1) % textures.length; // 次のテクスチャインデックスに更新
       shaderMaterial.uniforms.texture2.value = textures[(currentTextureIndex + 1) % textures.length]; // 次のテクスチャを設定
     }
   }
 
   shaderMaterial.uniforms.time.value += 0.05;
   
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

 // Intersection Observerを設定
 const targetElements = [
   //document.querySelector('.target-element0'),
   document.querySelector('.target-element1'),
   document.querySelector('.target-element2'),
   document.querySelector('.target-element3'),
   document.querySelector('.target-element4'),
   document.querySelector('.target-element5'),
   document.querySelector('.target-element6')
 ];

 const observerOptions = {
  root: null, // ビューポートをルートに設定
  rootMargin: '0px', // マージンを設定
  threshold: 0.5 // 50% 以上表示された場合に交差を検出
};

 const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
         if (entry.isIntersecting) {
             const className = entry.target.className; // ターゲット要素のクラス名を取得
             const index = targetElements.findIndex(element => element.className === className); // クラス名に基づいてインデックスを取得
             if (index !== -1) {
                 currentTextureIndex = index + 1; // インデックスに基づいてテクスチャインデックスを更新
                 shaderMaterial.uniforms.texture2.value = textures[currentTextureIndex]; // 対応する画像を設定
                 startTime = performance.now(); // アニメーションを開始
             }
         } else {
             const className = entry.target.className; // ターゲット要素のクラス名を取得
             const index = targetElements.findIndex(element => element.className === className); // クラス名に基づいてインデックスを取得
             if (index !== -1 && currentTextureIndex > index) {
                 currentTextureIndex = index; // インデックスに基づいてテクスチャインデックスを更新
                 shaderMaterial.uniforms.texture2.value = textures[currentTextureIndex]; // 対応する画像を設定
                 startTime = performance.now(); // アニメーションを開始
             }
         }
     });
 }, observerOptions);

 
 // すべての要素に対してobserveを呼び出す
 targetElements.forEach(element => {
     observer.observe(element);
 });
 
 window.addEventListener('message', (event) => {
    const scrollPosition = event.data;
    window.scrollTo(0, scrollPosition);
});

});
