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

    player.applyImpulse(
      vec2(
        IMPULSE_FORCE * player.lastDirection.x,
        IMPULSE_FORCE * player.lastDirection.y
      )
    );
  };

  onKeyPress("x", () => {
    dashAbility.useDash(player);
  });

  return dashAbility;
}
