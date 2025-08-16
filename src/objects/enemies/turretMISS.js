import { COLORS } from "../../config";

export const TURRET_STATS_MISS = {
  bulletCount: 1,
  bulletSpeed: 150,
  hp: 1,
  damage: 1,
  shootTimes: 1,
  shootIntervalShort: 0.1,
  shootIntervalLong: 3,
  bulletSize: 6,
  deathPartsCount: 150,
  deathPartsSpeed: [300, 10],
  deathPartsLife: 0.4,
  deathShake: 3,
  deathScore: 20,
};

export function spawnTurretMISS(position, options = {}) {
  const {
    bulletCount = TURRET_STATS_MISS.bulletCount,
    bulletSpeed = TURRET_STATS_MISS.bulletSpeed,
    hp = TURRET_STATS_MISS.hp,
    damage = TURRET_STATS_MISS.damage,
    shootTimes = TURRET_STATS_MISS.shootTimes,
    shootIntervalShort = TURRET_STATS_MISS.shootIntervalShort,
    shootIntervalLong = TURRET_STATS_MISS.shootIntervalLong,
    bulletSize = TURRET_STATS_MISS.bulletSize,
    deathPartsCount = TURRET_STATS_MISS.deathPartsCount,
    deathPartsSpeed = TURRET_STATS_MISS.deathPartsSpeed,
    deathPartsLife = TURRET_STATS_MISS.deathPartsLife,
    deathShake = TURRET_STATS_MISS.deathShake,
    deathScore = TURRET_STATS_MISS.deathScore,
  } = options;

  const turret = add([
    sprite("turretMISS"),
    pos(position),
    area(),
    body(),
    health(hp),
    color(COLORS.foreground),
    anchor("center"),
    timer(),
    "enemy",
    {
      bulletCount,
      bulletSpeed,
      damage,
    },
  ]);

  function shoot() {
    const spread = Math.PI / 8;
    const count = 2;
    const startAngle = -spread / 2;
    const step = spread / (count - 1);

    for (let j = 0; j < shootTimes; j++) {
      turret.wait(shootIntervalShort * j, () => {
        for (let i = 0; i < count; i++) {
          const playerPos = get("player")[0].pos;
          const dir = playerPos.sub(turret.pos).unit();
          const angle = startAngle + i * step;

          const rotatedDir = vec2(
            dir.x * Math.cos(angle) - dir.y * Math.sin(angle),
            dir.x * Math.sin(angle) + dir.y * Math.cos(angle)
          ).unit();

          add([
            circle(bulletSize),
            pos(turret.pos),
            color(COLORS.foreground),
            area(),
            "bullet",
            {
              dir: rotatedDir,
              speed: turret.bulletSpeed,
              damage: turret.damage,
            },
          ]);
        }
      });
    }
  }

  const shootLoop = loop(shootIntervalLong, () => {
    shoot();
  });

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

    death.wait(deathPartsLife * 2, () => {
      destroy(death);
    });
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

    death.wait(deathPartsLife * 2, () => {
      destroy(death);
    });

    get("gameManager")[0].addScore(deathScore);
  });

  return turret;
}
