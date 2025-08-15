import { COLORS } from "../../config";

export async function loadTurret() {
  // await loadSprite("turret", "./sprites/turret.png");
  await loadSprite("deathParticlies", "./sprites/dust.png");
}

export function spawnTurretAR(position, options = {}) {
  const {
    bulletCount = 12,
    bulletSpeed = 150,
    damage = 1,
    shootInterval = 2,
    size = 24,
  } = options;

  const turret = add([
    rect(size, size),
    pos(position),
    area(),
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

  let pE = turret.add([
    pos(center()),
    particles(
      {
        max: 100,
        speed: [75, 100],
        lifeTime: [0.75, 1.0],
        angle: [0, 360],
        opacities: [1.0, 0.0],
        texture: getSprite("deathParticlies").tex,
        quads: getSprite("deathParticlies").frames,
      },
      {
        direction: 0,
        spread: 360,
      }
    ),
  ]);

  function shootCircle() {
    for (let i = 0; i < turret.bulletCount; i++) {
      const angle = (i / turret.bulletCount) * Math.PI * 2;
      const dir = vec2(Math.cos(angle), Math.sin(angle));

      add([
        circle(6),
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
    console.log(pE);
    timer.cancel();
    destroy(turret);
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
