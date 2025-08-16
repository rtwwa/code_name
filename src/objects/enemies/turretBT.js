import { COLORS } from "../../config";

export const TURRET_STATS_BT = {
  bulletCount: 3,
  bulletSpeed: 200,
  hp: 1,
  damage: 1,
  shootInterval: 2,
  size: 24,
  bulletSize: 6,
  deathPartsCount: 150,
  deathPartsSpeed: [300, 10],
  deathPartsLife: 0.4,
  deathShake: 3,
  deathScore: 20,
};

export function createTurretSpawnerBT(position, buttonPosition, options = {}) {
  const spawnerDefaults = add([{ ...TURRET_STATS_BT }, "sTurretBT"]);

  spawnerDefaults.spawn = (position, buttonPosition, options = {}) => {
    const {
      bulletCount = spawnerDefaults.bulletCount,
      bulletSpeed = spawnerDefaults.bulletSpeed,
      hp = spawnerDefaults.hp,
      damage = spawnerDefaults.damage,
      shootInterval = spawnerDefaults.shootInterval,
      size = spawnerDefaults.size,
      bulletSize = spawnerDefaults.bulletSize,
      deathPartsCount = spawnerDefaults.deathPartsCount,
      deathPartsSpeed = spawnerDefaults.deathPartsSpeed,
      deathPartsLife = spawnerDefaults.deathPartsLife,
      deathShake = spawnerDefaults.deathShake,
      deathScore = spawnerDefaults.deathScore,
    } = options;

    const turret = add([
      sprite("turretBT"),
      pos(position),
      area(),
      body(),
      health(Infinity),
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

    const button = add([
      sprite("button"),
      pos(buttonPosition),
      area(),
      body(),
      color(COLORS.foreground),
      anchor("center"),
      "enemy",
    ]);

    turret.use(
      shader("hollow", () => ({
        r: COLORS.foreground.at(0) / 255,
        g: COLORS.foreground.at(1) / 255,
        b: COLORS.foreground.at(2) / 255,
        texSize: vec2(
          getSprite("turretBT").data.tex.width,
          getSprite("turretBT").data.tex.height
        ),
      }))
    );

    button.onCollide("player", () => {
      turret.shader = null;
      turret.setHP(hp);
      destroy(button);
    });

    function shoot() {
      const playerPos = get("player")[0].pos;
      const dir = playerPos.sub(turret.pos).unit();

      const spread = Math.PI / 5;
      const count = turret.bulletCount;
      const startAngle = -spread / 2;
      const step = spread / (count - 1);

      for (let i = 0; i < count; i++) {
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
          { dir: rotatedDir, speed: turret.bulletSpeed, damage: turret.damage },
        ]);
      }
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
