import { COLORS } from "../config";
import { setupSpiderLogic, spawnSpider } from "../objects/enemies/spider";
import {
  loadTurret,
  setupBulletLogic,
  spawnTurretAR,
} from "../objects/enemies/turretAR";
import Cursor from "../objects/mouse";
import { spawnPlayer } from "../objects/player/player";

export const test_scene = async () => {
  const PLAYER_START_POS = vec2(center().x, center().y * 1.7);

  const player = await spawnPlayer(PLAYER_START_POS);
  await Cursor.init();

  const centerPos = vec2(width() / 2, height() / 2);
  const radius = width() / 2 - 16;
  const halfRadiusPlayerModel = 36;

  add([
    pos(centerPos),
    circle(radius, { fill: false }),
    outline(2, Color.fromArray(COLORS.foreground)),
    "border",
  ]);

  player.onUpdate(() => {
    const distFromCenter = player.pos.dist(centerPos);
    if (distFromCenter > radius - halfRadiusPlayerModel) {
      const dir = player.pos.sub(centerPos).unit();
      player.pos = centerPos.add(dir.scale(radius - halfRadiusPlayerModel));
    }
  });

  const scoreText = add([
    text("try space", { font: "Tiny" }),
    pos(20, 20),
    layer("ui"),
    color(COLORS.foreground),
  ]);

  setupBulletLogic((bullet) => {
    const distFromCenter = bullet.pos.dist(centerPos);
    if (distFromCenter > radius - bullet.radius) {
      destroy(bullet);
    }
  });

  await loadTurret();
  spawnTurretAR(vec2(center().x, 150));
  spawnTurretAR(vec2(center().x, 200), { bulletCount: 24, bulletSpeed: 200 });

  setupSpiderLogic();
  spawnSpider(center(), centerPos, radius);
};
