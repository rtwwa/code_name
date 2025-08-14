import { COLORS } from "../../config";
import { initAttachAbility } from "./abilities/attach";
import { initDashAbility } from "./abilities/dash";
import { initHookAbility } from "./abilities/hook";
import { createFootstepEmitter } from "./particles";

const MAX_HEALTH = 5;
const SPEED = 250;
const HERO_COLOR = COLORS.foreground;
const DRAG = 7;

export const spawnPlayer = async (position) => {
  let frames = vec2(12, 2);

  loadSprite("hero", "./sprites/all.png", {
    sliceX: frames.x,
    sliceY: frames.y,
    anims: {
      afk: 0,
      idle: { from: 0, to: 7, loop: true },
      walk: { from: 12, to: 23, loop: true },
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

  const playerSprite = await getSprite("hero");

  console.log(playerSprite);

  const player = add([
    sprite(playerSprite),
    health(MAX_HEALTH, MAX_HEALTH),
    pos(position),
    area({
      shape: new Polygon([
        vec2(-18, 12),
        vec2(10, 12),
        vec2(10, -20),
        vec2(-18, -20),
      ]),
    }),
    body(),
    anchor(vec2(0.2, 0.5)),
    "player",
  ]);

  console.log(player.hp());

  player.use(
    shader("tint", () => ({
      r: HERO_COLOR.at(0) / 255,
      g: HERO_COLOR.at(1) / 255,
      b: HERO_COLOR.at(2) / 255,
      h: 596 + (1 - player.hp() / player.maxHP()) * 1452,
      texSize: vec2(playerSprite.tex.width, playerSprite.tex.height),
      frameOffset: vec2(
        playerSprite.frames[player.frame].x,
        playerSprite.frames[player.frame].y
      ),
      frameSize: vec2(
        playerSprite.frames[player.frame].w,
        playerSprite.frames[player.frame].h
      ),
    }))
  );

  onKeyPress("space", () => {
    player.hurt(1);
    console.log(player.maxHP(), player.hp() / player.maxHP());
  });

  // Player variables
  player.drag = DRAG;
  player.canMove = true;
  player.isMoving = false;
  player.lastDirection = vec2(1, 1);

  // Player movement
  const moveHandler = () => {
    if (!player.canMove) return;

    let dirX = 0;
    let dirY = 0;

    if (isKeyDown("left")) dirX -= 1;
    if (isKeyDown("right")) dirX += 1;
    if (isKeyDown("up")) dirY -= 1;
    if (isKeyDown("down")) dirY += 1;

    let dir = vec2(dirX, dirY);
    if (dir.len() > 0) {
      dir = dir.unit();
      player.lastDirection = dir;
      player.move(dir.x * SPEED, dir.y * SPEED);
      player.flipX = dir.x < 0;
    }
  };

  // Abilities
  const dashAbility = initDashAbility(player);
  // const attachAbility = initAttachAbility(player, JUMP_FORCE);
  // const hookAbility = initHookAbility(player);

  // Physics
  player.onUpdate(() => {
    moveHandler();

    if (
      (isKeyDown("left") ||
        isKeyDown("right") ||
        isKeyDown("up") ||
        isKeyDown("down")) &&
      player.canMove
    ) {
      player.isMoving = true;
      if (player.curAnim() == "walk") return;

      player.play("walk");
    } else {
      player.isMoving = false;
      if (player.curAnim() == "idle") return;

      player.play("afk");
    }
  });

  return player;
};
