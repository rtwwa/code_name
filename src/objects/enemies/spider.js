import { COLORS } from "../../config";

export const SPIDER_STATS = {
  size: 10,
  speed: 200,
  moveInterval: 1.5,
  damage: 1,
  aggroRange: 200,
  travelRange: 200,
  hp: 1,
  deathPartsCount: 50,
  deathPartsSpeed: [300, 10],
  deathPartsLife: 0.4,
  deathShake: 2,
  deathScore: 10,
};

export function spawnSpider(position, centerPos, radius, options = {}) {
  const {
    size = SPIDER_STATS.size,
    speed = SPIDER_STATS.speed,
    moveInterval = SPIDER_STATS.moveInterval,
    damage = SPIDER_STATS.damage,
    aggroRange = SPIDER_STATS.aggroRange,
    travelRange = SPIDER_STATS.travelRange,
    hp = SPIDER_STATS.hp,
    deathPartsCount = SPIDER_STATS.deathPartsCount,
    deathPartsSpeed = SPIDER_STATS.deathPartsSpeed,
    deathPartsLife = SPIDER_STATS.deathPartsLife,
    deathShake = SPIDER_STATS.deathShake,
    deathScore = SPIDER_STATS.deathScore,
  } = options;
  let dist = position;

  const spider = add([
    circle(size),
    pos(position),
    color(COLORS.foreground),
    area(),
    body(),
    health(hp),
    anchor("center"),
    "enemy",
    "spider",
    {
      damage,
      speed,
      size,
    },
  ]);

  function newDist() {
    const player = get("player")[0];
    if (player) {
      const distance = spider.pos.dist(player.pos);

      console.log(player.width);

      if (distance < aggroRange && distance > player.width + size) {
        dist = vec2(player.pos.x, player.pos.y);
        spider.moveTo(dist, speed);
        return;
      }
    }

    dist = getRandomDist();

    const distFromCenter = dist.dist(centerPos);
    if (distFromCenter > radius - size) {
      dist = center();
    }
  }

  function getRandomDist() {
    return vec2(
      spider.pos.x + rand(-travelRange, travelRange),
      spider.pos.y + rand(-travelRange, travelRange)
    );
  }

  function moveHandler() {
    spider.moveTo(dist, speed);
  }

  loop(moveInterval, () => {
    newDist();
  });

  spider.onUpdate(() => {
    // drawCircle({
    //   pos: spider.pos,
    //   radius: aggroRange,
    //   fill: false,
    //   outline: { color: rgb(COLORS.debug) },
    // });

    // drawCircle({
    //   pos: centerPos,
    //   radius: radius - spider.size * 2,
    //   color: rgb(COLORS.debug),
    //   outline: { color: rgb(COLORS.debug) },
    // });

    moveHandler();
  });

  spider.onDeath(() => {
    const death = add([
      pos(spider.pos),
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
    destroy(spider);

    get("gameManager")[0].addScore(deathScore);
  });

  return spider;
}

export function setupSpiderLogic() {
  onCollide("spider", "player", (spider, player) => {
    player.hurt(spider.damage);
  });
}
