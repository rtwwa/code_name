const App = {
  kaplayInstance: null,
  currentScene: null,
  sceneData: {},

  init(kaplayInstance) {
    this.kaplayInstance = kaplayInstance;
  },

  addScene(name, sceneFunc) {
    if (!this.kaplayInstance) {
      console.error("Kaplay instance не инициализирован");
      return;
    }

    this.kaplayInstance.scene(name, () => {
      const data = sceneFunc();
      this.sceneData[name] = data;
      return data;
    });
  },

  startScene(name) {
    if (!this.kaplayInstance) {
      console.error("Kaplay instance не инициализирован");
      return;
    }

    this.currentScene = name;
    this.kaplayInstance.go(name);
  },

  getCurrentSceneData() {
    return this.sceneData[this.currentScene];
  },
};

export default App;
