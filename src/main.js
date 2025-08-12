import kaplay from "kaplay";
import { fullscreenHandler } from "./utils/fullscreen";
import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";

import App from "./app.js";
import { test_scene } from "./scenes/testing_scene.js";

const k = kaplay({
  background: [255, 255, 255],
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: 1,
  pixelated: true,
});

fullscreenHandler(k);

App.init(k);

App.addScene("test", test_scene);
App.startScene("test");
