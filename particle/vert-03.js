export const vertexShader = `
uniform float time;
attribute float size;  // 各パーティクルのサイズを設定するための属性
varying vec2 vUv;

void main() {
  vUv = uv;

  // パーティクルの位置を取得
  vec3 pos = position;

  // y座標を時間とともに上昇させる (速度調整のための係数を追加)
  pos.y += mod(time * 2.0 + position.y, 200.0);  // 200.0の高さでループさせる

  // x座標にサイン波を使った左右揺れを追加
  pos.x += sin(time * 3.0 + position.y * 0.1) * 3.0;  // 揺れ幅と速度を調整

  // 座標をカメラ空間に変換
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // パーティクルのサイズを設定
  gl_PointSize = size;

  // 座標を投影行列で変換
  gl_Position = projectionMatrix * mvPosition;
}
`;
