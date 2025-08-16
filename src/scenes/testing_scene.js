import { COLORS, DEF_COLORS, setForegroundColor } from "../config";
import { loadSpider, setupSpiderLogic } from "../objects/enemies/spider";
import {
  createTurretSpawnerAR,
  setupBulletLogic,
} from "../objects/enemies/turretAR";
import {
  createTurretSpawnerART,
  setupExplosionDamageLogic,
} from "../objects/enemies/turretART";
import { createTurretSpawnerBT } from "../objects/enemies/turretBT";
import { createTurretSpawnerMISS } from "../objects/enemies/turretMISS";
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

  await loadSpider();
  setupSpiderLogic();

  createTurretSpawnerAR();
  createTurretSpawnerART();
  createTurretSpawnerBT();
  createTurretSpawnerMISS();
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
