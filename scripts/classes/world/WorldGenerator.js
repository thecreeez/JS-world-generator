/**
 * СДЕЛАТЬ ОТДЕЛЬНО ВЫСОТУ И ТЕМПЕРАТУРУ И ПО НИМ ОПРЕДЕЛЯТЬ ЧАНК
 */

class WorldGenerator {
  static BIOME_SMOOTH = 0.4;

  static HEIGHT_NOISE_TIMES = 7;
  static HEIGHT_NOISE_STEP = 0.6

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
    let chunkTemperature = MathHelper.randomInBounds(world.getBiomeBounds()[0], world.getBiomeBounds()[1], random);

    for (let i = 0; i < 1; i++) {
      if (topChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, topChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }

      if (rightChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, rightChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }

      if (bottomChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, bottomChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }

      if (leftChunk) {
        chunkTemperature = MathHelper.interpolate(chunkTemperature, leftChunk.getTemperature(), WorldGenerator.BIOME_SMOOTH);
      }
    }

    let chunkBiome = world.getBiome(chunkTemperature);

    if (!chunkBiome) {
      console.log(chunkTemperature)
      return;
    }

    let heightNoise = PerlinNoiseGenerator.noise({
      size: World.ChunkSize,
      times: WorldGenerator.HEIGHT_NOISE_TIMES,
      step: WorldGenerator.HEIGHT_NOISE_STEP,
      seed: world.getSeed() * x * y * 30,
      bounds: [chunkBiome.minBlockNatural, chunkBiome.maxBlockNatural]
    })

    let heightStep = 0.6;

    if (rightChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        rightNoise: rightChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: world.getHeightBounds(chunkBiome),
        secondNoiseBounds: world.getHeightBounds(rightChunk.getBiome()),
        step: heightStep
      })
    }

    if (leftChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        leftNoise: leftChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: world.getHeightBounds(chunkBiome),
        secondNoiseBounds: world.getHeightBounds(leftChunk.getBiome()),
        step: heightStep
      })
    }

    if (topChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        topNoise: topChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: world.getHeightBounds(chunkBiome),
        secondNoiseBounds: world.getHeightBounds(topChunk.getBiome()),
        step: heightStep
      })
    }

    if (bottomChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        bottomNoise: bottomChunk.height,
        blockSmooth: 5,

        mainNoiseBounds: world.getHeightBounds(chunkBiome),
        secondNoiseBounds: world.getHeightBounds(bottomChunk.getBiome()),
        step: heightStep
      })
    }

    let chunk = new Chunk(x, y, { biome: chunkBiome, temperature: chunkTemperature, height: heightNoise })

    for (let chunkY = 0; chunkY < World.ChunkSize[1]; chunkY++) {
      for (let chunkX = 0; chunkX < World.ChunkSize[0]; chunkX++) {
        let blockType = world.getBlockType(chunkBiome, heightNoise[chunkY][chunkX]);

        chunk.setBlock(chunkX, chunkY, new Block({ blockType }));
      }
    }

    return chunk;
  }
}