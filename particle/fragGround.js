//fragmenShader
export const fragmentShader2 = `
uniform vec3 lightDirection;  // ライトの方向
varying vec3 vNormal;  // 頂点シェーダーから受け取る法線ベクトル
varying vec3 vPosition;  // 頂点シェーダーから受け取る頂点位置

void main() {
  // 法線ベクトルを正規化
  vec3 normal = normalize(vNormal);

  //vec3 normalColor = normal * 0.5 + 0.5; 

  // ライトの方向を正規化
  vec3 lightDir = normalize(lightDirection);

  //vec3 lightDirColor = lightDir * 0.5 + 0.5;

  // ライティング計算 (拡散光)
  float diff = max(dot(normal, lightDir), 0.0);  // 拡散反射の強さ

  // アンビエントライト（基本の光）
  float ambient = 0.1;

  // 基本色
  vec3 baseColor = vec3(0.23, 0.81, 1.0);

  // 拡散光とアンビエント光を合成して最終色を計算
  //vec3 finalColor = baseColor * (diff + ambient);
  //vec3 r = vec3(1.0, 0.0, 0.0);
  //vec3 g = vec3(0.0, 1.0, 0.0);
  //vec3 b = vec3(0.0, 0.0, 1.0);

  //vec3 finalColor = normalColor * (diff + ambient);
  
  vec3 finalColor = baseColor * diff + baseColor * ambient;
  gl_FragColor = vec4(finalColor, 1.0);  // 最終的な色を出力
}
`;