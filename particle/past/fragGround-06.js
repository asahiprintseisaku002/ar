//fragmenShader
export const fragmentShader2 = `
uniform vec3 lightDirection;  // ライトの方向
varying vec3 vNormal;  // 頂点シェーダーから受け取る法線ベクトル
varying vec3 vPosition;  // 頂点シェーダーから受け取る頂点位置

void main() {
  // 法線ベクトルを正規化
  vec3 normal = normalize(vNormal);

  // ライトの方向を正規化
  vec3 lightDir = normalize(lightDirection);

  // ライティング計算 (拡散光)
  float diff = max(dot(normal, lightDir), 0.0);  // 拡散反射の強さ

  // アンビエントライト（基本の光）
  float ambient = 0.1;

  // 基本色
  vec3 baseColor = vec3(0.23, 0.81, 1.0);

  // 拡散光とアンビエント光を合成して最終色を計算
  vec3 finalColor = baseColor * (diff + ambient);

  gl_FragColor = vec4(finalColor, 1.0);  // 最終的な色を出力
}
`;