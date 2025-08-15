import kaplay from "kaplay";
import { fullscreenHandler } from "./utils/fullscreen";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "./config.js";

import App from "./app.js";
import { test_scene } from "./scenes/testing_scene.js";
import { death_scene } from "./scenes/death.scene.js";
import { initShaders } from "./utils/shaders.js";

const k = kaplay({
  background: [COLORS.background],
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: 1,
  pixelated: true,
});

fullscreenHandler(k);

loadFont("Tiny", "./fonts/Tiny5-Regular.ttf");
initShaders();

App.init(k);

App.addScene("test", test_scene);
App.addScene("death", death_scene);
App.startScene("test");
