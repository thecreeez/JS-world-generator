class BiomeTypes {
  static DEFAULT_BIOMES = [
    {
      name: "deep_ocean",
      weight: 110,
      blocks: [
        {
          blockType: BlockTypes.DEEP_OCEAN,
          weight: 2000
        },
        {
          blockType: BlockTypes.OCEAN,
          weight: 100
        }
      ]
    },
    {
      name: "ocean",
      weight: 50,
      blocks: [
        {
          blockType: BlockTypes.OCEAN,
          weight: 2100
        },
        {
          blockType: BlockTypes.SAND,
          weight: 500
        }
      ]
    },
    {
      name: "Beach",
      weight: 140,
      blocks: [
        {
          blockType: BlockTypes.SAND,
          weight: 0,
          name: "grass"
        },
        {
          blockType: BlockTypes.OCEAN,
          weight: 2100,
          name: "ocean"
        },

        {
          blockType: BlockTypes.SAND,
          weight: 100,
          name: "sand"
        },
      ]
    },
    {
      name: "Default",
      weight: 140,
      blocks: [
        {
          blockType: BlockTypes.GRASS,
          weight: 0,
          name: "grass"
        },
        {
          blockType: BlockTypes.OCEAN,
          weight: 2600,
          name: "ocean"
        },

        {
          blockType: BlockTypes.GRASS,
          weight: 5000,
          name: "grass"
        },

        {
          blockType: BlockTypes.FOREST,
          weight: 10000,
          name: "forest"
        },
        {
          blockType: BlockTypes.STONE,
          weight: 15000,
          name: "stone"
        },
        {
          blockType: BlockTypes.SNOW_MOUNTAIN,
          weight: 10000,
          name: "snow_hills"
        }
      ]
    }
  ]
}