const App = {
  kaplayInstance: null,
  currentScene: null,

  init(kaplayInstance) {
    this.kaplayInstance = kaplayInstance;
  },

  addScene(name, sceneFunc) {
    if (!this.kaplayInstance) {
      console.error("Kaplay instance не инициализирован");
      return;
    }

    this.kaplayInstance.scene(name, sceneFunc);
  },

  startScene(name) {
    if (!this.kaplayInstance) {
      console.error("Kaplay instance не инициализирован");
      return;
    }

    this.currentScene = name;
    this.kaplayInstance.go(name);
  },
};

export default App;
