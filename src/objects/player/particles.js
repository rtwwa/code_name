export function createFootstepEmitter(player) {
  const dustSprite = getSprite("dust");
  const dustTexture = dustSprite.data.tex;
  const dustFrame = dustSprite.data.frames[0];

  const emitter = add([
    pos(),
    particles(
      {
        max: 50,
        lifeTime: [0.5, 5],
        speed: [10, 5],
        texture: dustTexture,
        quads: [dustFrame],
      },
      {
        direction: 90,
        spread: 20,
      }
    ),
  ]);

  return emitter;
}
