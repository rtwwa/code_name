import { spawnPlayer } from "./player";

export const test_scene = () => {
  let player = spawnPlayer();

  add([
    rect(width() / 3, 20),
    pos(0, height() - 20),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
  ]);

  add([
    rect(width() / 3, 20),
    pos((width() / 3) * 2, height() - 20),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
  ]);

  add([
    rect(width() / 2, 20),
    pos(width() / 4, height() - 200),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
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

  setGravity(1600);
};
