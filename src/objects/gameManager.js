import { spawnSpider, SPIDER_STATS } from "./enemies/spider";
import { spawnTurretAR, TURRET_STATS } from "./enemies/turretAR";

export function createGameManager(player, centerPos, radius) {
  const manager = add([
    timer(),
    { score: 0, difficulty: 1, spawnInterval: 3, events: {} },
    "gameManager",
  ]);

  // 📌 Сюда ты можешь кидать очки
  manager.addScore = (amount) => {
    manager.score += amount;
    updateDifficulty();

    emit("scoreChanged", manager.score);
  };

  function updateDifficulty() {
    // Можно усложнять через ступени
    manager.difficulty = 1 + Math.floor(manager.score / 50);

    // И постепенно ускорять спавн
    manager.spawnInterval = Math.max(0.5, 3 - manager.difficulty * 0.2);
  }

  function spawnEnemy() {
    // Выбираем тип врага
    const enemyType = chooseEnemyType();
    const pos = randomPosInCircle(centerPos, radius);

    if (enemyType === "spider") {
      spawnSpider(pos, centerPos, radius, {
        speed: SPIDER_STATS.speed + manager.difficulty * 5,
      });
    }
    if (enemyType === "turret") {
      spawnTurretAR(pos, {
        bulletCount: TURRET_STATS.bulletCount + manager.difficulty / 3,
        bulletSpeed: TURRET_STATS.bulletSpeed + manager.difficulty,
        bulletSize: TURRET_STATS.bulletSize + manager.difficulty / 3,
      });
    }
  }

  function chooseEnemyType() {
    // Чем сложнее игра, тем больше шанс на "тяжёлых" врагов
    if (manager.difficulty < 3) return "spider";
    return Math.random() < 0.7 ? "spider" : "turret";
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

  // Запускаем цикл спавна
  manager.loop(manager.spawnInterval, spawnEnemy);

  return manager;
}
