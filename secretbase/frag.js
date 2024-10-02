//fragmentShader
export const fragmentShader = `
  uniform sampler2D videoTexture1;
  uniform sampler2D videoTexture2;
  uniform float time;
  varying vec2 vUv;

  void main() {
    // ラインの数と各ラインの高さ
    float lineCount = 10.0;
    float lineHeight = 1.0 / lineCount;

    // 現在のピクセルのライン番号を取得
    float lineIndex = floor(vUv.y * lineCount);

    // 各ラインのX座標を時間に基づいて動かす（左から右へ流す）
    float scrollSpeed = 0.5;
    float offsetX = mod(vUv.x + time * scrollSpeed - lineIndex * 0.1, 1.0);  // スクロール効果

    // 2つの動画間の切り替え
    vec2 uv = vec2(offsetX, vUv.y);

    // 動画1と動画2のテクスチャを取得
    vec4 color1 = texture2D(videoTexture1, uv);
    vec4 color2 = texture2D(videoTexture2, uv);

    // ラインのインデックスに基づいて動画を切り替える
    float mixFactor = step(mod(lineIndex + time * 0.2, 2.0), 1.0);

    // 2つの動画を混ぜ合わせてラインごとに切り替える
    vec4 finalColor = mix(color1, color2, mixFactor);

    gl_FragColor = finalColor;
  }
`;