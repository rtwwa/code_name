import App from "../app";
import { COLORS } from "../config";

export const death_scene = async (nextScene) => {
  const centerPos = vec2(width() / 2, height() / 2);
  const radius = width() / 2 - 16;

  add([
    pos(centerPos),
    circle(radius, { fill: false }),
    outline(2, Color.fromArray(COLORS.foreground)),
  ]);

  const scoreText = add([
    text("You are dead!\nPress space to restart", {
      font: "Tiny",
      align: "center",
    }),
    color(COLORS.foreground),
    pos(center()),
    anchor("center"),
    layer("ui"),
  ]);

  onKeyPress("space", () => {
    App.startScene("test");
  });

  return nextScene;
};
