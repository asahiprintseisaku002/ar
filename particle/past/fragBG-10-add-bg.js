//fragmenShader
export const fragBG = `
uniform float time;
uniform vec3 color1;  // 最初の色
uniform vec3 color2;  // 2番目の色
uniform vec3 color3;  // 3番目の色

void main() {
    // 0〜1の範囲で時間のサイクルを作成（ループ）
    float cycle = mod(time * 0.1, 1.0);  // 時間に基づいてループするサイクルを作成

    // 3つの色の遷移を決定（color1 -> color2 -> color3 -> color1 の順に遷移）
    vec3 mixedColor;
    if (cycle < 0.333) {
        // color1からcolor2への遷移
        float factor = cycle / 0.333;  // 0〜0.333の間でcolor1からcolor2に遷移
        mixedColor = mix(color1, color2, factor);
    } else if (cycle < 0.666) {
        // color2からcolor3への遷移
        float factor = (cycle - 0.333) / 0.333;  // 0.333〜0.666の間でcolor2からcolor3に遷移
        mixedColor = mix(color2, color3, factor);
    } else {
        // color3からcolor1への遷移
        float factor = (cycle - 0.666) / 0.333;  // 0.666〜1.0の間でcolor3からcolor1に遷移
        mixedColor = mix(color3, color1, factor);
    }

    // 最終的な色を設定
    gl_FragColor = vec4(mixedColor, 1.0);  // 背景なので不透明
}

`;