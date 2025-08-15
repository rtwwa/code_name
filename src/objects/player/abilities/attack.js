import { COLORS } from "../../../config";
import Cursor from "../../mouse";

const DASH_COOLDOWN = 1.5;
const ATTACK_SPAWN_RADIUS = 40;

export async function initAttackAbility(player) {
  const attackAbility = add([timer()]);

  attackAbility.damage = 1;
  attackAbility.maxDist = 150;
  attackAbility.speed = 800;

  let hasDashed = false;
  let newDist = null;
  let newDir = null;

  // await loadSprite("attackEffect", "./sprites/AttackEffect.png");

  attackAbility.Attack = () => {
    if (hasDashed == true) return;

    hasDashed = true;
    attackAbility.wait(DASH_COOLDOWN, () => {
      hasDashed = false;
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
    console.log(attackAbility);
    attackAbility.Attack();
  });

  attackAbility.onUpdate(() => {
    if (newDist != null) {
      player.setInv(false);
      player.canMove = false;
      player.moveTo(newDist, attackAbility.speed);

      if (player.getCollisions()[0]) {
        const objs = player.getCollisions();

        objs.map((obj) => {
          if (obj.target.tags.includes("enemy")) {
            newDist = null;
            player.canMove = true;

            obj.target.hurt();

            console.log(obj.target.hp());
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
