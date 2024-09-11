//fragmenShader
export const fragBG = `
// シェーダーに使用する時間と色の定義
uniform float time;
uniform vec3 color1;  // 最初の色
uniform vec3 color2;  // 2番目の色
uniform vec3 color3;  // 3番目の色
uniform vec2 resolution;  // 画面の解像度

void main() {
    // UV座標の取得
    vec2 uv = gl_FragCoord.xy / resolution;

    // 画面の中心からの距離を計算
    vec2 center = vec2(0.25, 0.6);
    float dist = distance(uv, center);

    // 波紋の周期を設定し、時間によるサイクルを作成
    float cycle = mod(dist * 0.4 - time * 0.8, 1.0);  // 波紋のサイクルと速度を調整

    // 中心から外に向かって色を変化させる
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

    // ビネット効果を調整して暗くなりすぎないようにする
    //float vignette = smoothstep(0.8, 0.3, dist);  // 中心から遠くなるにつれて色を徐々に変化

    // 最終的な色にビネット効果を適用
    gl_FragColor = vec4(mixedColor, 1.0);   // 0.3でベースの明るさを追加
}
`;