import { COLORS } from "../../config";
import { initAttachAbility } from "./abilities/attach";
import { initDashAbility } from "./abilities/dash";
import { initHookAbility } from "./abilities/hook";
import { createFootstepEmitter } from "./particles";

const JUMP_FORCE = -600;
const SPEED = 200;
const DRAG_ON_GROUND = 7;
const HERO_COLOR = COLORS.foreground;

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

  loadShader(
    "tint",
    null,
    `
    precision mediump float;

    uniform float r;
    uniform float g;
    uniform float b;

    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 c = def_frag();

        return vec4(r,g,b,c.a);
    }
    `
  );

  const player = add([
    sprite("hero"),
    pos(position),
    area(),
    body(),
    anchor("center"),
    shader("tint", () => ({
      r: HERO_COLOR.at(0) / 255,
      g: HERO_COLOR.at(1) / 255,
      b: HERO_COLOR.at(2) / 255,
    })),
    "player",
  ]);

  // Player variables
  player.lastDirection = 1;

  // Abilities
  const dashAbility = initDashAbility(player);
  const attachAbility = initAttachAbility(player, JUMP_FORCE);
  const hookAbility = initHookAbility(player);

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
    if (player.isGrounded()) {
      player.applyImpulse(vec2(0, JUMP_FORCE));
    }
  });

  // Physics
  player.onUpdate(() => {
    if (player.isGrounded()) {
      player.drag = DRAG_ON_GROUND;
    } else {
      player.drag = 0;
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

  // Particlies
  loadSprite("dust", "./sprites/dust.png").then(() => {
    const footsteps = createFootstepEmitter(player);
  });

  return player;
};
