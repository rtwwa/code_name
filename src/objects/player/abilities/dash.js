const IMPULSE_FORCE = 500;

export function initDashAbility(player) {
  let hasDashed = false;

  const useDash = () => {
    if (hasDashed == true) return;

    hasDashed = true;
    player.applyImpulse(vec2(IMPULSE_FORCE * player.lastDirection, 0));
  };

  player.onUpdate(() => {
    if (player.isGrounded()) {
      hasDashed = false;
    }
  });

  onKeyPress("x", () => {
    useDash(player);
  });

  return {
    hasDashed,
    useDash,
  };
}
