import { createSwingRope } from "../../rope";

const HOOK_IMPULSE = 400;
const HOOK_LEN = 120;

export function initHookAbility(player) {
  const rope = createSwingRope(vec2(0, 0), HOOK_LEN);
  let updateRope = false;

  rope.attach(player);

  onKeyPress("z", () => {
    // if rope is not active, release new rope
    if (updateRope == false) {
      let isSuccess = releaseHook(player, rope);
      isSuccess ? (updateRope = true) : null;
      return;
    }

    // otherwise, remove the hook and set false updateRope flag
    updateRope = false;
    removeHook(player);
  });

  onKeyPress("down", () => {
    if (updateRope == true) updateRope = false;
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

  const isHooked = () => {
    return updateRope;
  };

  return {
    isHooked: isHooked,
  };
}

const releaseHook = (player, rope) => {
  const hit = getNewHookPoint(player);
  if (hit == null) {
    return false;
  }

  rope.setAnchor(hit);

  const hook_len = hit.sub(player.pos).len();
  if (hook_len < HOOK_LEN) {
    rope.setRadius(hook_len);
  } else {
    rope.setRadius(HOOK_LEN);
  }

  return true;
};

const removeHook = (player) => {
  let newDir = Vec2.fromAngle(-45).scale(HOOK_IMPULSE);
  newDir.x = newDir.x * player.lastDirection;
  player.applyImpulse(newDir);
};

const getNewHookPoint = (player) => {
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
