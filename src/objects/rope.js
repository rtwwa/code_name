export function createSwingRope(anchor, radius) {
  let angle = Math.PI / 2; // 90° вниз
  let angularVelocity = 0;
  const gravity = 0.5; // сила притяжения (можно тюнить)
  const damping = 0.995; // трение

  let player = null;
  let hasBounce = false;

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
    if (!hasBounce) {
      angularVelocity = -angularVelocity * 1.5;
      hasBounce = true;
    }

    angularVelocity = -angularVelocity * 0.8;
  });

  function update(dt) {
    if (!player) return;

    const frameFactor = dt() * 60;

    angularVelocity += gravity * Math.cos(angle) * frameFactor;
    angularVelocity *= Math.pow(damping, frameFactor);
    angle += angularVelocity * frameFactor;

    const dx = player.pos.x - anchor.x;
    const dy = player.pos.y - anchor.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist !== radius) {
      const nx = dx / dist;
      const ny = dy / dist;

      player.pos.x = anchor.x + nx * radius;
      player.pos.y = anchor.y + ny * radius;

      const radialVel = player.vel.x * nx + player.vel.y * ny;
      player.vel.x -= radialVel * nx;
      player.vel.y -= radialVel * ny;
    }
  }

  function drawRope() {
    if (!player) return;

    drawLine({
      p1: anchor,
      p2: player.pos,
      width: 2,
      color: [0, 0, 0],
    });

    const dir = player.vel.unit().scale(40);
    const endPos = player.pos.add(dir);

    drawLine({
      p1: player.pos,
      p2: endPos,
      width: 2,
      color: BLUE,
    });
  }

  function setAnchor(newAnchor) {
    anchor = newAnchor;
    if (player) {
      const dx = player.pos.x - anchor.x;
      const dy = player.pos.y - anchor.y;
      angle = Math.atan2(dy, dx);
      angularVelocity = 0;
      hasBounce = false;
    }
  }

  function setRadius(newRadius) {
    radius = newRadius;
    if (player) {
      const dx = player.pos.x - anchor.x;
      const dy = player.pos.y - anchor.y;
      angle = Math.atan2(dy, dx);

      player.pos.x = anchor.x + Math.cos(angle) * radius;
      player.pos.y = anchor.y + Math.sin(angle) * radius;

      const nx = Math.cos(angle);
      const ny = Math.sin(angle);
      const radialVel = player.vel.x * nx + player.vel.y * ny;
      player.vel.x -= radialVel * nx;
      player.vel.y -= radialVel * ny;
    }
  }

  return {
    attach,
    applyImpulse,
    update,
    setAnchor,
    setRadius,
    draw: drawRope,
  };
}
