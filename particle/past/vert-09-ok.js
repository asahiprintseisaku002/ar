export const vertexShader = `
uniform float time;
uniform vec2 mouse;  // カーソルの2D位置（スクリーン座標系）
attribute float size;  // 各パーティクルの初期サイズ
attribute float speed; // 各パーティクルの上昇速度
varying float vAlpha;  // 透明度をフラグメントシェーダーに渡すための変数
varying vec2 vUv;
varying float vSize;   // サイズをフラグメントシェーダーに渡す

void main() {
  vUv = uv;

  // パーティクルの位置を取得
  vec3 pos = position;

  // カーソルの3D位置（Z座標は0と仮定）
  vec3 mouse3D = vec3(mouse.x, mouse.y, 0.0);  // カーソルの位置を2Dから3Dに変換

  // カーソルの位置に向かう方向を計算
  vec3 direction = normalize(mouse3D - pos);  // カーソルに向かう方向を取得

  // 引き寄せるスピードを設定
  float attractionStrength = 30.0;  // 強制的にカーソルに集める速度
  pos += direction * attractionStrength;  // パーティクルをカーソルに向かって移動させる

  //ランダムな速度に基づいて y 座標を時間とともに上昇させる
  //pos.y += mod(time * speed + position.y, 200.0);  // speedを使用して個別に速度を変更
  pos.y += time * speed + position.y;
  // x座標にサイン波を使った左右揺れを追加
  pos.x += sin(time * 2.0 + position.y * 0.1) * 1.2;

  // パーティクルが時間とともに大きくなる（サイズは5.0までに制限）
  float age = mod(time + position.y, 6.0);  // 出現からの時間 (0〜5の範囲でループ)
  vSize = size * (age / 5.0);  // サイズが徐々に大きくなる
  gl_PointSize = min(vSize, 50.0);  // 最大サイズは5に制限

  // 時間経過とともに透明度が減少する（5秒で完全に消える）
  vAlpha = 1.0 - (age / 10.0);

  // カメラ空間に変換
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`;
