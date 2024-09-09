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

  // カーソルの影響範囲を計算 (半径250px、z方向も含む距離)
  vec3 mouse3D = vec3(mouse.x, mouse.y, 0.0);// カーソル位置の Z 座標を 0 として 2Dに変換
  float distance = length(pos - mouse3D);  // パーティクルとカーソルの3D距離を計算
  float avoidRadius = 50.0;  // カーソルの影響範囲（半径）

  if (distance < avoidRadius) {
    // 距離が近い場合、パーティクルをカーソルから押し出す（円形に押し出す）
    vec3 direction = normalize(pos - mouse3D);  // カーソルとパーティクルの方向を計算
    float strength = (avoidRadius - distance) / avoidRadius;  // 距離に応じて押し出す強さを調整
    pos += direction * strength * 80.0;  // パーティクルを外側に押し出す
  }

  //ランダムな速度に基づいて y 座標を時間とともに上昇させる
  pos.y += mod(time * speed + position.y, 200.0);  // speedを使用して個別に速度を変更

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
