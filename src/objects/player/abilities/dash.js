import Cursor from "../../mouse";

const IMPULSE_FORCE = 700;
const DASH_COOLDOWN = 1.5;

export function initDashAbility(player) {
  const dashAbility = add([timer()]);
  let hasDashed = false;

  dashAbility.useDash = () => {
    if (hasDashed == true) return;

    hasDashed = true;
    dashAbility.wait(DASH_COOLDOWN, () => {
      hasDashed = false;
    });

    const playerPos = player.pos;
    const mousePos = Cursor.getCursorPos();
    const dir = mousePos.sub(playerPos).unit();

    player.applyImpulse(vec2(IMPULSE_FORCE * dir.x, IMPULSE_FORCE * dir.y));
  };

  onMousePress("left", () => {
    dashAbility.useDash(player);
  });

  return dashAbility;
}
