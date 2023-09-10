/**
 * СДЕЛАТЬ ОТДЕЛЬНО ВЫСОТУ И ТЕМПЕРАТУРУ И ПО НИМ ОПРЕДЕЛЯТЬ ЧАНК
 */

class WorldGenerator {
  static BIOME_SMOOTH = 0.8;

  static HEIGHT_NOISE_TIMES = 7;
  static HEIGHT_NOISE_STEP = 0.6;
  static CHUNKS_HEIGHTS_SMOOTH_STEP = 0.8;

  static CLOUDS_NOISE_TIMES = 10;
  static CLOUDS_NOISE_STEP = 0.8;
  static CHUNKS_CLOUDS_SMOOTH_STEP = 0.9;

  /**
   * Returns Biome from BiomeTypes
   * @param {Number} biomeHeight 
   * @param {Number} biomeTemperature
   * @returns {Biome} Biome
   */
  static getBiome(biomeHeight, biomeTemperature) {
    let currentBiome = null;

    let biomeCandidateHeight = 0;
    let biomeCandidateTemperature = 0;
    BiomeTypes.DEFAULT_BIOMES.forEach((biomeCandidate) => {
      biomeCandidateHeight += biomeCandidate.getHeight();

      if (!currentBiome && biomeHeight <= biomeCandidateHeight && biomeTemperature <= biomeCandidateTemperature) {
        currentBiome = biomeCandidate
      }

      biomeCandidateTemperature += biomeCandidate.getTemperature();

      if (!currentBiome && biomeHeight <= biomeCandidateHeight && biomeTemperature <= biomeCandidateTemperature) {
        currentBiome = biomeCandidate
      }
    })

    return currentBiome;
  }

  static getBiomeHeightBounds() {
    let min = 0;
    let max = 0;

    BiomeTypes.DEFAULT_BIOMES.forEach((biome) => {
      max += biome.getHeight();
    })

    return [min, max]
  }

  static getBiomeTemperatureBounds() {
    let min = 0;
    let max = 0;

    BiomeTypes.DEFAULT_BIOMES.forEach((biome) => {
      max += biome.getTemperature();
    })

    return [min, max]
  }

  /**
   * TO-DO: MAKE SMOOTH_NOISE METHOD SO WE DONT NEED MANY IF STRUCTURES...
   */

  /**
   * 
   * @param {World} world 
   * @param {ChunkPos} x 
   * @param {ChunkPos} y 
   * @param {Object} param3 
   * @returns {Chunk}
   */
  static generateChunk(world, x, y, {leftChunk, rightChunk, topChunk, bottomChunk}) {
    let random = MathHelper.createRandom(world.getSeed() * x * y * 2);
    let chunkHeight = MathHelper.randomInBounds(WorldGenerator.getBiomeHeightBounds()[0], WorldGenerator.getBiomeHeightBounds()[1], random);

    random = MathHelper.createRandom(world.getSeed() * x * y * 10);
    let chunkTemperature = MathHelper.randomInBounds(WorldGenerator.getBiomeTemperatureBounds()[0], WorldGenerator.getBiomeTemperatureBounds()[1], random);

    for (let i = 0; i < 1; i++) {
      if (topChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, topChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
        chunkHeight = MathHelper.interpolate(chunkHeight, topChunk.getHeight(), WorldGenerator.BIOME_SMOOTH);
      }

      if (rightChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, rightChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
        chunkHeight = MathHelper.interpolate(chunkHeight, rightChunk.getHeight(), WorldGenerator.BIOME_SMOOTH);
      }

      if (bottomChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, bottomChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
        chunkHeight = MathHelper.interpolate(chunkHeight, bottomChunk.getHeight(), WorldGenerator.BIOME_SMOOTH);
      }

      if (leftChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, leftChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
        chunkHeight = MathHelper.interpolate(chunkHeight, leftChunk.getHeight(), WorldGenerator.BIOME_SMOOTH);
      }
    }

    let chunkBiome = WorldGenerator.getBiome(chunkHeight, chunkTemperature);

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

    let cloudNoise = PerlinNoiseGenerator.noise({
      size: World.ChunkSize,
      times: WorldGenerator.CLOUDS_NOISE_TIMES,
      step: WorldGenerator.CLOUDS_NOISE_STEP,
      seed: world.getSeed() * x * y * 31,
      bounds: [0, 3]
    })

    if (rightChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        rightNoise: rightChunk.heightNoise,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: rightChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })

      cloudNoise = PerlinNoiseGenerator.smoothNoise({
        noise: cloudNoise,
        rightNoise: rightChunk.cloudNoise,
        blockSmooth: 5,

        mainNoiseBounds: [0,3],
        secondNoiseBounds: [0, 3],
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    if (leftChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        leftNoise: leftChunk.heightNoise,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: leftChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })

      cloudNoise = PerlinNoiseGenerator.smoothNoise({
        noise: cloudNoise,
        leftNoise: leftChunk.cloudNoise,
        blockSmooth: 5,

        mainNoiseBounds: [0, 3],
        secondNoiseBounds: [0, 3],
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    if (topChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        topNoise: topChunk.heightNoise,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: topChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })

      cloudNoise = PerlinNoiseGenerator.smoothNoise({
        noise: cloudNoise,
        topNoise: topChunk.cloudNoise,
        blockSmooth: 5,

        mainNoiseBounds: [0, 3],
        secondNoiseBounds: [0, 3],
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    if (bottomChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        bottomNoise: bottomChunk.heightNoise,
        blockSmooth: 5,

        mainNoiseBounds: chunkBiome.getHeightBounds(),
        secondNoiseBounds: bottomChunk.getBiome().getHeightBounds(),
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })

      cloudNoise = PerlinNoiseGenerator.smoothNoise({
        noise: cloudNoise,
        bottomNoise: bottomChunk.cloudNoise,
        blockSmooth: 5,

        mainNoiseBounds: [0, 3],
        secondNoiseBounds: [0, 3],
        step: WorldGenerator.CHUNKS_HEIGHTS_SMOOTH_STEP
      })
    }

    let chunk = new Chunk(x, y, { biome: chunkBiome, temperature: chunkTemperature, height: chunkHeight, heightNoise, cloudNoise })

    for (let chunkY = 0; chunkY < World.ChunkSize[1]; chunkY++) {
      for (let chunkX = 0; chunkX < World.ChunkSize[0]; chunkX++) {
        let blockType = chunkBiome.getBlockType(heightNoise[chunkY][chunkX]);

        chunk.setBlock(chunkX, chunkY, new Block({ blockType }));
      }
    }

    return chunk;
  }
}