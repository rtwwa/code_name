export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 800;

// 16:9

// export const COLORS = {
//   background: [56, 43, 38],
//   foreground: [184, 194, 185],
// };

export const DEF_COLORS = {
  background: [34, 42, 61],
  foreground: [237, 242, 226],
  debug: [255, 0, 0],
};

export const COLORS = {
  background: [34, 42, 61],
  foreground: [237, 242, 226],
  debug: [255, 0, 0],
};

export function setForegroundColor(newColor) {
  COLORS.foreground = newColor;
  const allObj = get("*");

  allObj.map((obj) => {
    if (obj.color) obj.color = Color.fromArray(newColor);
    if (obj.outline) obj.outline.color = Color.fromArray(newColor);
  });
}
