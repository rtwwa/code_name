import { COLORS, DEF_COLORS, setForegroundColor } from "../config";
import { loadSpider, setupSpiderLogic } from "../objects/enemies/spider";
import { loadTurret, setupBulletLogic } from "../objects/enemies/turretAR";
import { setupExplosionDamageLogic } from "../objects/enemies/turretART";
import { createGameManager } from "../objects/gameManager";
import Cursor from "../objects/mouse";
import { spawnPlayer } from "../objects/player/player";

export const test_scene = async () => {
  setForegroundColor(DEF_COLORS.foreground);
  await Cursor.init();
  const PLAYER_START_POS = vec2(center().x, center().y * 1.7);

  const player = await spawnPlayer(PLAYER_START_POS);

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

  setupBulletLogic((bullet) => {
    const distFromCenter = bullet.pos.dist(centerPos);
    if (distFromCenter > radius - bullet.radius) {
      destroy(bullet);
    }
  });

  setupExplosionDamageLogic();
  // spawnTurretBT(vec2(center().x, 150), vec2(center().x, 250));
  // spawnTurretART(vec2(center().x, 150));
  // spawnTurretMISS(vec2(center().x, 150));
  // spawnTurretAR(vec2(center().x, 150));
  // spawnTurretAR(vec2(center().x, 200), { bulletCount: 24, bulletSpeed: 200 });

  await loadSpider();
  setupSpiderLogic();
  // spawnSpider(center(), centerPos, radius);
  const gameManager = await createGameManager(player, centerPos, radius);

  const scoreText = add([
    text(get("gameManager")[0].score, { font: "Tiny" }),
    pos(20, 20),
    layer("ui"),
    color(COLORS.foreground),
  ]);

  gameManager.onScoreChange(() => {
    scoreText.text = gameManager.score;
  });

  return { centerPos, radius };
};
