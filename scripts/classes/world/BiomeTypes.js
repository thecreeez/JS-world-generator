class BiomeTypes {
  /**
   * OCEANLINE: 20
   */
  static DEFAULT_BIOMES = [
    new Biome({
      id: "ocean",
      heightWeight: 100,
      temperatureWeight: 100,
      blockHeightNaturalBounds: [0, 20],
      biomeBlockType: BlockTypes.OCEAN
    })
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.DEEP_OCEAN, 10))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.OCEAN, 10))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SAND, 120))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.GRASS, 110))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.MOUNTAIN, 100))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.HIGH_MOUNTAIN, 100)),

    new Biome({
      id: "ocean_plain",
      heightWeight: 40,
      temperatureWeight: 100,
      blockHeightNaturalBounds: [10, 40],
      biomeBlockType: BlockTypes.SAND
    })
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.OCEAN, 20))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SAND, 40))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.GRASS, 60)),

    new Biome({
      id: "plain",
      heightWeight: 40,
      temperatureWeight: 100,
      blockHeightNaturalBounds: [15, 40],
      biomeBlockType: BlockTypes.GRASS
    })
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.OCEAN, 20))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SAND, 40))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.GRASS, 60)),
    new Biome({
      id: "mountains",
      heightWeight: 10,
      temperatureWeight: 10,
      blockHeightNaturalBounds: [50, 240],
      biomeBlockType: BlockTypes.GRASS
    })
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.OCEAN, 20))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SAND, 80))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.GRASS, 80))
  ]
}