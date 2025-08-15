import { COLORS } from "../../config";

export function spawnSpider(position, centerPos, radius, options = {}) {
  const {
    size = 10,
    speed = 200,
    moveInterval = 1.5,
    damage = 1,
    aggroRange = 200,
    travelRange = 200,
    hp = 1,
  } = options;
  let dist = position;

  const spider = add([
    circle(size),
    pos(position),
    color(COLORS.foreground),
    area(),
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

      if (distance < aggroRange && distance > 10) {
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
    destroy(spider);
  });

  return spider;
}

export function setupSpiderLogic() {
  onCollide("spider", "player", (spider, player) => {
    player.hurt(spider.damage);
  });
}
