export function initAttachAbility(player, jumpForce) {
  const ATTACH_DISTANCE = 32;
  let hasAttached = false;
  let isAttached = false;
  let attachedPos = null;

  const getAttachPoint = () => {
    let direction = vec2(player.lastDirection, 0);

    const hit = raycast(player.pos, direction.scale(ATTACH_DISTANCE), [
      "player",
    ]);

    // DEBUG HERE, idgaf, i dont wanna make it clear, soooo some comments here hehehe
    // const draw = () => {
    //   const endPos = player.pos.add(direction.scale(ATTACH_DISTANCE));

    //   drawLine({
    //     p1: player.pos,
    //     p2: endPos,
    //     width: 2,
    //     color: BLUE,
    //   });
    // };

    // onDraw(() => {
    //   draw();
    // });

    if (hit) {
      return hit.point;
    }
    return null;
  };

  const attachToWall = (point) => {
    isAttached = true;
    hasAttached = true;
    attachedPos = point.clone();

    player.vel = vec2(0, 0);
    player.gravity = 0;
    shake(5);
  };

  const disattachWall = () => {
    if (isAttached) {
      isAttached = false;
      attachedPos = null;
      player.gravity = 1;

      shake(1);
      player.vel = vec2(player.vel.x, -5);
    }
  };

  onKeyPress("down", () => {
    disattachWall();
  });

  onKeyPress("up", () => {
    if (isAttached) {
      disattachWall();
      player.applyImpulse(vec2(0, jumpForce));
    }
  });

  player.onUpdate(() => {
    if (player.isGrounded()) {
      hasAttached = false;
    }

    if (isAttached && attachedPos) {
      player.pos = attachedPos.clone();
      player.vel = vec2(0, 0);
      return;
    }

    if (
      !isAttached &&
      !hasAttached &&
      !player.isGrounded() &&
      Math.abs(player.vel.x) > 2
    ) {
      const point = getAttachPoint();
      if (point) {
        attachToWall(point);
      }
    }
  });
}
