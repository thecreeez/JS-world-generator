class WorldGenerator {
  static BIOME_NOISE_TIMES = 20;
  static BIOME_NOISE_STEP = 0.4;

  static HEIGHT_NOISE_TIMES = 10;
  static HEIGHT_NOISE_STEP = 0.6  

  static init(world) {
    world._chunks = [];
    world._noises = {};

    world.setState(World.States.GENERATING);
  }

  static generate(world) {
    if (!world._chunks) {
      console.error("world.WorldGeneratorCache isnt exist.")
      world.setState(World.States.INIT);
    }
  }

  static generateChunk(world, x, y, {leftChunk, rightChunk, topChunk, bottomChunk}) {
    let biomeNoise = PerlinNoiseGenerator.noise({
      size: World.ChunkSize,
      times: WorldGenerator.BIOME_NOISE_TIMES,
      step: WorldGenerator.BIOME_NOISE_STEP,
      seed: world.getSeed() * x * y
    })

    let heightNoise = PerlinNoiseGenerator.noise({
      size: World.ChunkSize,
      times: WorldGenerator.HEIGHT_NOISE_TIMES,
      step: WorldGenerator.HEIGHT_NOISE_STEP,
      seed: world.getSeed() * x * y * 30
    })

    let biomeStep = 0.7;
    let heightStep = 0.4

    if (rightChunk) {
      biomeNoise = PerlinNoiseGenerator.smoothNoise({
        noise: biomeNoise,
        rightNoise: rightChunk.biome,
        step: biomeStep
      })
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        rightNoise: rightChunk.height,
        step: heightStep
      })
    }

    if (leftChunk) {
      biomeNoise = PerlinNoiseGenerator.smoothNoise({
        noise: biomeNoise,
        leftNoise: leftChunk.biome,
        step: biomeStep
      })
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        leftNoise: leftChunk.height,
        step: heightStep
      })
    }

    if (topChunk) {
      biomeNoise = PerlinNoiseGenerator.smoothNoise({
        noise: biomeNoise,
        topNoise: topChunk.biome,
        step: biomeStep
      })
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        topNoise: topChunk.height,
        step: heightStep
      })
    }

    if (bottomChunk) {
      biomeNoise = PerlinNoiseGenerator.smoothNoise({
        noise: biomeNoise,
        bottomNoise: bottomChunk.biome,
        step: biomeStep
      })
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        bottomNoise: bottomChunk.height,
        step: heightStep
      })
    }

    let chunk = new Chunk(x, y, { biome: biomeNoise, height: heightNoise })

    for (let chunkY = 0; chunkY < World.ChunkSize[1]; chunkY++) {
      for (let chunkX = 0; chunkX < World.ChunkSize[0]; chunkX++) {
        let biome = world.getBiome(biomeNoise[chunkY][chunkX]);
        let blockType = world.getBlockType(biome, heightNoise[chunkY][chunkX]);

        chunk.setBlock(chunkX, chunkY, new Block({ blockType, biome: biome}));
        //chunk.setBlock(chunkX, chunkY, new Block({ red: biomeNoise[chunkY][chunkX] * 255, green: biomeNoise[chunkY][chunkX] * 255, blue: biomeNoise[chunkY][chunkX] * 255 }))
      }
    }

    return chunk;
  }
}