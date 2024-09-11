//fragmenShader
export const fragBG = `
// シンプルノイズ用のユーティリティ関数
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx);
  
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - 1.0 + vec3(C.x, C.x, C.x);  // 修正箇所: zzzの代わりにvec3(C.x, C.x, C.x)

  i = mod289(i);
  vec4 p = permute(permute(permute( 
           i.z + vec4(0.0, i1.z, i2.z, 1.0)) 
         + i.y + vec4(0.0, i1.y, i2.y, 1.0)) 
         + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));  
  vec4 x_ = floor(j * (1.0 / 7.0));
  vec4 y_ = floor(j - 7.0 * x_ );    
  vec4 x = x_ * (1.0 / 7.0);
  vec4 y = y_ * (1.0 / 7.0);
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 g0 = vec3(a0.xy,h.x);
  vec3 g1 = vec3(a0.zw,h.y);
  vec3 g2 = vec3(a1.xy,h.z);
  vec3 g3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g0,g0), dot(g1,g1), dot(g2,g2), dot(g3,g3)));
  g0 *= norm.x;
  g1 *= norm.y;
  g2 *= norm.z;
  g3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m, vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3)));
}

// シェーダーに使用する時間と色の定義
uniform float time;
uniform vec3 color1;  // 最初の色
uniform vec3 color2;  // 2番目の色
uniform vec3 color3;  // 3番目の色

void main() {
    // 0〜1の範囲で時間のサイクルを作成（ループ）
    float cycle = mod(time * 0.1, 1.0);  // 時間に基づいてループするサイクルを作成

    // シンプルノイズを使用
    vec2 uv = gl_FragCoord.xy / 1000.0;  // UV座標を生成
    float noiseValue = snoise(vec3(uv * 5.0, time * 0.1));  // 時間でアニメーション

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

    // シンプルノイズの値を色に反映させる
    mixedColor += vec3(noiseValue * 0.2);  // ノイズによる揺らぎを加える

    // 最終的な色を設定
    gl_FragColor = vec4(mixedColor, 1.0);  // 背景なので不透明
}

`;