class World {
  static METHODS = {
    FULL_RANDOM: "Случайно",
    SEED_RANDOM: "Псевдослучайно"
  }

  static SIZE = [100, 100]
  static ENTITIES_MAX = 5;
  static TICK_SPEED = 1;
  static method = World.METHODS.SEED_RANDOM;

  static generateChunks({ chunkTypesSettings, perlinNoiseStep = 0.1, perlinNoiseTimes = 10, seed = 125 }) {
    let chunks = [];

    let heightNoise = PerlinNoiseGenerator.noise(World.SIZE[0], World.SIZE[1], perlinNoiseTimes, perlinNoiseStep, seed );
    let alphaNoise = PerlinNoiseGenerator.noise(World.SIZE[0], World.SIZE[1], perlinNoiseTimes, perlinNoiseStep, seed + 25 );

    for (let y = 0; y < World.SIZE[1]; y++) {
      let line = [];
      
      for (let x = 0; x < World.SIZE[0]; x++) {
        let chunkType = World.getChunkByChunkTypesSettingsAndHeight({ chunkTypesSettings, height: heightNoise[y][x] });
        line.push(new Chunk({ 
          red: chunkType.rgb[0] - heightNoise[y][x] * 5, 
          green: chunkType.rgb[1] - heightNoise[y][x] * 5, 
          blue: chunkType.rgb[2] - heightNoise[y][x] * 5, 
          alpha: (alphaNoise[y][x] + 1) / 2
        }))
      }

      chunks.push(line);
    }

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
    if (worldXSize)
      World.SIZE[0] = worldXSize;

    if (worldYSize)
      World.SIZE[1] = worldYSize

    this.chunks = World.generateChunks({ chunkTypesSettings, perlinNoiseStep, perlinNoiseTimes, seed });
    this.entities = World.generateEntities(this, seed);

    this._seed = seed;
  }

  render() {
    let chunkSize = World.getChunkSize();

    this.chunks.forEach((chunkLine, y) => {
      chunkLine.forEach((chunk, x) => {
        ctx.fillStyle = chunk.getColor();
        ctx.fillRect(x * chunkSize, y * chunkSize, chunkSize, chunkSize);
      })
    })

    this.entities.forEach((entity) => {
      entity.render();
    })
  }

  update() {
    this.entities.forEach((entity) => {
      entity.update();
    })

    this.entities = this.entities.filter((entity) => !entity.needToRemove);

    if (this.entities.length < World.ENTITIES_MAX) {
      this.entities.push(new CloudEntity({
        world: this,
        pos: [World.getChunkSize() * World.SIZE[0] + Math.random() * (World.SIZE[0] * 5), Math.random() * canvas.height],
        seed: this._seed
      }))
    }
  }
}