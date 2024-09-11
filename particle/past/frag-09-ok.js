//fragmenShader
export const fragmentShader = `
uniform float time;
varying vec2 vUv;
varying float vAlpha;  // 頂点シェーダーからの透明度
varying float vSize;   // 頂点シェーダーからのサイズ情報
uniform vec3 color1; // 最初の色
uniform vec3 color2; // 2番目の色

void main() {

  float factor = abs(sin(time * 0.5)); 
  // 泡の形状を描画
  float dist = length(gl_PointCoord - 0.5);
  if (dist > 0.5) discard;

  // ゆるやかに消失していくアルファ値を設定
  // ここで vAlpha に対して、時間に基づいたゆるやかな減少を追加
  float smoothAlpha = pow(vAlpha, 4.0);  // vAlpha の乗算で減少カーブを滑らかに

  vec3 mixedColor = mix(color1, color2, factor);
  
  // 最終的な色の設定（透明度の減少を適用）
  gl_FragColor = vec4(mixedColor, smoothAlpha * (1.0 - dist * 2.0));  // 距離に応じて透明度も変化
}
`;