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
          weight: 100
        },
        {
          blockType: BlockTypes.SAND,
          weight: 5
        }
      ]
    },
    {
      name: "Beach",
      weight: 5,
      blocks: [
        {
          blockType: BlockTypes.SAND,
          weight: 0,
          name: "grass"
        },
        {
          blockType: BlockTypes.OCEAN,
          weight: 100,
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
          blockType: BlockTypes.SAND,
          weight: 200,
          name: "sand"
        },

        {
          blockType: BlockTypes.GRASS,
          weight: 1000,
          name: "grass"
        },

        {
          blockType: BlockTypes.FOREST,
          weight: 500,
          name: "forest"
        },
        {
          blockType: BlockTypes.STONE,
          weight: 500,
          name: "stone"
        },
        {
          blockType: BlockTypes.SNOW_MOUNTAIN,
          weight: 1000,
          name: "snow_hills"
        }
      ]
    }
  ]
}