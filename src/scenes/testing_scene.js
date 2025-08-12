import { spawnPlayer } from "../objects/player/player";

export const test_scene = () => {
  let player = spawnPlayer(vec2(width() / 6 + 50, height() - 200));

  add([
    rect(width() / 3, 20),
    pos(0, height() - 20),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    "solid",
  ]);

  add([
    rect(width() / 3, 20),
    pos((width() / 3) * 2, height() - 20),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    "solid",
  ]);

  add([
    rect(width() / 3, 20),
    pos(width() / 6, height() - 200),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    "solid",
  ]);

  add([
    rect(20, height() - 20),
    pos(width() - 20, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    "solid",
  ]);

  add([
    rect(20, height() - 20),
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    "solid",
  ]);

  add([
    rect(20, height() - 20),
    pos(width() / 2, height() * -0.355),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    "solid",
  ]);

  add([
    rect(20, height() - 20),
    pos(width() * 0.66, height() * 0.75),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    "solid",
  ]);

  setGravity(1600);
};
