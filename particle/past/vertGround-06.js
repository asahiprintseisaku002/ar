export const vertexShader2 = `
// 頂点シェーダー
uniform float time;  // 時間の経過を表す uniform 変数
varying vec3 vNormal;  // 法線ベクトルをフラグメントシェーダーに渡すための変数
varying vec3 vPosition;  // 頂点位置をフラグメントシェーダーに渡す

// ノイズ関数をインポート
vec3 permute(vec3 x) {
  return mod(((x*34.0)+1.0)*x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0); 
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // 頂点の初期位置を取得
  vec3 pos = position;

  // 波の動きにノイズを追加
  float noise = snoise(pos.xz * 0.003 + time * 0.001);  // ノイズのスケールと時間依存
  pos.y += noise * 30.0;  // ノイズの振幅を調整

  // 波の動きを追加
  pos.y += sin(pos.x * 2.0 + time) * 0.1;
  pos.y += cos(pos.z * 10.0 + time) * 12.0;

  // モデルビュー行列を使って法線を変換
  vNormal = normalize(normalMatrix * normal);  // 法線ベクトルを変換してフラグメントシェーダーへ

  // 頂点の位置をフラグメントシェーダーに渡す
  vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;

  // 頂点の位置を設定
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;
