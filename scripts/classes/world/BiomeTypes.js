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
    })
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.DEEP_OCEAN, 10))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.OCEAN, 10))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SAND, 120))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.GRASS, 110))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.MOUNTAIN, 100))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.HIGH_MOUNTAIN, 100)),

    new Biome({
      id: "plain",
      heightWeight: 20,
      temperatureWeight: 100,
      blockHeightNaturalBounds: [15, 40]
    })
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.OCEAN, 20))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SAND, 40))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.GRASS, 60)),
    new Biome({
      id: "mountains",
      heightWeight: 10,
      temperatureWeight: 10,
      blockHeightNaturalBounds: [120, 430],
    })
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SAND, 40))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.GRASS, 70))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.MOUNTAIN, 100))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.HIGH_MOUNTAIN, 60))
      .addBlock(Biome.createBlockGenerateSettings(BlockTypes.SNOW_MOUNTAIN, 40))
  ]
}