class BiomeTypes {
  static DEFAULT_BIOMES = [
    {
      name: "deep_ocean",
      weight: 300,
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
      weight: 300,
      blocks: [
        {
          blockType: BlockTypes.OCEAN,
          weight: 2100
        },
        {
          blockType: BlockTypes.SAND,
          weight: 100
        }
      ]
    },
    {
      name: "Beach",
      weight: 100,
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
          weight: 2000,
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
          weight: 8000,
          name: "grass"
        },

        {
          blockType: BlockTypes.FOREST,
          weight: 4000,
          name: "forest"
        },
        {
          blockType: BlockTypes.STONE,
          weight: 8000,
          name: "stone"
        },
        {
          blockType: BlockTypes.SNOW_MOUNTAIN,
          weight: 7000,
          name: "snow_hills"
        }
      ]
    }
  ]
}