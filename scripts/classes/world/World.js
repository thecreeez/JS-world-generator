class World {
  static ChunkSize = [50, 50]

  static States = {
    INIT: "init",
    GENERATING: "generating",
    MESHING: "meshing",
    IDLE: "idle"
  }

  constructor({ size = World.DefaultSize, perlinSettings, seed = MathHelper.randomSeed() } = {}) {
    this._size = size;
    this._perlinSettings = perlinSettings;
    this._seed = seed;
    this.camera = new Camera();

    this._chunks = new Map();

    this._state = World.States.INIT;
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
    let camera = this.camera;
    let chunkSize = camera.getChunkSizeOnScreen();
    let chunksBoundsToRender = this.getChunkBoundsToRender();

    ctx.save()
    ctx.translate(canvas.width / 2 - chunkSize / 2 - camera.getPos()[0] * (chunkSize / World.ChunkSize[0]), canvas.height / 2 - chunkSize / 2 - camera.getPos()[1] * (chunkSize / World.ChunkSize[0]));

    let chunksToRender = 0;

    for (let y = chunksBoundsToRender.min[1]; y < chunksBoundsToRender.max[1]; y++) {
      for (let x = chunksBoundsToRender.min[0]; x < chunksBoundsToRender.max[0]; x++) {
        let renderChunk = this.getChunk(x, y);
        if (renderChunk) {
          ctx.drawImage(renderChunk.getCanvas(), x * chunkSize, y * chunkSize, chunkSize + 1, chunkSize + 1);

          chunksToRender++;
          // Если чанк камеры
          if (Application.DEBUG_MODE && x == camera.getChunkPos()[0] && y == camera.getChunkPos()[1]) {
            ctx.fillStyle = `rgba(255,255,255,0.5)`;
            ctx.fillRect(x * chunkSize, y * chunkSize, chunkSize, chunkSize);
          }
        }
      } 
    }

    if (Application.DEBUG_MODE) {
      Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID).getElement("ChunksRenderLabel").setValue(`Chunks rendered: ${chunksToRender}`)
    }
    ctx.restore();
  }

  update() {
    let chunksToGenerate = this.getChunksToGenerate();

    if (chunksToGenerate.length > 0) {
      for (let i = 0; i < Math.min(chunksToGenerate.length, Application.CHUNK_GENERATION_PER_TICK); i++) {
        let chunkData = chunksToGenerate[i]; 
        this.setChunk(chunkData.x, chunkData.y, WorldGenerator.generateChunk(this, chunkData.x, chunkData.y, this.getAdjacentChunks(chunkData.x, chunkData.y)))

        if (Application.DEBUG_MODE) {
          Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID).getElement("ChunksUpdateLabel").setValue(`Chunks stored: ${this.getChunksCount()} (${this.getChunksCount() * World.ChunkSize[0] * World.ChunkSize[1]} blocks)`)
        }
      }
    }
  }

  getAdjacentChunks(x, y) {
    return {
      leftChunk: this.getChunk(x - 1, y),
      rightChunk: this.getChunk(x + 1, y),
      topChunk: this.getChunk(x, y - 1), 
      bottomChunk: this.getChunk(x, y + 1),
    };
  }

  getChunkBoundsToRender() {
    let camera = this.camera;

    let cameraPos = camera.getChunkPos();
    let cameraDistance = camera.getDistanceToRender();

    return {
      min: [cameraPos[0] - cameraDistance, cameraPos[1] - cameraDistance],
      max: [cameraPos[0] + cameraDistance, cameraPos[1] + cameraDistance],
    }
  }

  getChunksToGenerate() {
    let camera = this.camera;

    let chunksToGenerate = [];

    let cameraChunkPos = camera.getChunkPos();
    let cameraDistanceToRender = camera.getDistanceToGenerate();

    if (!this.getChunk(cameraChunkPos[0], cameraChunkPos[1])) {
      chunksToGenerate.push({ x: cameraChunkPos[0], y: cameraChunkPos[1]})
    }

    /**
     * ПЕРЕДЕЛАТЬ ЧТОБ ТИПА ЧЕТНЫЕ ПОЗИТИВНЫЕ НЕЧЕТНЫЕ НЕГАТИВНЫЕ НУ ТЫ ПОНЯЛ
     * 
     * пофиксить еще что крестовидный неспаун проихсдоит
     */

    for (let xNegative = 0; xNegative > -cameraDistanceToRender; xNegative--) {
      for (let yNegative = 0; yNegative > -cameraDistanceToRender; yNegative--) {
        if (!this.getChunk(cameraChunkPos[0] + xNegative, cameraChunkPos[1] + yNegative) && !(xNegative == 0 && yNegative == 0)) {
          chunksToGenerate.push({ x: cameraChunkPos[0] + xNegative, y: cameraChunkPos[1] + yNegative })
        }
      }

      for (let yPositive = 0; yPositive < cameraDistanceToRender; yPositive++) {
        if (!this.getChunk(cameraChunkPos[0] + xNegative, cameraChunkPos[1] + yPositive) && !(xNegative == 0 && yPositive == 0)) {
          chunksToGenerate.push({ x: cameraChunkPos[0] + xNegative, y: cameraChunkPos[1] + yPositive })
        }
      }
    }

    for (let xPositive = 0; xPositive < cameraDistanceToRender; xPositive++) {
      for (let yNegative = 0; yNegative > -cameraDistanceToRender; yNegative--) {
        if (!this.getChunk(cameraChunkPos[0] + xPositive, cameraChunkPos[1] + yNegative) && !(xPositive == 0 && yNegative == 0)) {
          chunksToGenerate.push({ x: cameraChunkPos[0] + xPositive, y: cameraChunkPos[1] + yNegative })
        }
      }

      for (let yPositive = 0; yPositive < cameraDistanceToRender; yPositive++) {
        if (!this.getChunk(cameraChunkPos[0] + xPositive, cameraChunkPos[1] + yPositive) && !(xPositive == 0 && yPositive == 0)) {
          chunksToGenerate.push({ x: cameraChunkPos[0] + xPositive, y: cameraChunkPos[1] + yPositive })
        }
      }
    }

    return chunksToGenerate;
  }

  getChunksCount() {
    return this._chunks.size;
  }

  getChunk(x, y) {
    return this._chunks.get(`${x}:${y}`);
  }

  setChunk(x, y, chunk) {
    console.log("new chunk: "+x+","+y)
    return this._chunks.set(`${x}:${y}`, chunk);
  }

  setState(state) {
    this._state = state;
  }
  getState() {
    return this._state;
  }

  getSeed() {
    return this._seed;
  }
}