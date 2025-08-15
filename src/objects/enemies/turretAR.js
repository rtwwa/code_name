import { COLORS } from "../../config";

export async function loadTurret() {
  // await loadSprite("turret", "./sprites/turret.png");
  await loadSprite("deathParticlies", "./sprites/dust.png");
}

export const TURRET_STATS = {
  bulletCount: 12,
  bulletSpeed: 150,
  damage: 1,
  shootInterval: 2,
  size: 24,
  bulletSize: 6,
  deathPartsCount: 150,
  deathPartsSpeed: [300, 10],
  deathPartsLife: 0.4,
  deathShake: 3,
  deathScore: 30,
};

export function spawnTurretAR(position, options = {}) {
  const {
    bulletCount = TURRET_STATS.bulletCount,
    bulletSpeed = TURRET_STATS.bulletSpeed,
    damage = TURRET_STATS.damage,
    shootInterval = TURRET_STATS.shootInterval,
    size = TURRET_STATS.size,
    bulletSize = TURRET_STATS.bulletSize,
    deathPartsCount = TURRET_STATS.deathPartsCount,
    deathPartsSpeed = TURRET_STATS.deathPartsSpeed,
    deathPartsLife = TURRET_STATS.deathPartsLife,
    deathShake = TURRET_STATS.deathShake,
    deathScore = TURRET_STATS.deathScore,
  } = options;

  const turret = add([
    rect(size, size),
    pos(position),
    area(),
    body(),
    health(1),
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

  const timer = loop(turret.shootInterval, () => {
    shootCircle();
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
    ]);

    death.emit(deathPartsCount);
    shake(deathShake);
    timer.cancel();
    destroy(turret);

    get("gameManager")[0].addScore(deathScore);
  });

  return turret;
}

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
