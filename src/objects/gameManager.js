import { spawnSpider, SPIDER_STATS } from "./enemies/spider";
import { spawnTurretAR, TURRET_STATS_AR } from "./enemies/turretAR";
import { spawnTurretART, TURRET_STATS_ART } from "./enemies/turretART";
import { spawnTurretBT, TURRET_STATS_BT } from "./enemies/turretBT";
import { spawnTurretMISS, TURRET_STATS_MISS } from "./enemies/turretMISS";
import { createUpgradeSystem } from "./upgradeSystem";

export async function createGameManager(player, centerPos, radius) {
  const manager = add([
    timer(),
    { score: 0, difficulty: 1, spawnInterval: 2, events: {} },
    "gameManager",
  ]);

  manager.upgrade = await createUpgradeSystem(player, centerPos, radius);

  manager.addScore = (amount) => {
    manager.score += amount;
    updateDifficulty();

    emit("scoreChanged", manager.score);
  };

  function updateDifficulty() {
    manager.difficulty = 1 + Math.floor(manager.score / 100);

    manager.spawnInterval = Math.max(0.5, 3 - manager.difficulty * 0.2);
  }

  function spawnEnemy() {
    const enemyType = chooseEnemyType();
    const pos = randomPosInCircle(centerPos, radius);

    if (enemyType === "spider") {
      spawnSpider(pos, centerPos, radius, {
        speed: SPIDER_STATS.speed + manager.difficulty * 5,
      });
    }

    if (enemyType === "turretAR") {
      spawnTurretAR(pos, {
        bulletCount: TURRET_STATS_AR.bulletCount + manager.difficulty / 3,
        bulletSpeed: TURRET_STATS_AR.bulletSpeed + manager.difficulty,
        bulletSize: TURRET_STATS_AR.bulletSize + manager.difficulty / 4,
      });
    }

    if (enemyType === "turretART") {
      spawnTurretART(pos, {
        bulletCount: TURRET_STATS_ART.bulletCount + manager.difficulty / 3,
        bulletSpeed: TURRET_STATS_ART.bulletSpeed + manager.difficulty,
        bulletSize: TURRET_STATS_ART.bulletSize + manager.difficulty / 5,
      });
    }

    if (enemyType === "turretBT") {
      spawnTurretBT(pos, randomPosInCircle(centerPos, radius), {
        bulletCount: TURRET_STATS_BT.bulletCount + manager.difficulty / 3,
        bulletSpeed: TURRET_STATS_BT.bulletSpeed + manager.difficulty,
        bulletSize: TURRET_STATS_BT.bulletSize + manager.difficulty / 4,
      });
    }

    if (enemyType === "turretMISS") {
      spawnTurretMISS(pos, {
        shootTimes: TURRET_STATS_MISS.shootTimes + manager.difficulty / 3,
        bulletSize: TURRET_STATS_MISS.bulletSize + manager.difficulty / 3,
      });
    }
  }

  function chooseEnemyType() {
    const weights = [0.4, 0.2, 0.2, 0.2, 0.2];
    const types = ["spider", "turretAR", "turretART", "turretBT", "turretMISS"];

    const total = weights.reduce((a, b) => a + b, 0);
    const r = Math.random() * total;

    let sum = 0;
    for (let i = 0; i < types.length; i++) {
      sum += weights[i];
      if (r <= sum) return types[i];
    }

    return types[0];
  }

  function randomPosInCircle(centerPos, radius) {
    let pos;
    let tries = 0;
    do {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * radius;
      pos = vec2(
        centerPos.x + Math.cos(angle) * distance,
        centerPos.y + Math.sin(angle) * distance
      );
      tries++;
      if (tries > 100) break;
    } while (pos.dist(player.pos) < 150);

    return pos;
  }

  function emit(eventName, data) {
    const listeners = manager.events[eventName];
    if (!listeners) return;
    listeners.forEach((cb) => cb(data));
  }

  manager.onScoreChange = (callback) => {
    if (!manager.events["scoreChanged"]) manager.events["scoreChanged"] = [];
    manager.events["scoreChanged"].push(callback);
  };

  const t = manager.loop(manager.spawnInterval, spawnEnemy);

  let lastUpgradePoints = 0;
  let lastTurretBoostPoints = 0;

  function checkScoreTriggers(currentScore) {
    if (currentScore - lastUpgradePoints >= 300) {
      lastUpgradePoints += 300;
      manager.upgrade.openUpgradeWindow(t);
      t.paused = true;
      get("enemy").map((enemy) => {
        destroy(enemy);
      });
      get("bullet").map((enemy) => {
        destroy(enemy);
      });
    }

    if (currentScore - lastTurretBoostPoints >= 500) {
      lastTurretBoostPoints += 500;
      boostRandomTurretHP();
    }
  }

  function boostRandomTurretHP() {
    const turrets = ["turretAR", "turretART", "turretBT", "turretMISS"];
    if (turrets.length === 0) return;

    const turret = turrets[Math.floor(Math.random() * turrets.length)];

    if (turret == "turretAR") {
      TURRET_STATS_AR.hp = TURRET_STATS_AR.hp + 1;
    }
    if (turret == "turretBT") {
      TURRET_STATS_BT.hp = TURRET_STATS_BT.hp + 1;
    }
    if (turret == "turretART") {
      TURRET_STATS_ART.hp = TURRET_STATS_ART.hp + 1;
    }
    if (turret == "turretMISS") {
      TURRET_STATS_MISS.hp = TURRET_STATS_ART.hp + 1;
    }
  }

  manager.onScoreChange(() => {
    checkScoreTriggers(manager.score);
  });

  return manager;
}
