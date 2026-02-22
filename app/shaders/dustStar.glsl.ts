export const STAR_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uDriftIntensity;
  uniform float uTwinkleSpeed;
  uniform float uTwinkleSharpness;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aBrightness;

  varying float vAlpha;

  void main() {
    float s = aSpeed;
    float o = aOffset;

    // GPU Drift
    vec3 updatedPosition = position;
    updatedPosition.x += sin(uTime * s * 0.5 + o) * uDriftIntensity;
    updatedPosition.y += cos(uTime * s * 0.5 + o) * uDriftIntensity;

    // GPU Twinkle
    float sineWave = sin(uTime * (s * uTwinkleSpeed) + o);
    float sparkle = pow(sineWave * 0.5 + 0.5, uTwinkleSharpness); // Normalize to 0-1 range before pow
    vAlpha = aBrightness * sparkle;

    vec4 mvPosition = modelViewMatrix * vec4(updatedPosition, 1.0);
    // Reduced the perspective factor from 300 to 150 for more subtle sizing
    gl_PointSize = aSize * (0.5 + sparkle * 0.5) * (150.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const STAR_FRAGMENT_SHADER = `
  uniform sampler2D pointTexture;
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec4 tex = texture2D(pointTexture, gl_PointCoord);
    // Lenis-style refinement: multiply by alpha and ensure soft edges
    gl_FragColor = vec4(uColor, vAlpha * tex.a);
  }
`;
