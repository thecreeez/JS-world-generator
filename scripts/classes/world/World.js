class World {

  static DefaultSize = [1000, 1000]
  static SliceSize = [50, 50]

  static States = {
    INIT: "init",
    GENERATING: "generating",
    MESHING: "meshing",
    IDLE: "idle"
  }

  static Biomes = {
    OCEAN: {
      name: "ocean",
      height: -0.1,
      rgb: [35, 119, 181],
      chunks: {
        OCEAN_DEEP: {
          rgb: [15, 50, 70],
          height: 0,
          name: "ocean_deep"
        },

        OCEAN_LITTLE_DEEP: {
          rgb: [22, 70, 120],
          height: 0.5,
          name: "ocean_little_deep"
        },

        OCEAN: {
          rgb: [35, 119, 181],
          height: 0.7,
          name: "ocean"
        }
      }
    },

    DEFAULT: {
      name: "Default",
      height: 0.1,
      rgb: [67, 179, 2],
      chunks: {
        GRASS: {
          rgb: [67, 179, 2], 
          height: 0.2, 
          name: "grass"
        },

        FOREST: {
          rgb: [5, 115, 10], 
          height: 0.5, 
          name: "forest"
        }
      }
    },

    HILLS: {
      name: "hills",
      height: 1,
      rgb: [194, 196, 194],
      chunks: {
        GRASS: {
          rgb: [67, 179, 2],
          height: -0.4,
          name: "grass"
        },

        FOREST: {
          rgb: [5, 115, 10],
          height: -0.2,
          name: "forest"
        },

        MOUNTAIN: { 
          rgb: [76, 76, 76], 
          height: 0.3,
          name: "hills"
        },
        
        SNOW_MOUNTAIN: { 
          rgb: [194, 196, 194], 
          height: 0.6, 
          name: "snow_hills" 
        },

        PEEK_MOUNTAIN: {
          rgb: [220, 220, 220],
          height: 1,
          name: "peek_hills"
        }
      }
    }
  }

  static getBoundsOnScreen(size = World.DefaultSize) {
    let chunkSize = canvas.height / size[1] < canvas.width / size[0] ? canvas.height / size[1] : canvas.width / size[0];

    return [chunkSize * size[0], chunkSize * size[1]];
  }

  constructor({ size = World.DefaultSize, perlinSettings, seed = MathHelper.randomSeed(), offset = [0,0] } = {}) {
    this._size = size;
    this._perlinSettings = perlinSettings;
    this._seed = seed;
    this.offset = offset;

    this._state = World.States.INIT;
  }

  _prepareToGenerateChunks() {
    this._chunks = [];

    for (let y = 0; y < this._size[1]; y++) {
      let chunkLine = [];

      for (let x = 0; x < this._size[0]; x++) {
        chunkLine.push(new Chunk({
          red: 0,
          green: 0,
          blue: 0,
          tags: [Chunk.Tags.NeedToGenerate]
        }))
      }

      this._chunks.push(chunkLine);
    }
  }

  _generateBiomes(offset) {
    let biomeNoise = PerlinNoiseGenerator.noise({
      size: [this._size[0] + 20, this._size[1] + 20],
      times: 40,
      step: 0.4,
      seed: this._seed * 2,
      offset
    })

    for (let y = 0; y < this._size[1]; y++) {
      for (let x = 0; x < this._size[0]; x++) {
        this._chunks[y][x].setBiome(this._getBiome(biomeNoise[y][x]))
      }
    }
  }

  _generateHeights(offset) {
    let heightNoise = PerlinNoiseGenerator.noise({
      size: this._size,
      times: 6,
      step: 0.1,
      seed: this._seed * 5,
      offset
    })

    for (let y = 0; y < this._size[1]; y++) {
      for (let x = 0; x < this._size[0]; x++) {
        if (this._chunks[y][x].hasTag(Chunk.Tags.NeedToGenerate)) {
          this._chunks[y][x].setHeight(heightNoise[y][x]);
          this._chunks[y][x].setColor(this._getChunkType(this._chunks[y][x]).rgb)
          this._chunks[y][x].removeTag(Chunk.Tags.NeedToGenerate);
        }
      }
    }
  }

  _generateMesh() {
    this._createRenderQueue();
    let chunkSize = this.getChunkSize();
    let heightValue = chunkSize / 2;

    this._cache = document.createElement("canvas");
    this._cache.width = chunkSize * this._size[0];
    this._cache.height = chunkSize * this._size[1];

    let ctx = this._cache.getContext("2d");

    this._renderQueue.forEach((chunkRender) => {
      let x = chunkRender.pos[0];
      let y = chunkRender.pos[1];
      let chunk = chunkRender.chunk;

      let renderData = {
        pos: [x * chunkSize, y * chunkSize],
        size: [chunkSize, chunkSize]
      }

      if (chunk.getHeight() > 0) {
        renderData.pos[0] -= heightValue * chunk.getHeightWithBiomeHeight() / 2;
        renderData.pos[1] -= heightValue * chunk.getHeightWithBiomeHeight() / 2;

        renderData.size[0] += heightValue * chunk.getHeightWithBiomeHeight();
        renderData.size[1] += heightValue * chunk.getHeightWithBiomeHeight();
      }

      ctx.fillStyle = chunk.getColor();
      ctx.fillRect(renderData.pos[0], renderData.pos[1], renderData.size[0], renderData.size[1]);
    })
  }

  _createRenderQueue() {
    this._renderQueue = [];

    for (let y = 0; y < this._chunks.length; y++) {
      for (let x = 0; x < this._chunks[y].length; x++) {
        this._renderQueue.push({
          chunk: this._chunks[y][x],
          pos: [x, y]
        });
      }
    }

    this._renderQueue.sort((a, b) => a.chunk.getHeightWithBiomeHeight() - b.chunk.getHeightWithBiomeHeight());
  }

  getChunkType(biome, height) {
    let chunkType = this._getMaxHeightChunk(biome);

    for (let candidateChunkId in biome.chunks) {
      if (height < biome.chunks[candidateChunkId].height && biome.chunks[candidateChunkId].height < chunkType.height) {
        chunkType = biome.chunks[candidateChunkId]
      }
    }

    return chunkType;
  }

  _getMaxHeightChunk(biome) {
    let max = biome.chunks[Object.keys(biome.chunks)[0]];

    Object.keys(biome.chunks).forEach((chunkName) => {
      if (max.height < biome.chunks[chunkName].height) {
        max = biome.chunks[chunkName]
      }
    })

    return max;
  }

  getBiome(chunkValue) {
    let currentBiome = this._getMaxHeightBiome();

    for (let biomeName in World.Biomes) {
      if (chunkValue < World.Biomes[biomeName].height && World.Biomes[biomeName].height < currentBiome.height)
        currentBiome = World.Biomes[biomeName];
    }

    return currentBiome;
  }

  _getMaxHeightBiome() {
    let max = World.Biomes[Object.keys(World.Biomes)[0]];

    Object.keys(World.Biomes).forEach((biomeName) => {
      if (max.height < World.Biomes[biomeName].height) {
        max = World.Biomes[biomeName]
      }
    })

    return max;
  }

  render() {
    if (!this._cache || this._needToRebuildCache) {
      return;
      this._generateMesh();
    }

    ctx.drawImage(this._cache, 0, 0);
  }

  update() {
    switch (this._state) {
      case (World.States.INIT): WorldGenerator.init(this); return;
      case (World.States.GENERATING): WorldGenerator.generate(this); return;
      case (World.States.IDLE): return;
    }
  }

  getChunkSize() {
    return canvas.height / this._size[1] < canvas.width / this._size[0] ? canvas.height / this._size[1] : canvas.width / this._size[0];
  }

  setState(state) {
    this._state = state;
  }
  getState() {
    return this._state;
  }

  getChunks() {
    return this._chunks;
  }

  setChunk(x, y, chunk) {
    if (x < 0 || x > this._size[0]) {
      console.error(`x pos out of bounds.`)
      return;
    }

    if (y < 0 || y > this._size[1]) {
      console.error(`y pos out of bounds.`)
      return;
    }

    this._chunks[y][x] = chunk;
  }

  getChunk(x, y) {
    if (y < 0 || y > this._size[1]) {
      console.error(`y pos out of bounds.`)
      return;
    }

    return this._chunks[y][x];
  }
}