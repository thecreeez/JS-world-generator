class WorldGenerator {
  static init(world) {
    world.WorldGeneratorCache = {
      slice: [0, 0]
    };

    world.WorldGeneratorCache.noises = {
      BIOME: PerlinNoiseGenerator.noise({
        size: world._size,
        times: 20,
        step: 0.4,
        seed: world._seed * 2,
      }),
      CHUNKS: PerlinNoiseGenerator.noise({
        size: world._size,
        times: 6,
        step: 0.1,
        seed: world._seed * 5,
      })
    }

    world._chunks = [];
    world.setState(World.States.GENERATING);
  }

  static generate(world) {
    if (!world.WorldGeneratorCache) {
      console.error("world.WorldGeneratorCache isnt exist.")
      world.setState(World.States.INIT);
    }

    for (let i = 0; i < Application.CHUNK_GENERATION_PER_TICK; i++) {
      if (world.getState() != World.States.IDLE)
        WorldGenerator._generateAndMeshChunk(world);
    }
  }

  static _generateAndMeshChunk(world) {
    WorldGenerator.generateSlice(world, world.WorldGeneratorCache.slice[0], world.WorldGeneratorCache.slice[1]);
    WorldGenerator.bakeSlice(world, world.WorldGeneratorCache.slice[0], world.WorldGeneratorCache.slice[1]);

    world.WorldGeneratorCache.slice[0]++;

    if (world.WorldGeneratorCache.slice[0] >= Math.floor(world._size[0] / World.SliceSize[0])) {
      world.WorldGeneratorCache.slice[0] = 0;
      world.WorldGeneratorCache.slice[1]++;
    }

    if (world.WorldGeneratorCache.slice[1] >= Math.floor(world._size[0] / World.SliceSize[1])) {
      world.setState(World.States.IDLE);
    }
  }

  static generateSlice(world, x, y) {
    if (!world.WorldGeneratorCache) {
      console.error(`cant generate slice. WorldGeneratorCache isnt exist.`);
      world.setState(World.States.INIT);
    }

    let noises = world.WorldGeneratorCache.noises;

    for (let localY = 0; localY < World.SliceSize[1]; localY++) {
      let globalY = World.SliceSize[1] * y + localY;
      if (!world.getChunks()[globalY]) {
        world.getChunks()[globalY] = [];
      }

      for (let localX = 0; localX < World.SliceSize[0]; localX++) {
        let globalX = World.SliceSize[0] * x + localX;

        let biome = world.getBiome(noises.BIOME[globalY][globalX]);
        let height = noises.CHUNKS[globalY][globalX];
        let chunkType = world.getChunkType(biome, height)

        world.setChunk(globalX, globalY, new Chunk({
          biome,
          height,
          rgb: chunkType.rgb
        }))
      }
    }
  }

  static bakeSlice(world, x, y) {
    if (!world._cache) {
      let chunkSize = world.getChunkSize();

      world._cache = document.createElement("canvas");
      world._cache.width = chunkSize * world._size[0];
      world._cache.height = chunkSize * world._size[1];
    }

    let ctx = world._cache.getContext("2d");

    for (let localY = 0; localY < World.SliceSize[1]; localY++) {
      let globalY = World.SliceSize[1] * y + localY;
      if (!world.getChunks()[globalY]) {
        world.getChunks()[globalY] = [];
      }

      for (let localX = 0; localX < World.SliceSize[0]; localX++) {
        let globalX = World.SliceSize[0] * x + localX;

        let chunk = world.getChunk(globalX, globalY);

        ctx.fillStyle = chunk.getColor();
        ctx.fillRect(globalX * world.getChunkSize(), globalY * world.getChunkSize(), world.getChunkSize(), world.getChunkSize());
      }
    }
  }
}