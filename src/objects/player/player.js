import { createSwingRope } from "../rope";
import { createHook } from "./abilities/hook";
import { createFootstepEmitter } from "./particles";

const IMPULSE_FORCE = 500;
const JUMP_FORCE = -600;
const SPEED = 200;
const DRAG_ON_GROUND = 7;

export const spawnPlayer = (position) => {
  loadSprite("hero", "./sprites/all.png", {
    sliceX: 8,
    sliceY: 2,
    anims: {
      afk: 0,
      idle: { from: 0, to: 7, loop: true },
      walk: { from: 8, to: 14, loop: true },
    },
  });

  const player = add([
    sprite("hero"),
    pos(position),
    area(),
    body(),
    anchor("center"),
    color(0, 0, 0),
    "player",
  ]);

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
    dash();
  });

  // Physics
  player.onUpdate(() => {
    if (hook.isHooded) {
      console.log("hello");
    }

    if (player.isGrounded()) {
      player.drag = DRAG_ON_GROUND;
    } else {
      player.drag = 0;
    }

    if (isAttached && attachedPos) {
      player.pos = attachedPos.clone();
      player.vel = vec2(0, 0);
    }

    if (player.isGrounded()) {
      if (isKeyDown("left") || isKeyDown("right")) {
        if (player.curAnim() == "walk") return;

        player.play("walk");
      } else {
        if (player.curAnim() == "idle") return;

        player.play("idle");
      }
    } else {
      player.play("afk");
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

  const hook = createHook(player);
  console.log(hook);

  loadSprite("dust", "./sprites/dust.png").then(() => {
    const footsteps = createFootstepEmitter(player);
  });

  function dash() {
    player.applyImpulse(vec2(IMPULSE_FORCE * player.lastDirection, 0));
  }

  return player;
};
