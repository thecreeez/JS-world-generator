class WorldGenerator {
  static Debug = {
    TICK_TIME_TO_GENERATE: 0,
    TICK_TIME_TO_BAKE: 0,
  }

  static init(world) {
    world.WorldGeneratorCache = {
      slice: [0, 0]
    };

    world.WorldGeneratorCache.noises = {
      BIOMES: PerlinNoiseGenerator.noise({
        size: [world._size[0], world._size[1]],
        times: 20,
        step: 0.4,
        seed: world._seed * 2,
      }),
      BLOCKS: PerlinNoiseGenerator.noise({
        size: world._size,
        times: 6,
        step: 0.1,
        seed: world._seed * 5,
      })
    }

    world._blocks = [];
    world.setState(World.States.GENERATING);
  }

  static generate(world) {
    if (!world.WorldGeneratorCache) {
      console.error("world.WorldGeneratorCache isnt exist.")
      world.setState(World.States.INIT);
    }

    for (let i = 0; i < Application.CHUNK_GENERATION_PER_TICK; i++) {
      if (world.getState() != World.States.IDLE) {
        WorldGenerator.generateSlice(world, world.WorldGeneratorCache.slice[0], world.WorldGeneratorCache.slice[1]);
        WorldGenerator.bakeSlice(world, world.WorldGeneratorCache.slice[0], world.WorldGeneratorCache.slice[1]);

        // Считает/Переходит на следующие чанки (куски)
        world.WorldGeneratorCache.slice[0]++;

        if (world.WorldGeneratorCache.slice[0] >= Math.floor(world._size[0] / World.SliceSize[0])) {
          world.WorldGeneratorCache.slice[0] = 0;
          world.WorldGeneratorCache.slice[1]++;
        }

        if (world.WorldGeneratorCache.slice[1] >= Math.floor(world._size[0] / World.SliceSize[1])) {
          world.setState(World.States.IDLE);
        }
      }
    }
  }

  static generateSlice(world, x, y) {
    if (!world.WorldGeneratorCache) {
      console.error(`cant generate slice. WorldGeneratorCache isnt exist.`);
      world.setState(World.States.INIT);
    }

    let timestomp = Date.now();
    Application.EventBus.invoke(EventBus.TYPES.UPDATE_BLOCK_GENERATE_START, { x, y })

    let noises = world.WorldGeneratorCache.noises;

    for (let localY = 0; localY < World.SliceSize[1]; localY++) {
      let globalY = World.SliceSize[1] * y + localY;
      if (!world.getBlocks()[globalY]) {
        world.getBlocks()[globalY] = [];
      }

      for (let localX = 0; localX < World.SliceSize[0]; localX++) {
        let globalX = World.SliceSize[0] * x + localX;

        let biome = world.getBiome(noises.BIOMES[globalY][globalX]);
        let height = noises.BLOCKS[globalY][globalX];
        let blockType = world.getBlockType(biome, height)

        world.setBlock(globalX, globalY, new Block({
          biome,
          height,
          rgb: blockType.rgb
        }))
      }
    }
    Application.EventBus.invoke(EventBus.TYPES.UPDATE_BLOCK_GENERATE_START, { x, y })
    WorldGenerator.Debug.TICK_TIME_TO_GENERATE += Date.now() - timestomp;
  }

  static bakeSlice(world, x, y) {
    if (!world._cache) {
      let chunkSize = world.getBlockSize();

      world._cache = document.createElement("canvas");
      world._cache.width = chunkSize * world._size[0];
      world._cache.height = chunkSize * world._size[1];
    }

    let timestomp = Date.now();
    let ctx = world._cache.getContext("2d");

    for (let localY = 0; localY < World.SliceSize[1]; localY++) {
      let globalY = World.SliceSize[1] * y + localY;
      if (!world.getBlocks()[globalY]) {
        world.getBlocks()[globalY] = [];
      }

      for (let localX = 0; localX < World.SliceSize[0]; localX++) {
        let globalX = World.SliceSize[0] * x + localX;

        let block = world.getBlock(globalX, globalY);

        ctx.fillStyle = block.getColor();
        ctx.fillRect(globalX * world.getBlockSize(), globalY * world.getBlockSize(), world.getBlockSize(), world.getBlockSize());
      }
    }

    WorldGenerator.Debug.TICK_TIME_TO_BAKE += Date.now() - timestomp;
  }
}