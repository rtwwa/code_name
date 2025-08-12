import { createSwingRope } from "../objects/rope";

const IMPULSE_FORCE = 500;
const JUMP_FORCE = -600;
const SPEED = 200;
const DRAG_ON_GROUND = 7;

export const spawnPlayer = () => {
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
    pos(center()),
    area(),
    body(),
    anchor("center"),
    color(0, 0, 0),
    "player",
  ]);

  player.play("idle");
  console.log(getSprite("hero_afk"));

  player.lastDirection = Vec2.fromAngle(-45);

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

  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.applyImpulse(vec2(0, JUMP_FORCE));
    }
  });

  onKeyPress("x", () => {
    player.applyImpulse(vec2(IMPULSE_FORCE, 0));
  });

  onKeyPress("z", () => {
    player.applyImpulse(vec2(-IMPULSE_FORCE, 0));
  });

  player.onUpdate(() => {
    if (player.vel.x >= 1 || player.vel.x <= -1) {
      player.lastDirection = player.vel.x;
      console.log(player.lastDirection);
    }

    if (player.isGrounded()) {
      player.drag = DRAG_ON_GROUND;
    } else {
      player.drag = 0;
    }
  });

  // wall
  player.onCollide("solid", () => {
    console.log("collide!");
    shake(5);
    player.vel = vec2(player.vel.x * -1, player.vel.y);
  });

  function hook() {
    let updateRope = false;
    const rope = createSwingRope(vec2(0, 0), 120);
    rope.attach(player);

    onKeyPress("up", () => {
      const ropePivot = calcPoint();
      if (ropePivot == null) {
        return;
      }

      rope.setAnchor(ropePivot);
      updateRope = true;
    });
    onKeyPress("down", () => {
      if (updateRope != true) return;

      updateRope = false;
      let newDir = player.vel.unit().scale(400);
      console.log(newDir);
      player.applyImpulse(newDir);
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

  const calcPoint = () => {
    let direction = Vec2.fromAngle(-45);
    player.lastDirection > 0
      ? (direction.x = direction.x)
      : (direction.x = -direction.x);
    let hit = raycast(player.pos, direction.scale(400), ["player"]);

    if (hit) {
      return hit.point;

      drawCircle({
        pos: pos,
        radius: 16,
        color: BLUE,
      });

      drawLine({
        p1: player.pos,
        p2: hitPos,
        width: 2,
        color: BLUE,
      });
    }

    return null;
  };

  hook();

  return player;
};

// onKeyPress("c", () => {
//     const hookDistance = 200;
//     const hookAngle = -60;

//     const hook = player.add([
//       rect(10, 10),
//       pos(player.renderArea().center()),
//       rotate(hookAngle),
//       timer(),
//       animate(),
//     ]);

//     const hit = raycast(player.center, Vec2.fromAngle(hookAngle).scale(400), [
//       "player",
//     ]);

//     if (hit) {
//       const poz = hit.point;

//       drawCircle({
//         pos: poz,
//         radius: 1,
//         color: [255, 0, 0],
//       });

//       drawLine({
//         p1: player.pos,
//         p2: poz.add(hit.normal.scale(25)),
//         width: 1,
//         color: BLUE,
//       });
//     }

//     hook.animate("width", [hook.width, (hook.width = hookDistance)], {
//       loops: 1,
//       duration: 0.1,
//       direction: "forward",
//     });

//     hook.wait(1, () => {
//       destroy(hook);
//     });
//   });
