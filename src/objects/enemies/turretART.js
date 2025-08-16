import App from "../../app";
import { COLORS } from "../../config";

export const TURRET_STATS_ART = {
  bulletCount: 6,
  bulletSpeed: 200,
  hp: 1,
  damage: 1,
  shootInterval: 2,
  dropTime: 2,
  explosionSize: 75,
  deathPartsCount: 150,
  deathPartsSpeed: [300, 10],
  deathPartsLife: 0.4,
  deathShake: 3,
  deathScore: 20,
};

export function createTurretSpawnerART(position, options = {}) {
  const spawnerDefaults = add([{ ...TURRET_STATS_ART }, "sTurretART"]);

  spawnerDefaults.spawn = (position, options = {}) => {
    const {
      bulletCount = spawnerDefaults.bulletCount,
      bulletSpeed = spawnerDefaults.bulletSpeed,
      hp = spawnerDefaults.hp,
      damage = spawnerDefaults.damage,
      shootInterval = spawnerDefaults.shootInterval,
      dropTime = spawnerDefaults.dropTime,
      explosionSize = spawnerDefaults.explosionSize,
      deathPartsCount = spawnerDefaults.deathPartsCount,
      deathPartsSpeed = spawnerDefaults.deathPartsSpeed,
      deathPartsLife = spawnerDefaults.deathPartsLife,
      deathShake = spawnerDefaults.deathShake,
      deathScore = spawnerDefaults.deathScore,
    } = options;

    const turret = add([
      sprite("turretART"),
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

    function shoot() {
      const dropPos = get("player")[0].pos;

      const missleArea = add([
        sprite("dropArea"),
        pos(dropPos),
        color(COLORS.foreground),
        anchor("center"),
        timer(),
        "dropArea",
      ]);

      missleArea.wait(dropTime, () => {
        destroy(missleArea);

        const explosion = add([
          circle(explosionSize),
          pos(dropPos),
          color(COLORS.foreground),
          area(),
          timer(),
          "explosion",
          { damage: damage },
        ]);

        explosion.wait(0.2, () => {
          destroy(explosion);
        });
      });
    }

    const shootLoop = loop(turret.shootInterval, () => {
      shoot();
    });

    turret.onHurt(() => {
      if (turret.hp() == Infinity) return;
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

      death.wait(deathPartsLife * 2, () => {
        destroy(death);
      });
    });

    turret.onDestroy(() => {
      shootLoop.cancel();
      destroy(turret);
      get("dropArea").map((obj) => {
        destroy(obj);
      });
      get("explosion").map((obj) => {
        destroy(obj);
      });
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

      death.wait(deathPartsLife * 2, () => {
        destroy(death);
      });

      get("gameManager")[0].addScore(deathScore);
    });

    return turret;
  };

  return spawnerDefaults;
}

export function setupExplosionDamageLogic() {
  onCollide("player", "explosion", (player, explosion) => {
    player.hurt(explosion.damage);
  });
}
