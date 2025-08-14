import { COLORS } from "../config";

export const createCursor = async () => {
  // const cursosSprite = await loadSprite("cursor", "./sprites/cursor.png");

  const c = add([
    rect(25, 25),
    pos(center()),
    color(COLORS.foreground),
    anchor("center"),
    "cursor",
  ]);

  console.log(c);

  return c;
};

export function setupCursorLogic() {
  onUpdate("cursor", (c) => {
    c.pos = mousePos();
  });
}
