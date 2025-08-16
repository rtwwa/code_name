import App from "../../../app";
import { COLORS } from "../../../config";
import Cursor from "../../mouse";

export const HOOK_STATS = { hookCooldown: 5 };

export async function initHookAbility(player) {
  const rope = add([
    pos(width() - 64, height() - 64),
    sprite("hook"),
    color(COLORS.foreground),
    anchor("center"),
    animate(),
    timer(),
  ]);

  rope.hookCooldown = HOOK_STATS.hookCooldown;
  rope.currentCooldown = 0;

  rope.use(
    shader("cooldown", () => ({
      r: player.color.r / 255,
      g: player.color.g / 255,
      b: player.color.b / 255,
      h: 64 * (rope.currentCooldown / rope.hookCooldown),
      texSize: vec2(2048, 2048),
    }))
  );

  rope.ab = await player.attackAbility;
  rope.endPos = null;
  rope.isRopeActive = false;
  rope.canUseHook = true;
  rope.DrawRope = async () => {
    drawLine({
      p1: player.pos,
      p2: rope.endPos,
      width: 4,
      color: rgb(COLORS.foreground),
    });
  };

  rope.calcEndPos = async () => {
    const data = await App.getCurrentSceneData();
    const playerPos = player.pos;
    const mousePos = Cursor.getCursorPos();
    const center = data.centerPos;
    const radius = data.radius;

    const res = raycast(player.pos, mousePos.sub(playerPos).unit().scale(800), [
      "player",
      "bullet",
      "solid",
    ]);

    if (res && res.object.tags.includes("enemy")) {
      rope.endPos = res.object.pos;
      // TODO: FIX ERROR WHEN PLAYER HOOKS TO BUTTON
      // TODO: make another var for hook.damage
      res.object.hurt(player.damage);
      return;
    }

    const dir = mousePos.sub(playerPos);

    const toCenter = playerPos.sub(center);
    const a = dir.dot(dir);
    const b = 2 * toCenter.dot(dir);
    const c = toCenter.dot(toCenter) - radius * radius;
    const discriminant = b * b - 4 * a * c;

    let endPos;
    if (discriminant < 0) {
      endPos = mousePos;
    } else {
      const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const t = Math.max(t1, t2, 0);
      endPos = playerPos.add(dir.scale(t));
    }

    rope.endPos = endPos;
  };

  rope.onUpdate(() => {
    if (rope.isRopeActive && rope.endPos != null) {
      rope.DrawRope();

      if (rope.endPos != null) {
        player.setInv(true);
        player.canMove = false;
        player.moveTo(rope.endPos, 1500);
      }

      if (
        (rope.endPos != null && player.pos.dist(rope.endPos) < 40) ||
        !rope.isRopeActive
      ) {
        rope.isRopeActive = false;
        rope.endPos = null;

        rope.ab.canAttack = true;
        player.canMove = true;
        player.setInvTime(0.1);
      }
    }
  });

  rope.animate("scale", [vec2(1, 1), vec2(1.2, 1.2), vec2(1, 1)], {
    duration: 0.2,
    direction: "ping-pong",
    loops: 1,
  });

  onMousePress("right", async () => {
    if (rope.isRopeActive || !rope.canUseHook) return;

    rope.canUseHook = false;
    rope.currentCooldown = rope.hookCooldown;
    const t = rope.loop(0.1, () => {
      if (rope.currentCooldown <= 0) {
        rope.canUseHook = true;
        rope.currentCooldown = 0;
        rope.animation.seek(0);
        t.cancel();
        return;
      }

      rope.currentCooldown = rope.currentCooldown - 0.1;
    });

    rope.ab.canAttack = false;
    rope.calcEndPos();
    rope.isRopeActive = true;
  });

  onMousePress("left", async () => {
    if (!rope.isRopeActive) return;

    rope.isRopeActive = false;
    rope.endPos = null;
    player.canMove = true;
    player.setInv(false);
    rope.ab.canAttack = true;
  });

  return rope;
}
