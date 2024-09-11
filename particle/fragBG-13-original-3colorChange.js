//fragmenShader
export const fragBG = `
// シェーダーに使用する時間と色の定義
uniform float time;
uniform vec3 color1;  // 最初の色
uniform vec3 color2;  // 2番目の色
uniform vec3 color3;  // 3番目の色

void main() {
    // 0〜1の範囲で時間のサイクルを作成（ループ）
    float cycle = mod(time * 0.1, 1.0);  // 時間に基づいてループするサイクルを作成

    // ノイズを使用して色を変化させる
    vec3 mixedColor;
    if (cycle < 0.333) {
        float factor = cycle / 0.333;
        mixedColor = mix(color1, color2, factor);
    } else if (cycle < 0.666) {
        float factor = (cycle - 0.333) / 0.333;
        mixedColor = mix(color2, color3, factor);
    } else {
        float factor = (cycle - 0.666) / 0.333;
        mixedColor = mix(color3, color1, factor);
    }

    // 最終的な色を設定
    gl_FragColor = vec4(mixedColor, 1.0);  // 背景なので不透明
}
`;