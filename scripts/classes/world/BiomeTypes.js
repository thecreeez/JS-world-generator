class BiomeTypes {
  static DEFAULT_BIOMES = [
    {
      name: "ocean",
      weight: 100,
      minBlockNatural: 0,
      maxBlockNatural: 20,
      blocks: [
        {
          blockType: BlockTypes.DEEP_OCEAN,
          weight: 10
        },
        {
          blockType: BlockTypes.OCEAN,
          weight: 10
        },
        {
          blockType: BlockTypes.SAND,
          weight: 120
        },
        {
          blockType: BlockTypes.GRASS,
          weight: 110
        },
        {
          blockType: BlockTypes.MOUNTAIN,
          weight: 100
        },
        {
          blockType: BlockTypes.HIGH_MOUNTAIN,
          weight: 100
        }
      ]
    },
    {
      name: "plain",
      weight: 10,
      minBlockNatural: 21,
      maxBlockNatural: 140,
      blocks: [
        {
          blockType: BlockTypes.OCEAN,
          weight: 20
        },
        {
          blockType: BlockTypes.SAND,
          weight: 40
        },
        {
          blockType: BlockTypes.GRASS,
          weight: 70
        },
        {
          blockType: BlockTypes.FOREST,
          weight: 70
        },
        //{
        //  blockType: BlockTypes.MOUNTAIN,
        //  weight: 70
        //},
        //{
        //  blockType: BlockTypes.SNOW_MOUNTAIN,
        //  weight: 20
        //},
      ]
    },
    //{
    //  name: "mountains",
    //  weight: 10,
    //  minBlockNatural: 120,
    //  maxBlockNatural: 430,
    //  blocks: [
    //    {
    //      blockType: BlockTypes.OCEAN,
    //      weight: 20
    //    },
    //    {
    //      blockType: BlockTypes.SAND,
    //      weight: 40
    //    },
    //    {
    //      blockType: BlockTypes.GRASS,
    //      weight: 70
    //    },
    //    {
    //      blockType: BlockTypes.MOUNTAIN,
    //      weight: 100
    //    },
    //    {
    //      blockType: BlockTypes.HIGH_MOUNTAIN,
    //      weight: 60
    //    },
    //    {
    //      blockType: BlockTypes.SNOW_MOUNTAIN,
    //      weight: 40
    //    },
    //  ]
    //}
  ]
}