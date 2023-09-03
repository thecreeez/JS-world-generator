class World {

  static DefaultSize = [100, 100]
  static SliceSize = [10, 10]

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
    if (!this._cache) {
      return;
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

    if (this.getState() == World.States.IDLE)
      WorldGenerator.bakeSlice(this, Math.floor(x / World.SliceSize[0]), Math.floor(y / World.SliceSize[1]))
  }

  getChunk(x, y) {
    if (y < 0 || y > this._size[1]) {
      console.error(`y pos out of bounds.`)
      return;
    }

    return this._chunks[y][x];
  }

  removeSlice(xSlice, ySlice) {
    for (let y = 0; y < World.SliceSize[1]; y++) {
      let globalY = ySlice * World.SliceSize[1] + y;
      for (let x = 0; x < World.SliceSize[0]; x++) {
        let globalX = xSlice * World.SliceSize[0] + x;

        this.setChunk(globalX, globalY, new Chunk());
      }
    }

    WorldGenerator.bakeSlice(this, xSlice, ySlice);
  }
}