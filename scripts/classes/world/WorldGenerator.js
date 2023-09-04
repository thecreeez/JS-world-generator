class WorldGenerator {
  static BIOME_NOISE_TIMES = 20;
  static BIOME_NOISE_STEP = 0.4;

  static HEIGHT_NOISE_TIMES = 6;
  static HEIGHT_NOISE_STEP = 0.1

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

    WorldGenerator.generateChunk(world)
    
  }

  static generateChunk(world, x, y, {leftChunk, rightChunk}) {
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

    if (rightChunk) {
      biomeNoise = PerlinNoiseGenerator.smoothNoise({
        noise: biomeNoise,
        rightNoise: rightChunk.biome,
        step: 0.65
      })
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        rightNoise: rightChunk.height,
        step: 0.3
      })
    }

    if (leftChunk) {
      biomeNoise = PerlinNoiseGenerator.smoothNoise({
        noise: biomeNoise,
        leftNoise: leftChunk.biome,
        step: 0.65
      })
      heightNoise = PerlinNoiseGenerator.smoothNoise({
        noise: heightNoise,
        leftNoise: leftChunk.height,
        step: 0.3
      })
    }

    

    let chunk = new Chunk(x, y, { biome: biomeNoise, height: heightNoise })

    /**
     * 1) Шумы V
     * 2) Сглаживание соседними
     * 3) Биомы
     * 4) Высоты
     */

    for (let chunkY = 0; chunkY < World.ChunkSize[1]; chunkY++) {
      for (let chunkX = 0; chunkX < World.ChunkSize[0]; chunkX++) {
        let biome = world.getBiome(biomeNoise[chunkY][chunkX]);
        let blockType = world.getBlockType(biome, heightNoise[chunkY][chunkX]);

        chunk.setBlock(chunkX, chunkY, new Block({ blockType, biome: biome}))

        //chunk.setBlock(chunkX, chunkY, new Block({ red: heightNoise[chunkY][chunkX] * 255, green: heightNoise[chunkY][chunkX] * 255, blue: heightNoise[chunkY][chunkX] * 255 }))
      }
    }

    return chunk;
  }
}