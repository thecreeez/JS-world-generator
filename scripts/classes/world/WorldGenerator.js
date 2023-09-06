/**
 * СДЕЛАТЬ ОТДЕЛЬНО ВЫСОТУ И ТЕМПЕРАТУРУ И ПО НИМ ОПРЕДЕЛЯТЬ ЧАНК
 */

class WorldGenerator {
  static BIOME_SMOOTH = 0.2;

  static HEIGHT_NOISE_TIMES = 4;
  static HEIGHT_NOISE_STEP = 0.7  

  static generateChunk(world, x, y, {leftChunk, rightChunk, topChunk, bottomChunk}) {
    let random = MathHelper.createRandom(world.getSeed() * x * y);
    let chunkTemperature = MathHelper.randomInBounds(world.getBiomeBounds()[0], world.getBiomeBounds()[1], random);

    for (let i = 0; i < 10; i++) {
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
    }

    let heightNoise = PerlinNoiseGenerator.noise({
      size: World.ChunkSize,
      times: WorldGenerator.HEIGHT_NOISE_TIMES,
      step: WorldGenerator.HEIGHT_NOISE_STEP,
      seed: world.getSeed() * x * y * 30,
      bounds: world.getHeightBounds(chunkBiome)
    })

    let heightStep = 0.4

    if (rightChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        rightNoise: rightChunk.height,

        mainNoiseBounds: world.getBiomeBounds(chunkBiome),
        secondNoiseBounds: world.getBiomeBounds(rightChunk.getBiome()),
        step: heightStep
      })
    }

    if (leftChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        leftNoise: leftChunk.height,

        mainNoiseBounds: world.getBiomeBounds(chunkBiome),
        secondNoiseBounds: world.getBiomeBounds(leftChunk.getBiome()),
        step: heightStep
      })
    }

    if (topChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        topNoise: topChunk.height,

        mainNoiseBounds: world.getBiomeBounds(chunkBiome),
        secondNoiseBounds: world.getBiomeBounds(topChunk.getBiome()),
        step: heightStep
      })
    }

    if (bottomChunk) {
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        bottomNoise: bottomChunk.height,

        mainNoiseBounds: world.getBiomeBounds(chunkBiome),
        secondNoiseBounds: world.getBiomeBounds(bottomChunk.getBiome()),
        step: heightStep
      })
    }

    let chunk = new Chunk(x, y, { biome: chunkBiome, temperature: chunkTemperature, height: heightNoise })

    for (let chunkY = 0; chunkY < World.ChunkSize[1]; chunkY++) {
      for (let chunkX = 0; chunkX < World.ChunkSize[0]; chunkX++) {
        let blockType = world.getBlockType(chunkBiome, heightNoise[chunkY][chunkX]);

        chunk.setBlock(chunkX, chunkY, new Block({ blockType }));
        //chunk.setBlock(chunkX, chunkY, new Block({ blockType: chunkBiome.blocks[0].blockType }))
      }
    }

    return chunk;
  }
}