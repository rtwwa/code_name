export function createSwingRope(anchor, radius) {
  let angle = Math.PI / 2; // 90° вниз
  let angularVelocity = 0;
  const gravity = 0.007; // сила притяжения (можно тюнить)
  const damping = 0.995; // трение

  let player = null;

  function attach(entity) {
    player = entity;
    const dx = player.pos.x - anchor.x;
    const dy = player.pos.y - anchor.y;
    angle = Math.atan2(dy, dx);
    angularVelocity = 0;
  }

  function applyImpulse(force) {
    angularVelocity += force;
  }

  onCollide("player", "solid", () => {
    angularVelocity = -angularVelocity * 2;
  });

  function update(dt) {
    if (!player) return;

    const frameFactor = dt() * 60;

    angularVelocity += gravity * Math.cos(angle) * frameFactor;
    angularVelocity *= Math.pow(damping, frameFactor);
    angle += angularVelocity * frameFactor;

    player.pos.x = anchor.x + radius * Math.cos(angle);
    player.pos.y = anchor.y + radius * Math.sin(angle);

    player.vel.x = -radius * angularVelocity * Math.sin(angle) * frameFactor;
    player.vel.y = radius * angularVelocity * Math.cos(angle) * frameFactor;
  }

  function drawRope() {
    if (!player) return;
    drawLine({
      p1: anchor,
      p2: player.pos,
      width: 2,
      color: [0, 0, 0],
    });
  }

  function setAnchor(newAnchor) {
    anchor = newAnchor;
    if (player) {
      const dx = player.pos.x - anchor.x;
      const dy = player.pos.y - anchor.y;
      angle = Math.atan2(dy, dx);
      angularVelocity = 0;
    }
  }

  return {
    attach,
    applyImpulse,
    update,
    setAnchor,
    draw: drawRope,
  };
}
