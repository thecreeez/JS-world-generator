/**
 * СДЕЛАТЬ ОТДЕЛЬНО ВЫСОТУ И ТЕМПЕРАТУРУ И ПО НИМ ОПРЕДЕЛЯТЬ ЧАНК
 */

class WorldGenerator {
  static BIOME_SMOOTH = 0.5;

  static HEIGHT_NOISE_TIMES = 7;
  static HEIGHT_NOISE_STEP = 0.6

  static CHUNKS_HEIGHTS_SMOOTH_STEP = 0.6;

  /**
   * Returns Biome from BiomeTypes
   * @param {Number} biomeHeight 
   * @returns {Biome} Biome
   */
  static getBiome(biomeHeight) {
    let currentBiome = null;

    let biomeCandidateHeight = 0;
    BiomeTypes.DEFAULT_BIOMES.forEach((biomeCandidate) => {
      biomeCandidateHeight += biomeCandidate.getHeight();

      if (!currentBiome && biomeHeight <= biomeCandidateHeight) {
        currentBiome = biomeCandidate
      }
    })

    return currentBiome;
  }

  static getBiomeBounds() {
    return [0, WorldGenerator.getBoundsHeightBiome().max];
  }

  /**
   * @returns {Object} { min, max } values of biome heights
   */
  static getBoundsHeightBiome() {
    let min = 0;
    let max = 0;

    BiomeTypes.DEFAULT_BIOMES.forEach((biome) => {
      max += biome.getHeight();
    })

    return {
      max,
      min
    };
  }

  /**
   * 
   * @param {World} world 
   * @param {ChunkPos} x 
   * @param {ChunkPos} y 
   * @param {Object} param3 
   * @returns {Chunk}
   */
  static generateChunk(world, x, y, {leftChunk, rightChunk, topChunk, bottomChunk}) {
    let random = MathHelper.createRandom(world.getSeed() * x * y);
    let chunkHeight = MathHelper.randomInBounds(WorldGenerator.getBiomeBounds()[0], WorldGenerator.getBiomeBounds()[1], random);

    for (let i = 0; i < 1; i++) {
      if (topChunk) {
        chunkHeight = MathHelper.interpolate(chunkHeight, topChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }

      if (rightChunk) {
        chunkHeight = MathHelper.interpolate(chunkHeight, rightChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }

      if (bottomChunk) {
        chunkHeight = MathHelper.interpolate(chunkHeight, bottomChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }

      if (leftChunk) {
        chunkHeight = MathHelper.interpolate(chunkHeight, leftChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }
    }

    let chunkBiome = WorldGenerator.getBiome(chunkHeight);

    if (!chunkBiome) {
      console.log(chunkHeight)
      return;
    }

    let heightNoise = PerlinNoiseGenerator.noise({
      size: World.ChunkSize,
      times: WorldGenerator.HEIGHT_NOISE_TIMES,
      step: WorldGenerator.HEIGHT_NOISE_STEP,
      seed: world.getSeed() * x * y * 30,
      bounds: chunkBiome.getNaturalBounds()
    })

    if (rightChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        rightNoise: rightChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: rightChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    if (leftChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        leftNoise: leftChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: leftChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    if (topChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        topNoise: topChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: topChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    if (bottomChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        bottomNoise: bottomChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: bottomChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    let chunk = new Chunk(x, y, { biome: chunkBiome, temperature: chunkHeight, height: heightNoise })

    for (let chunkY = 0; chunkY < World.ChunkSize[1]; chunkY++) {
      for (let chunkX = 0; chunkX < World.ChunkSize[0]; chunkX++) {
        let blockType = chunkBiome.getBlockType(heightNoise[chunkY][chunkX]);

        chunk.setBlock(chunkX, chunkY, new Block({ blockType }));
      }
    }

    return chunk;
  }
}