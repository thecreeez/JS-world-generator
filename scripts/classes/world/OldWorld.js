class World {
  static METHODS = {
    FULL_RANDOM: "Случайно",
    SEED_RANDOM: "Псевдослучайно"
  }

  static SIZE = [30, 30]
  static ENTITIES_MAX = 5;
  static TICK_SPEED = 1;
  static method = World.METHODS.SEED_RANDOM;

  static GENERATE_PROFILER;

  static generateChunks({ chunkTypesSettings, perlinNoiseStep = 0.1, perlinNoiseTimes = 10, seed = 125 }) {
    let chunks = [];

    World.GENERATE_PROFILER.startTask("Height noise");
    let heightNoise = PerlinNoiseGenerator.noise({
      xSize: World.SIZE[0], 
      ySize: World.SIZE[1], 
      times: perlinNoiseTimes, 
      step: perlinNoiseStep, 
      seed: seed
    });
    World.GENERATE_PROFILER.endTask("Height noise");

    World.GENERATE_PROFILER.startTask("Alpha noise");
    let alphaNoise = PerlinNoiseGenerator.noise({
      xSize: World.SIZE[0],
      ySize: World.SIZE[1],
      times: perlinNoiseTimes,
      step: perlinNoiseStep,
      seed: seed + 25,
      offset: [0,0]
    });
    World.GENERATE_PROFILER.endTask("Alpha noise");

    World.GENERATE_PROFILER.startTask("Meshing chunks");
    for (let y = 0; y < World.SIZE[1]; y++) {
      let line = [];
      
      for (let x = 0; x < World.SIZE[0]; x++) {
        let chunkType = World.getChunkByChunkTypesSettingsAndHeight({ chunkTypesSettings, height: heightNoise[y][x] });

        line.push(new Chunk({
          red: chunkType.rgb[0] - heightNoise[y][x] * 5,
          green: chunkType.rgb[1] - heightNoise[y][x] * 5,
          blue: chunkType.rgb[2] - heightNoise[y][x] * 5,
          alpha: (alphaNoise[y][x] + 1) / 2,
          height: heightNoise[y][x]
        }))
      }

      chunks.push(line);
    }
    World.GENERATE_PROFILER.endTask("Meshing chunks");

    return chunks;
  }
  
  static generateEntities(world, seed) {
    let entities = [];

    for (let i = 0; i < World.ENTITIES_MAX; i++) {
      entities.push(new CloudEntity({
        world: world,
        pos: [World.getChunkSize() * World.SIZE[0] + Math.random() * (World.SIZE[0] * 5), Math.random() * canvas.height],
        seed
      }))
    }

    return entities;
  }

  static getChunkByChunkTypesSettingsAndHeight({ chunkTypesSettings, height }) {

    let currentType = chunkTypesSettings[Object.keys(chunkTypesSettings)[Object.keys(chunkTypesSettings).length - 1]];

    for (let heightCandidate in chunkTypesSettings) {
      if (height < heightCandidate && heightCandidate < currentType.height)
        currentType = chunkTypesSettings[heightCandidate];
    }

    return currentType;
  }

  static getChunkSize() {
    return canvas.height / World.SIZE[1] < canvas.width / World.SIZE[0] ? canvas.height / World.SIZE[1] : canvas.width / World.SIZE[0];
  }

  constructor({ chunkTypesSettings, perlinNoiseStep, perlinNoiseTimes, seed, worldXSize, worldYSize }) {
    World.GENERATE_PROFILER = DebugHelper.createProfiler();

    if (worldXSize)
      World.SIZE[0] = worldXSize;

    if (worldYSize)
      World.SIZE[1] = worldYSize

    this.chunks = World.generateChunks({ chunkTypesSettings, perlinNoiseStep, perlinNoiseTimes, seed });
    this.entities = []//World.generateEntities(this, seed);

    this._seed = seed;


    /**
     * TO-DO: MAKE EVENTBUS AND MOVE THIS SOMEWHERE....
     */
    //if (UIManagerInstance.getElement("DebugMenu").hasElement("ProfilerDataContainer")) {
    //  UIManagerInstance.getElement("DebugMenu").removeElement("ProfilerDataContainer")
    //}

    //UIManagerInstance.getElement("DebugMenu").addElement(`ProfilerDataContainer`, new UIContainer({
    //  manager: UIManagerInstance,
    //  pos: [0, 0],
    // isActive: true,
    //  isRender: true,
    //  name: "Generation Profiler"
    //}))

    //World.GENERATE_PROFILER.getTasks().forEach((task, id) => {
    //  UIManagerInstance.getElement("DebugMenu").getElement("ProfilerDataContainer").addElement(`DataLabel${id}`, new UILabel({
    //    manager: UIManagerInstance,
    //    isRender: true,
    //    text: `[${DebugHelper.getDate()}] ${task.name}: ${task.time}ms`
    //  }))
    //})
  }

  render() {
    let chunkSize = World.getChunkSize();
    let heightValue = chunkSize / 2;

    //FPS_PROFILER.startTask("[WORLD] Chunk drawing")
    this.chunks.forEach((chunkLine, y) => {
      chunkLine.forEach((chunk, x) => {
        ctx.fillStyle = chunk.getColor();
        ctx.fillRect(x * chunkSize - heightValue * chunk.getHeight() / 2, y * chunkSize - heightValue * chunk.getHeight() / 2, chunkSize + heightValue * chunk.getHeight(), chunkSize + heightValue * chunk.getHeight());
      })
    })
    //FPS_PROFILER.endTask("[WORLD] Chunk drawing")

    //FPS_PROFILER.startTask("[WORLD] Entity drawing")
    this.entities.forEach((entity) => {
      entity.render();
    })
    FPS_PROFILER.endTask("[WORLD] Entity drawing")

    //UIManagerInstance.getElement("MainMenu").getElement("ButtonGenerate").emulateClick();
  }

  update() {
    this.entities.forEach((entity) => {
      entity.update();
    })

    this.entities = this.entities.filter((entity) => !entity.needToRemove);

    if (this.entities.length < World.ENTITIES_MAX) {
      return;
      this.entities.push(new CloudEntity({
        world: this,
        pos: [World.getChunkSize() * World.SIZE[0] + Math.random() * (World.SIZE[0] * 5), Math.random() * canvas.height],
        seed: this._seed
      }))
    }
  }
}