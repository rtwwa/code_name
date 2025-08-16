export function initShaders() {
  loadSprite("axe", "./sprites/axe.png");
  loadSprite("hook", "./sprites/hook.png");

  loadShader(
    "playerShader",
    null,
    `
  precision mediump float;

  uniform float r;
  uniform float g;
  uniform float b;
  uniform float h;
  uniform vec2 texSize;
  uniform vec2 frameOffset;
  uniform vec2 frameSize;

  vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
      vec4 c = texture2D(tex, uv);

      if (c.a < 0.01) {
          return c;
      }

      vec2 offsetX = vec2(1.0 / texSize.x, 0.0);
      vec2 offsetY = vec2(0.0, 1.0 / texSize.y);

      float alphaUp    = texture2D(tex, uv + offsetY).a;
      float alphaDown  = texture2D(tex, uv - offsetY).a;
      float alphaLeft  = texture2D(tex, uv - offsetX).a;
      float alphaRight = texture2D(tex, uv + offsetX).a;

      if (alphaUp < 0.01 || alphaDown < 0.01 || alphaLeft < 0.01 || alphaRight < 0.01) {
          return vec4(r, g, b, c.a);
      }

      vec2 pixelCoord = uv * texSize;
      vec2 localPixel = pixelCoord - (frameOffset * texSize);
      vec2 localUV = localPixel / frameSize; // 0..1 по фрейму

      if (localUV.y <= h) {
          return vec4(1.0, 0.0, 0.0, 0.0);
      }

      return vec4(r, g, b, c.a);
      }
      `
  );

  loadShader(
    "cooldown",
    null,
    `
  precision mediump float;

    uniform float r;
  uniform float g;
  uniform float b;
  uniform float h;
  uniform vec2 texSize;

  vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
      vec4 c = texture2D(tex, uv);

      if (c.a < 0.01) {
          return c;
      }

      vec2 offsetX = vec2(1.0 / texSize.x, 0.0);
      vec2 offsetY = vec2(0.0, 1.0 / texSize.y);

      float alphaUp    = texture2D(tex, uv + offsetY).a;
      float alphaDown  = texture2D(tex, uv - offsetY).a;
      float alphaLeft  = texture2D(tex, uv - offsetX).a;
      float alphaRight = texture2D(tex, uv + offsetX).a;

      if (alphaUp < 0.01 || alphaDown < 0.01 || alphaLeft < 0.01 || alphaRight < 0.01) {
          return vec4(r, g, b, c.a);
      }

      vec2 pixelCoord = uv * texSize;

      if (pixelCoord.y <= h) {
          return vec4(c.r, c.g, c.b, 0.0);
      }

      return vec4(r, g, b, c.a);
      }
      `
  );

  loadShader(
    "newTint",
    null,
    `
    precision mediump float;

    uniform float r;
    uniform float g;
    uniform float b;

    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
      vec4 c = def_frag();

      return vec4(r, g, b, c.a);
    }
    `
  );

  loadShader(
    "hollow",
    null,
    `
  precision mediump float;

  uniform float r;
  uniform float g;
  uniform float b;
  uniform vec2 texSize;

  vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec4 c = texture2D(tex, uv);

    if (c.a < 0.1) {
        return c;
    }

    vec2 offsetX = vec2(1.0 / texSize.x, 0.0);
    vec2 offsetY = vec2(0.0, 1.0 / texSize.y);

    float alphaUp    = texture2D(tex, uv + offsetY).a;
    float alphaDown  = texture2D(tex, uv - offsetY).a;
    float alphaLeft  = texture2D(tex, uv - offsetX).a;
    float alphaRight = texture2D(tex, uv + offsetX).a;

    if (alphaUp < 0.01 || alphaDown < 0.01 || alphaLeft < 0.01 || alphaRight < 0.01) {
        return vec4(r, g, b, c.a);
    }

    return vec4(0,0,0,0);
  }
  `
  );
}
