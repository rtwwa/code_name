import { COLORS } from "../config";
import { setupBulletLogic, spawnTurretAR } from "../objects/enemies/turretAR";
import { spawnPlayer } from "../objects/player/player";

export const test_scene = async () => {
  const PLAYER_START_POS = vec2(width() / 6 + 50, height() - 200);

  const player = await spawnPlayer(PLAYER_START_POS);

  const centerPos = vec2(width() / 2, height() / 2);
  const radius = width() / 2 - 16;
  const halfRadiusPlayerModel = 36;

  add([
    pos(centerPos),
    circle(radius, { fill: false }),
    outline(2, Color.fromArray(COLORS.foreground)),
  ]);

  player.onUpdate(() => {
    const distFromCenter = player.pos.dist(centerPos);
    if (distFromCenter > radius - halfRadiusPlayerModel) {
      const dir = player.pos.sub(centerPos).unit();
      player.pos = centerPos.add(dir.scale(radius - halfRadiusPlayerModel));
    }
  });

  const scoreText = add([
    text("x -> dash", { font: "Tiny" }),
    pos(20, 20),
    layer("ui"),
  ]);

  setupBulletLogic((bullet) => {
    const distFromCenter = bullet.pos.dist(centerPos);
    if (distFromCenter > radius - bullet.radius / 2) {
      destroy(bullet);
    }
  });

  // спавним туррель
  spawnTurretAR(vec2(center().x, 150));
  spawnTurretAR(vec2(center().x, 200), { bulletCount: 24, bulletSpeed: 200 });
};
