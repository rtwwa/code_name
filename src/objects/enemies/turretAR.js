import { COLORS } from "../../config";

export async function loadTurret() {
  await loadSprite("button", "./sprites/button.png");
  await loadSprite("dropArea", "./sprites/dropArea.png");
  await loadSprite("turretAR", "./sprites/turretAR.png");
  await loadSprite("turretMISS", "./sprites/turretMISS.png");
  await loadSprite("turretBT", "./sprites/turretBT.png");
  await loadSprite("turretART", "./sprites/turretART.png");
  await loadSprite("deathParticlies", "./sprites/dust.png");
}

export const TURRET_STATS_AR = {
  bulletCount: 12,
  bulletSpeed: 150,
  hp: 1,
  damage: 1,
  shootInterval: 2,
  bulletSize: 6,
  deathPartsCount: 150,
  deathPartsSpeed: [300, 10],
  deathPartsLife: 0.4,
  deathShake: 3,
  deathScore: 20,
};

export function createTurretSpawnerAR(defaults = {}) {
  const spawnerDefaults = add([{ ...TURRET_STATS_AR }, "sTurretAR"]);

  spawnerDefaults.spawn = (position, options = {}) => {
    const {
      bulletCount = spawnerDefaults.bulletCount,
      bulletSpeed = spawnerDefaults.bulletSpeed,
      hp = spawnerDefaults.hp,
      damage = spawnerDefaults.damage,
      shootInterval = spawnerDefaults.shootInterval,
      bulletSize = spawnerDefaults.bulletSize,
      deathPartsCount = spawnerDefaults.deathPartsCount,
      deathPartsSpeed = spawnerDefaults.deathPartsSpeed,
      deathPartsLife = spawnerDefaults.deathPartsLife,
      deathShake = spawnerDefaults.deathShake,
      deathScore = spawnerDefaults.deathScore,
    } = options;

    const turret = add([
      sprite("turretAR"),
      pos(position),
      area(),
      body(),
      health(hp),
      color(COLORS.foreground),
      anchor("center"),
      "enemy",
      {
        bulletCount,
        bulletSpeed,
        damage,
        shootInterval,
      },
    ]);

    function shootCircle() {
      for (let i = 0; i < turret.bulletCount; i++) {
        const angle = (i / turret.bulletCount) * Math.PI * 2;
        const dir = vec2(Math.cos(angle), Math.sin(angle));

        add([
          circle(bulletSize),
          pos(turret.pos),
          color(COLORS.foreground),
          area(),
          "bullet",
          { dir, speed: turret.bulletSpeed, damage: turret.damage },
        ]);
      }
    }

    const shootLoop = loop(turret.shootInterval, shootCircle);

    turret.onHurt(() => {
      if (turret.hp() <= 0) return;

      const death = add([
        pos(turret.pos),
        particles(
          {
            max: deathPartsCount,
            speed: deathPartsSpeed,
            angle: [0, 360],
            angularVelocity: [45, 90],
            lifeTime: [deathPartsLife, deathPartsLife],
            colors: [rgb(COLORS.foreground)],
            texture: getSprite("deathParticlies").data.tex,
            quads: [getSprite("deathParticlies").data.frames[0]],
          },
          {
            lifetime: deathPartsLife,
            rate: 0,
            direction: 0,
            spread: 180,
          }
        ),
        timer(),
      ]);

      death.emit(deathPartsCount / 3);
      shake(Math.max(deathShake / 3, 1));

      death.wait(deathPartsLife * 2, () => destroy(death));
    });

    turret.onDestroy(() => {
      shootLoop.cancel();
      destroy(turret);
    });

    turret.onDeath(() => {
      const death = add([
        pos(turret.pos),
        particles(
          {
            max: deathPartsCount,
            speed: deathPartsSpeed,
            angle: [0, 360],
            angularVelocity: [45, 90],
            lifeTime: [deathPartsLife, deathPartsLife],
            colors: [rgb(COLORS.foreground)],
            texture: getSprite("deathParticlies").data.tex,
            quads: [getSprite("deathParticlies").data.frames[0]],
          },
          {
            lifetime: deathPartsLife,
            rate: 0,
            direction: 0,
            spread: 180,
          }
        ),
        timer(),
      ]);

      death.emit(deathPartsCount);
      shake(deathShake);
      shootLoop.cancel();
      destroy(turret);

      death.wait(deathPartsLife * 2, () => destroy(death));

      get("gameManager")[0].addScore(deathScore);
    });

    return turret;
  };

  return spawnerDefaults;
}

// Логика пуль остаётся прежней
export function setupBulletLogic(destroyBulletFunc) {
  onUpdate("bullet", (b) => {
    b.move(b.dir.scale(b.speed));
    destroyBulletFunc(b);
  });

  onCollide("bullet", "player", (bullet, player) => {
    destroy(bullet);
    player.hurt(bullet.damage);
  });
}
