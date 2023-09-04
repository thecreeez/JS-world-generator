class World {

  static DefaultSize = [200, 200]
  static ChunkSize = [30, 30]

  static States = {
    INIT: "init",
    GENERATING: "generating",
    MESHING: "meshing",
    IDLE: "idle"
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

  // DEPRECATED
  _createRenderQueue() {
    this._renderQueue = [];

    for (let y = 0; y < this._blocks.length; y++) {
      for (let x = 0; x < this._blocks[y].length; x++) {
        this._renderQueue.push({
          chunk: this._blocks[y][x],
          pos: [x, y]
        });
      }
    }

    this._renderQueue.sort((a, b) => a.chunk.getHeightWithBiomeHeight() - b.chunk.getHeightWithBiomeHeight());
  }

  getBlockType(biome, height) {
    let biomeBlock = this._getMaxHeightBlock(biome);

    for (let candidateBlockId in biome.blocks) {
      if (height < biome.blocks[candidateBlockId].height && biome.blocks[candidateBlockId].height < biomeBlock.height) {
        biomeBlock = biome.blocks[candidateBlockId]
      }
    }

    return biomeBlock.blockType;
  }

  _getMaxHeightBlock(biome) {
    let max = biome.blocks[Object.keys(biome.blocks)[0]];

    Object.keys(biome.blocks).forEach((blockName) => {
      if (max.height < biome.blocks[blockName].height) {
        max = biome.blocks[blockName]
      }
    })

    return max;
  }

  getBiome(blockValue) {
    let currentBiome = this._getMaxHeightBiome();

    for (let biomeName in BiomeTypes) {
      if (blockValue < BiomeTypes[biomeName].height && BiomeTypes[biomeName].height < currentBiome.height)
        currentBiome = BiomeTypes[biomeName];
    }

    return currentBiome;
  }

  _getMaxHeightBiome() {
    let max = BiomeTypes[Object.keys(BiomeTypes)[0]];

    Object.keys(BiomeTypes).forEach((biomeName) => {
      if (max.height < BiomeTypes[biomeName].height) {
        max = BiomeTypes[biomeName]
      }
    })

    return max;
  }

  render() {
    if (!this._cache) {
      return;
    }

    this._cache.getContext("2d").drawImage(this._cache, this.test, 0);
    ctx.drawImage(this._cache, 0, 0);

    this.test+=0.05;
    /**
     * 1) Движение камеры
     * 2) Перемещение карты
     * 3) Дорисовка чанков
     */

    //this.WorldGeneratorCache.noises.CHUNKS.forEach((noiseLine, y) => {
    //  noiseLine.forEach((noiseValue, x) => {
    //    let noiseValueToRGB = (noiseValue + 1) / 2 * 127.5;
    //    ctx.fillStyle = `rgba(${noiseValueToRGB},${noiseValueToRGB},${noiseValueToRGB},0.6)`;
    //    ctx.fillRect(x * chunkSize, y * chunkSize, chunkSize, chunkSize);
    //  })
    //})
  }

  update() {
    switch (this._state) {
      case (World.States.INIT): WorldGenerator.init(this); return;
      case (World.States.GENERATING): WorldGenerator.generate(this); return;
      case (World.States.IDLE): return;
    }
  }

  getBlockSize() {
    return canvas.height / this._size[1] < canvas.width / this._size[0] ? canvas.height / this._size[1] : canvas.width / this._size[0];
  }

  setState(state) {
    this._state = state;
  }
  getState() {
    return this._state;
  }

  getBlocks() {
    return this._blocks;
  }

  setBlock(x, y, block) {
    if (x < 0 || x > this._size[0]) {
      console.error(`x pos out of bounds.`)
      return;
    }

    if (y < 0 || y > this._size[1]) {
      console.error(`y pos out of bounds.`)
      return;
    }

    this._blocks[y][x] = block;

    if (this.getState() == World.States.IDLE)
      WorldGenerator.bakeSlice(this, Math.floor(x / World.SliceSize[0]), Math.floor(y / World.SliceSize[1]))
  }

  getBlock(x, y) {
    if (y < 0 || y > this._size[1]) {
      console.error(`y pos out of bounds.`)
      return;
    }

    if (x < 0 || x > this._size[0]) {
      console.error(`y pos out of bounds.`)
      return;
    }

    return this._blocks[y][x];
  }

  invertSlice(xSlice, ySlice) {
    for (let y = 0; y < World.SliceSize[1]; y++) {
      let globalY = ySlice * World.SliceSize[1] + y;
      for (let x = 0; x < World.SliceSize[0]; x++) {
        let globalX = xSlice * World.SliceSize[0] + x;

        let block = this.getBlock(globalX, globalY);

        block.setColor([
          255 - block._red,
          255 - block._green,
          255 - block._blue
        ]);
      }
    }

    WorldGenerator.bakeSlice(this, xSlice, ySlice);
  }

  getSeed() {
    return this._seed;
  }
}