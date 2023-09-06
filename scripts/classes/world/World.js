class World {
  static ChunkSize = [16, 16]

  constructor({ perlinSettings, seed = MathHelper.randomSeed() } = {}) {
    this._perlinSettings = perlinSettings;
    this._seed = seed;
    this.camera = new Camera();

    this._chunks = new Map();
    this._backgroundColor = [255,255,255]
  }

  /**
   * 
   * @param {Biome} biome 
   * @param {Number} height 
   * @returns {Block} Block with needed height for specified biome
   */
  getBlockType(biome, weight) {
    let biomeBlockType = null;

    let blockCandidateValue = 0;
    biome.blocks.forEach((blockCandidate) => {
      blockCandidateValue += blockCandidate.weight;

      if (!biomeBlockType && weight < blockCandidateValue) {
        biomeBlockType = blockCandidate;
      }
    })

    if (!biomeBlockType) {
      return BlockTypes.DEFAULT;
    }

    return biomeBlockType.blockType;
  }

  /**
   * Returns Biome from BiomeTypes
   * @param {Number} biomeValue 
   * @returns {Biome} Biome
   */
  getBiome(biomeValue) {
    let currentBiome = null;
    
    let biomeCandidateValue = 0;
    BiomeTypes.DEFAULT_BIOMES.forEach((biomeCandidate) => {
      biomeCandidateValue += biomeCandidate.weight;

      if (!currentBiome && biomeValue < biomeCandidateValue) {
        currentBiome = biomeCandidate
      }
    })

    return currentBiome;
  }

  /**
   * 
   * @param {ChunkPosition} x 
   * @param {ChunkPosition} y 
   * @returns 
   */
  getChunk(x, y) {
    return this._chunks.get(`${x}:${y}`);
  }

  /**
   * 
   * @param {ChunkPosition} x 
   * @param {ChunkPosition} y 
   * @param {Chunk} chunk
   */
  setChunk(x, y, chunk) {
    this._chunks.set(`${x}:${y}`, chunk);
  }

  /**
   * 
   * @param {GlobalPosition} x 
   * @param {GlobalPosition} y 
   * @param {Block} blockType 
   * @returns {Boolean} true if block successfully placed or false is not
   */
  setBlock(x, y, blockType) {
    let chunkPos = MathHelper.globalToChunkPos([x,y]);
    let blockLocalPos = MathHelper.globalToChunkLocalPos([x,y]);

    let chunk = this.getChunk(chunkPos[0], chunkPos[1]);

    if (chunk) {
      chunk.setBlock(blockLocalPos[0], blockLocalPos[1], blockType);
      return true;
    }

    return false;
  }

  /**
   * 
   * @param {GlobalPosition} x 
   * @param {GlobalPosition} y 
   * @returns {Block} Block from position or null if chunk is not generated yet.
   */
  getBlock(x, y) {
    let chunkPos = MathHelper.globalToChunkPos([x, y]);
    let blockLocalPos = MathHelper.globalToChunkLocalPos([x, y]);

    let chunk = this.getChunk(chunkPos[0], chunkPos[1]);

    if (!chunk) {
      return null;
    }

    return chunk.getBlock(blockLocalPos[0], blockLocalPos[1]);
  }

  getBiomeBounds() {
    return [0, this.getBoundsHeightBiome().max];
  }

  getHeightBounds(biome) {
    return [0, this.getBoundsHeightBlock(biome).max]
  }

  /**
   * @returns {Object} { min, max } values of biome heights
   */
  getBoundsHeightBiome() {
    let min = 0;
    let max = 0;

    BiomeTypes.DEFAULT_BIOMES.forEach((biome) => {
      max += biome.weight;
    })

    return {
      max,
      min
    };
  }

  /**
   * 
   * @param {Biome} biome 
   * @returns {Object} { min, max } values of biome blocks heights
   */
  getBoundsHeightBlock(biome) {
    let min = 0;
    let max = 0;

    biome.blocks.forEach((block) => {
      max += block.weight;
    })

    return {
      max,
      min
    };
  }

  /**
   * Render world
   * @param {Number} deltaTime 
   */
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

          //if (chunkFogAlpha > 0) {
          //  ctx.fillStyle = `rgba(${this.getBackgroundColor()[0]},${this.getBackgroundColor()[1]},${this.getBackgroundColor()[2]},${chunkFogAlpha})`;
          //  ctx.fillRect(x * chunkSize - 1, y * chunkSize - 1, chunkSize + 2, chunkSize + 2);
          //}
        }
      }
    }

    if (Application.DEBUG_MODE) {
      Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID).getElement("ChunksRenderLabel").setValue(`Chunks rendered: ${chunksToRender} (${chunksToRender * World.ChunkSize[0] * World.ChunkSize[1]} blocks)`)
    }
    ctx.restore();
  }

  /**
   * Updates world
   * @param {Number} deltaTime 
   */
  update(deltaTime) {
    Application.EventBus.invoke(EventBus.TYPES.UPDATE_START, { deltaTime })
    let chunkGenerationData = this._updateChunksGeneration(deltaTime);

    // Переделать эту тему / Переназвать ивент
    Application.EventBus.invoke(EventBus.TYPES.UPDATE_END, chunkGenerationData)
  }

  /**
   * Generates new chunks
   * @param {Number} deltaTime 
   * @returns Debug data (Need to fix it)
   */
  _updateChunksGeneration(deltaTime) {
    let chunksToGenerate = this._getChunksToGenerate();

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

    return { deltaTime, generatedChunks, timeToGenerateChunks, maxTimeToGenerateChunks };
  }

  /**
   * 
   * @param {ChunkPosition} x 
   * @param {ChunkPosition} y 
   * @returns Chunks adjacent to selected chunk (If chunk not generated it will be undefined)
   */
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

  _getChunksToGenerate() {
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

  getSeed() {
    return this._seed;
  }

  getBackgroundColor() {
    return this._backgroundColor;
  }

  getChunksCount() {
    return this._chunks.size;
  }
}