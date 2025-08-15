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

    const trail = add([
      pos(),
      particles(
        {
          max: 20,
          speed: [200, 250],
          lifeTime: [0.2, 0.75],
          colors: [WHITE],
          opacities: [1.0, 0.0],
          angle: [0, 360],
          texture: getSprite("crosshair").data.tex,
          quads: [getSprite("crosshair").data.frames[0]],
        },
        {
          rate: 5,
          direction: -90,
          spread: 2,
        }
      ),
    ]);

    onMouseMove((pos, delta) => {
      trail.pos = mousePos();
      trail.emit(1);
    });

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
