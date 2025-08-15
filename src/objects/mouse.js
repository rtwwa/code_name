import { COLORS } from "../config";

const Cursor = {
  c: null,

  async init() {
    await loadSprite("crosshair", "./sprites/crosshair.png");

    this.c = add([
      sprite("crosshair"),
      pos(center()),
      color(COLORS.foreground),
      anchor("center"),
      "cursor",
    ]);

    this.c.use(
      shader("newTint", () => ({
        r: COLORS.foreground.at(0) / 255,
        g: COLORS.foreground.at(1) / 255,
        b: COLORS.foreground.at(2) / 255,
      }))
    );

    setCursor("none");

    const self = this;
    onUpdate("cursor", (cursorObj) => {
      cursorObj.pos = mousePos();
    });
  },

  getCursorPos() {
    return this.c ? vec2(this.c.pos) : null;
  },
};

export default Cursor;
