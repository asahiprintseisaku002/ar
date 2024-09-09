export const vertexShader = `
  uniform float time;
  //uniform float waveAmplitude;
  //uniform float waveFrequency;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    // 頂点のポジションを取得
    vec3 pos = position;

    // y座標を時間とともに上昇させる
    //pos.y += time * 0.01;

    // x座標にサイン波で左右の揺れを追加
    //pos.x += sin(time * waveFrequency + position.y) * waveAmplitude;

    // 座標を投影行列で変換
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
