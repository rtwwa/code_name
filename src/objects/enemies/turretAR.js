import { COLORS } from "../../config";

export async function loadTurret() {
  await loadSprite("turret", "./sprites/turret.png");
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
        circle(6),
        pos(turret.pos),
        color(COLORS.foreground),
        area(),
        "bullet",
        { dir, speed: turret.bulletSpeed, damage: turret.damage },
      ]);
    }
  }

  loop(turret.shootInterval, () => {
    shootCircle();
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
