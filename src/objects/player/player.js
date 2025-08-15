import App from "../../app";
import { COLORS, DEF_COLORS, setForegroundColor } from "../../config";
import { initAttackAbility } from "./abilities/attack";
import { initHookAbility } from "./abilities/hook";
import { createFootstepEmitter } from "./particles";

const MAX_HEALTH = 5;
const SPEED = 300;
const INV_AFTER_HURT = 0.3;

export const spawnPlayer = async (position) => {
  let frames = vec2(8, 3);
  let canTakeDamage = true;

  loadSprite("hero", "./sprites/all.png", {
    sliceX: frames.x,
    sliceY: frames.y,
    anims: {
      afk: 0,
      idle: { from: 0, to: 7, loop: true },
      walk: { from: 8, to: 14, loop: true },
    },
  });

  const playerSprite = await getSprite("hero");

  const player = add([
    sprite(playerSprite),
    health(MAX_HEALTH, MAX_HEALTH),
    pos(position),
    color(COLORS.foreground),
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
    timer(),
    {
      maxHeath: MAX_HEALTH,
      health: MAX_HEALTH,
      speed: SPEED,
      invAfterHurt: INV_AFTER_HURT,
    },
    "player",
  ]);

  player.use(
    shader("playerShader", () => ({
      r: player.color.r / 255,
      g: player.color.g / 255,
      b: player.color.b / 255,
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

  // TODO: for testing, delete it later
  onKeyPress("space", () => {
    let allBullet = get("bullet");

    allBullet.map((obj) => {
      obj.radius = obj.radius * 3;
    });
  });

  // Player variables
  player.canMove = true;
  player.isMoving = false;

  // Player movement
  const keyMap = {
    KeyW: "up",
    KeyA: "left",
    KeyS: "down",
    KeyD: "right",
  };

  const pressed = {};

  document.addEventListener("keydown", (e) => {
    const action = keyMap[e.code];
    if (action) pressed[action] = true;
  });

  document.addEventListener("keyup", (e) => {
    const action = keyMap[e.code];
    if (action) pressed[action] = false;
  });

  function isActionDown(action) {
    return !!pressed[action];
  }

  const moveHandler = () => {
    if (!player.canMove) return;

    let dirX = 0;
    let dirY = 0;

    if (isActionDown("left")) dirX -= 1;
    if (isActionDown("right")) dirX += 1;
    if (isActionDown("up")) dirY -= 1;
    if (isActionDown("down")) dirY += 1;

    let dir = vec2(dirX, dirY);
    if (dir.len() > 0) {
      dir = dir.unit();
      player.lastDirection = dir;
      player.move(dir.x * SPEED, dir.y * SPEED);
      player.flipX = dir.x < 0;
    }
  };

  // Abilities
  const attackAbility = initAttackAbility(player);
  // const attachAbility = initAttachAbility(player, JUMP_FORCE);
  // const hookAbility = initHookAbility(player);

  // Physics
  player.onUpdate(() => {
    moveHandler();

    if (
      (isActionDown("left") ||
        isActionDown("right") ||
        isActionDown("up") ||
        isActionDown("down")) &&
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

  // Damage
  player.hurt = (amount) => {
    if (!canTakeDamage) return;

    player.setInvTime(INV_AFTER_HURT);

    player.setHP(player.hp() - amount);
    player.trigger("hurt");
  };

  player.setInvTime = (seconds) => {
    canTakeDamage = false;
    player.wait(seconds, () => {
      canTakeDamage = true;
    });
  };

  player.setInv = (bool) => {
    canTakeDamage = bool;
  };

  player.onHurt(() => {
    if (player.hp() <= 0) return;

    shake(4);

    setForegroundColor([156, 23, 59]);

    player.wait(0.3, () => {
      setForegroundColor(DEF_COLORS.foreground);
    });
  });

  // Death
  player.onDeath(() => {
    App.startScene("death");
  });

  return player;
};
