class World {
  static ChunkSize = [16, 16]

  static States = {
    INIT: "init",
    GENERATING: "generating",
    MESHING: "meshing",
    IDLE: "idle"
  }

  constructor({ perlinSettings, seed = MathHelper.randomSeed() } = {}) {
    this._perlinSettings = perlinSettings;
    this._seed = seed;
    this.camera = new Camera();

    this._chunks = new Map();

    this._state = World.States.INIT;
    this._backgroundColor = [255,255,255]
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

  render(deltaTime) {
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
          ctx.drawImage(renderChunk.getCanvas(), x * chunkSize, y * chunkSize, chunkSize, chunkSize);

          chunksToRender++;
          // Если чанк камеры
          if (Application.DEBUG_MODE && x == camera.getChunkPos()[0] && y == camera.getChunkPos()[1]) {
            ctx.fillStyle = `rgba(255,255,255,0.5)`;
            ctx.fillRect(x * chunkSize, y * chunkSize, chunkSize, chunkSize);
          }

          let chunkFogAlpha = (MathHelper.getVectorLength([x - camera.getPos()[0] / World.ChunkSize[0], y - camera.getPos()[1] / World.ChunkSize[1]]) / (camera._distanceToRender));

          if (renderChunk.currentAnimationTime > 0) {
            chunkFogAlpha += renderChunk.currentAnimationTime / renderChunk.animationTime;

            renderChunk.currentAnimationTime -= deltaTime;
          }

          if (chunkFogAlpha > 0) {
            ctx.fillStyle = `rgba(${this.getBackgroundColor()[0]},${this.getBackgroundColor()[1]},${this.getBackgroundColor()[2]},${chunkFogAlpha})`;
            ctx.fillRect(x * chunkSize - 1, y * chunkSize - 1, chunkSize + 2, chunkSize + 2);
          }
        }
      } 
    }

    if (Application.DEBUG_MODE) {
      Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID).getElement("ChunksRenderLabel").setValue(`Chunks rendered: ${chunksToRender} (${chunksToRender * World.ChunkSize[0] * World.ChunkSize[1]} blocks)`)
    }
    ctx.restore();
  }

  update(deltaTime) {
    Application.EventBus.invoke(EventBus.TYPES.UPDATE_START, {deltaTime})
    let chunksToGenerate = this.getChunksToGenerate();

    let generatedChunks = 0;
    let timeToGenerateChunks = 0;
    let maxTimeToGenerateChunks = Math.floor(1000 / Application.MAX_TICKS);

    if (chunksToGenerate.length > 0) {
      let startTime = Date.now();
      let currentTime = Date.now();

      while (chunksToGenerate.length > 0 && currentTime - startTime < maxTimeToGenerateChunks) {
        let chunkData = chunksToGenerate[0];

        this.setChunk(chunkData.x, chunkData.y, WorldGenerator.generateChunk(this, chunkData.x, chunkData.y, this.getAdjacentChunks(chunkData.x, chunkData.y)))

        chunksToGenerate.splice(0, 1);
        generatedChunks++;
        currentTime = Date.now();
      }

      if (Application.DEBUG_MODE) {
        Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID).getElement("ChunksUpdateLabel").setValue(`Chunks stored: ${this.getChunksCount()} (${this.getChunksCount() * World.ChunkSize[0] * World.ChunkSize[1]} blocks)`)
      }

      timeToGenerateChunks = currentTime - startTime;
    }
    Application.EventBus.invoke(EventBus.TYPES.UPDATE_END, { deltaTime, generatedChunks, timeToGenerateChunks, maxTimeToGenerateChunks, })
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

    for (let currentDistance = 0; currentDistance < cameraDistanceToRender; currentDistance++) {
      for (let x = -currentDistance; x <= currentDistance; x++) {
        for (let y = -currentDistance; y <= currentDistance; y++) {
          if (Math.abs(x) == currentDistance || Math.abs(y) == currentDistance) {
            if (!this.getChunk(cameraChunkPos[0] + x, cameraChunkPos[1] + y)) {
              chunksToGenerate.push({ x: cameraChunkPos[0] + x, y: cameraChunkPos[1] + y })
            }
          }
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
    //console.log("new chunk: "+x+","+y)
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

  getBackgroundColor() {
    return this._backgroundColor;
  }
}