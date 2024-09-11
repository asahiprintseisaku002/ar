//fragmenShader
export const fragmentShader = `
uniform float time;
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);  // カラフルに変化させる
}
`;