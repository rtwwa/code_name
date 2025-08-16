import { COLORS, DEF_COLORS, setForegroundColor } from "../config";
import { TURRET_STATS_AR } from "./enemies/turretAR";
import { TURRET_STATS_ART } from "./enemies/turretART";
import { TURRET_STATS_BT } from "./enemies/turretBT";
import { TURRET_STATS_MISS } from "./enemies/turretMISS";
import { HOOK_STATS } from "./player/abilities/hook";

export async function createUpgradeSystem(player, centerPos, radius) {
  const defIcon = await loadSprite("upgrade", "./sprites/upgrade.png");

  const upgrade = add([timer(), "upgradeSystem"]);
  const hb = await player.hookAbility;
  const ab = await player.attackAbility;

  upgrade.upgrades = [];
  upgrade.getRandomUpgrade = () => {
    if (upgrade.upgrades.length === 0) return;

    return upgrade.upgrades[
      Math.floor(Math.random() * upgrade.upgrades.length)
    ];
  };

  upgrade.openUpgradeWindow = async (t) => {
    hb.endPos = null;
    hb.isRopeActive = false;
    hb.currentCooldown = 0;
    player.moveTo(vec2(center().x, center().y + 100));
    const f1 = upgrade.getRandomUpgrade();
    const f2 = upgrade.getRandomUpgrade();

    const x = add([
      sprite(f1.s),
      pos(vec2(center().x - 150, center().y - 100)),
      area(),
      anchor("center"),
      animate(),
      timer(),
      "upgrade",
      { ...f1, t },
    ]);

    const xtext = x.add([
      text(x.text, { size: 24, font: "Tiny", align: "center" }),
      pos(-75, 45),
      layer("ui"),
      color(DEF_COLORS.foreground),
    ]);

    const y = add([
      sprite(f2.s),
      pos(vec2(center().x + 150, center().y - 100)),
      area(),
      anchor("center"),
      animate(),
      timer(),
      "upgrade",
      { ...f2, t },
    ]);

    const ytext = y.add([
      text(y.text, { size: 24, font: "Tiny", align: "center" }),
      pos(-75, 45),
      layer("ui"),
      color(DEF_COLORS.foreground),
    ]);
  };

  onCollide("player", "upgrade", (p, u) => {
    u.callback();

    u.animate("scale", [vec2(1, 1), vec2(0, 0)], {
      duration: 0.2,
      direction: "forward",
      loops: 1,
    });
    u.animation.seek(0);

    u.wait(0.3, () => {
      get("upgrade").map((obj) => {
        destroy(obj);
        u.t.paused = false;
      });
    });
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "Reduces hook\n cooldown by 20%",
    callback: () => {
      hb.hookCooldown = hb.hookCooldown * 0.8;
    },
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "full hp",
    callback: () => {
      player.setHP(player.maxHP());
    },
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "+3 max hp\n+3 hp",
    callback: () => {
      player.setMaxHP(player.maxHP() + 3);
      player.setHP(player.hp() + 3);
    },
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "Reduces the firing rate\nof all enemies by 30%\n(except spiders)\n but adds +1 HP to them.",
    callback: () => {
      TURRET_STATS_AR.shootInterval = TURRET_STATS_AR.shootInterval * 1.3;
      TURRET_STATS_AR.hp = TURRET_STATS_AR.hp + 1;

      TURRET_STATS_ART.shootInterval = TURRET_STATS_ART.shootInterval * 1.3;
      TURRET_STATS_ART.hp = TURRET_STATS_ART.hp + 1;

      TURRET_STATS_BT.shootInterval = TURRET_STATS_BT.shootInterval * 1.3;
      TURRET_STATS_BT.hp = TURRET_STATS_BT.hp + 1;

      TURRET_STATS_MISS.shootIntervalLong =
        TURRET_STATS_MISS.shootIntervalLong * 1.3;
      TURRET_STATS_MISS.hp = TURRET_STATS_MISS.hp + 1;
    },
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "Reduces bullet size by 30%\nbut adds +1 damage to them",
    callback: () => {
      TURRET_STATS_AR.bulletSize = TURRET_STATS_AR.bulletSize * 0.7;

      TURRET_STATS_ART.bulletSize = TURRET_STATS_ART.bulletSize * 0.7;

      TURRET_STATS_BT.bulletSize = TURRET_STATS_BT.bulletSize * 0.7;

      TURRET_STATS_MISS.bulletSize = TURRET_STATS_MISS.bulletSize * 0.7;
    },
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "Reduces attack\n cooldown by 20%",
    callback: () => {
      ab.attackCooldown = ab.attackCooldown * 0.8;
    },
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "increase player\nmovement speed by 15%",
    callback: () => {
      player.speed = player.speed * 1.15;
    },
  });

  upgrade.upgrades.push({
    s: defIcon,
    text: "increase attack\n damage by 1\n but also increase\n cooldown by 30%",
    callback: () => {
      player.damage = player.damage + 1;
      ab.attackCooldown = ab.attackCooldown * 1.3;
    },
  });

  return upgrade;
}
