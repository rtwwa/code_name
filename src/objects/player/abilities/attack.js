import { COLORS } from "../../../config";
import Cursor from "../../mouse";

const ATTACK_COOLDOWN = 1.5;
const ATTACK_SPAWN_RADIUS = 40;

export async function initAttackAbility(player) {
  const attackIconSprite = await loadSprite("axe", "./sprites/axe.png");

  const attackAbility = add([
    pos(64, height() - 64),
    sprite("axe"),
    scale(1),
    color(COLORS.foreground),
    anchor("center"),
    animate(),
    timer(),
  ]);

  attackAbility.canAttack = true;
  attackAbility.attackCooldown = ATTACK_COOLDOWN;
  attackAbility.cooldown = 0;

  attackAbility.use(
    shader("cooldown", () => ({
      r: player.color.r / 255,
      g: player.color.g / 255,
      b: player.color.b / 255,
      h: 64 * (attackAbility.cooldown / attackAbility.attackCooldown),
      texSize: vec2(attackIconSprite.tex.width, attackIconSprite.tex.height),
    }))
  );

  attackAbility.damage = 1;
  attackAbility.maxDist = 150;
  attackAbility.speed = 800;

  let hasAttacked = false;
  let newDist = null;
  let newDir = null;

  attackAbility.getCanAttack = () => {
    return attackAbility.canAttack;
  };

  attackAbility.animate("scale", [vec2(1, 1), vec2(1.2, 1.2), vec2(1, 1)], {
    duration: 0.2,
    direction: "ping-pong",
    loops: 1,
  });

  attackAbility.Attack = () => {
    if (!attackAbility.canAttack) return;
    if (hasAttacked == true) return;

    attackAbility.scale = vec2(1, 1);

    hasAttacked = true;
    attackAbility.cooldown = ATTACK_COOLDOWN;
    const t = attackAbility.loop(0.05, () => {
      if (attackAbility.cooldown <= 0) {
        hasAttacked = false;
        attackAbility.cooldown = 0;
        attackAbility.animation.seek(0);
        t.cancel();
        return;
      }

      attackAbility.cooldown = attackAbility.cooldown - 0.05;
    });

    newDir = attackAbility.getAttackDir();
    newDist = attackAbility.getAttackPos();
  };

  attackAbility.getAttackDir = () => {
    const playerPos = player.pos;
    const mousePos = Cursor.getCursorPos();
    return mousePos.sub(playerPos).unit();
  };

  attackAbility.getAttackPos = () => {
    return vec2(
      player.pos.x + newDir.x * attackAbility.maxDist,
      player.pos.y + newDir.y * attackAbility.maxDist
    );
  };

  onMousePress("left", () => {
    attackAbility.Attack();
  });

  attackAbility.onUpdate(() => {
    if (newDist != null) {
      player.setInv(true);
      player.canMove = false;
      player.moveTo(newDist, attackAbility.speed);

      if (player.getCollisions()[0]) {
        const objs = player.getCollisions();

        objs.map((obj) => {
          if (obj.target.tags.includes("enemy")) {
            if (!obj.target.hurt) return;
            newDist = null;
            player.canMove = true;

            obj.target.hurt();

            return;
          }
        });
      }

      player.setInvTime(0.1);

      if (
        newDist != null &&
        newDist.x.toFixed(0) == player.pos.x.toFixed(0) &&
        newDist.y.toFixed(0) == player.pos.y.toFixed(0)
      ) {
        newDist = null;
        player.canMove = true;

        // const attackObj = add([
        //   circle(8),
        //   pos(
        //     player.pos.x + newDir.x * ATTACK_SPAWN_RADIUS,
        //     player.pos.y + newDir.y * ATTACK_SPAWN_RADIUS
        //   ),
        //   color(COLORS.foreground),
        //   area(),
        //   anchor("center"),
        //   timer(),
        //   "playerAttack",
        // ]);

        // attackObj.wait(1, () => {
        //   destroy(attackObj);
        // });
      }
    }
  });

  return attackAbility;
}
