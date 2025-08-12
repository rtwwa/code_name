import { createSwingRope } from "../objects/rope";

const IMPULSE_FORCE = 500;
const JUMP_FORCE = -600;
const SPEED = 200;
const DRAG_ON_GROUND = 7;

const HOOK_IMPULSE = 400;
const HOOK_LEN = 120;

export const spawnPlayer = (position) => {
  loadSprite("hero_afk", "./sprites/hero-afk.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
      afk: 0,
      idle: { from: 0, to: 7, loop: true },
    },
  });

  const player = add([
    sprite("hero_afk"),
    pos(position),
    area(),
    body(),
    anchor("center"),
    color(0, 0, 0),
    "player",
  ]);

  player.play("idle");

  // Player variables
  player.lastDirection = 1;
  let isAttached = false;
  let attachedPos = null;

  // Player movement
  onKeyDown("left", () => {
    player.flipX = true;
    player.move(-SPEED, 0);
    player.lastDirection = -1;
  });

  onKeyDown("right", () => {
    player.flipX = false;
    player.move(SPEED, 0);
    player.lastDirection = 1;
  });

  onKeyPress("up", () => {
    if (player.isGrounded() || isAttached) {
      disattachWall();
      player.applyImpulse(vec2(0, JUMP_FORCE));
    }
  });

  onKeyPress("x", () => {
    player.applyImpulse(vec2(IMPULSE_FORCE * player.lastDirection, 0));
  });

  // Physics
  player.onUpdate(() => {
    if (player.isGrounded()) {
      player.drag = DRAG_ON_GROUND;
    } else {
      player.drag = 0;
    }

    if (isAttached && attachedPos) {
      player.pos = attachedPos.clone();
      player.vel = vec2(0, 0);
    }
  });

  player.onCollide("solid", (collision) => {
    if (!isAttached && Math.abs(player.vel.x) > 2 && !player.isGrounded()) {
      isAttached = true;
      attachedPos = player.pos;

      player.vel = vec2(0, 0);

      player.gravity = 0;

      shake(5);
    }
  });

  // Отцепиться по нажатию вниз (или другой кнопки)
  onKeyPress("down", () => {
    disattachWall();
  });

  function disattachWall() {
    if (isAttached) {
      isAttached = false;
      attachedPos = null;
      player.gravity = 1;

      shake(1);
      player.vel = vec2(player.vel.x, -5);
    }
  }

  function hook() {
    let updateRope = false;
    const rope = createSwingRope(vec2(0, 0), HOOK_LEN);
    rope.attach(player);

    onKeyPress("z", () => {
      if (updateRope == false) {
        const hit = getNewHookPoint();
        if (hit == null) {
          return;
        }

        rope.setAnchor(hit);

        const hook_len = hit.sub(player.pos).len();
        if (hook_len < HOOK_LEN) {
          rope.setRadius(hook_len);
        } else {
          rope.setRadius(HOOK_LEN);
        }

        updateRope = true;
        return;
      }

      updateRope = false;
      let newDir = Vec2.fromAngle(-45).scale(HOOK_IMPULSE);
      newDir.x = newDir.x * player.lastDirection;
      player.applyImpulse(newDir);
      return;
    });

    onUpdate(() => {
      if (updateRope) {
        rope.update(dt);
      }
    });

    onDraw(() => {
      if (updateRope) {
        rope.draw();
      }
    });
  }

  const getNewHookPoint = () => {
    let direction = Vec2.fromAngle(-45);
    player.lastDirection > 0
      ? (direction.x = direction.x)
      : (direction.x = -direction.x);
    let hit = raycast(player.pos, direction.scale(HOOK_LEN), ["player"]);

    if (hit) {
      return hit.point;
    }

    return null;
  };

  hook();

  return player;
};
