 //
 //
 //
 //
 //
    import * as THREE from "three";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";
    //import { FontLoader } from "three/addons/loaders/FontLoader.js";
    //import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
    import { TransformControls } from 'three/addons/controls/TransformControls.js';
    import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

    class Three {
        static width = window.innerWidth;
        static height = window.innerHeight;
        static canvasId = '#myCanvas';
        static camera = {
          fov: 45,
          aspect: window.innerWidth / window.innerHeight,
          position: { x: 0, y: 10, z: 0 }
        };
        static light = {
          ambient: 0xffffff,
          // directional: 0xffffff,
          // directionalPosition: { x: 1, y: 1, z: 1 }
        };
        static material = {
          color: 0xf8f8f8
        };

    }

    
    // レンダラーを作成
    const canvasElement = document.querySelector(Three.canvasId);
    const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement, 
    alpha: false
    });
    renderer.setSize(Three.width, Three.height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(Three.camera.fov, Three.camera.aspect);
    // カメラの初期座標を設定
    camera.position.set(Three.camera.position.x, Three.camera.position.y, Three.camera.position.z);

    // カメラコントローラーを作成
    const controls = new OrbitControls(camera, canvasElement);

    // 画像を読み込む
    const loadPic = new THREE.TextureLoader();
    //レイキャスター 
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const mouse = new THREE.Vector2();

    function handleMouseMove(event) {
    const element = event.currentTarget;
    // canvas要素上のXY座標
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;
    // canvas要素の幅・高さ
    const w = element.offsetWidth;
    const h = element.offsetHeight;

    // -1〜+1の範囲で現在のマウス座標を登録する
    mouse.x = ( x / w ) * 2 - 1;
    mouse.y = -( y / h ) * 2 + 1;
    }

      //ライト
    const ambientLight = new THREE.AmbientLight(Three.light.ambient); 
    //const directionalLight1 = new THREE.DirectionalLight(0xffffff);
    //directionalLight1.position.set(1, 1, 1);

    // シーンに追加
    scene.add(ambientLight);
    //scene.add(directionalLight1);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./bk.glb');
    const model = gltf.scene;
    scene.add(model);
    modelGroup.add(model);
  
    const mixer = new THREE.AnimationMixer(model);
    // モデルに含まれるアニメーションクリップを取得
    const clips = gltf.animations;
    const action = mixer.clipAction(clips[0]); // 最初のアニメーションクリップを使用

    // アニメーションのループを無効にし、終了後に停止するように設定
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;

    const clock = new THREE.Clock;
    // 初期カメラ位置を設定
    //const initialCameraPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };

    action.play();

    // マウスの移動を監視するイベントリスナーを追加
    window.addEventListener('mousemove', onMouseMove, false);

    function onMouseMove(event) {
        // マウスのx座標を正規化
        const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;

        // 符号を無視して絶対値を取得
        const absNormalizedX = Math.abs(normalizedX);

        // 0.3から0.8の範囲に入っているかチェック
        if (absNormalizedX >= 0.2 && absNormalizedX <= 0.5) {
            // アニメーションの進行度を計算
            const progress = (absNormalizedX - 0.2) / (0.5 - 0.2);
            //model.rotation.z = progress * Math.PI ;           
            // アニメーションの進行度に応じてアニメーションを設定
            action.time = progress * action.getClip().duration;
            action.paused = true;
        } else {
            action.paused = true;
          
        }
    }

    
        // アニメーション関数を作成
    function animate() {
      requestAnimationFrame(animate);

      // アニメーションミキサーを更新
      const delta = clock.getDelta();
      mixer.update(delta);
      
      // 球体を回転させる
      //modelGroup.rotation.z += 0.01;
      
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