class BiomeTypes {
  static OCEAN = {
    name: "ocean",
    height: 0,
    rgb: [35, 119, 181],
    blocks: {
      VERY_DEEP_OCEAN: {
        blockType: BlockTypes.VERY_DEEP_OCEAN,
        height: 0,
        name: "ocean_deep"
      },

      DEEP_OCEAN: {
        blockType: BlockTypes.DEEP_OCEAN,
        height: 0.5,
        name: "ocean_little_deep"
      },

      OCEAN: {
        blockType: BlockTypes.OCEAN,
        height: 0.7,
        name: "ocean"
      }
    }
  }

  static DEFAULT = {
    name: "Default",
    height: 0.15,
    rgb: [67, 179, 2],
    blocks: {
      GRASS: {
        blockType: BlockTypes.GRASS,
        height: 0.2,
        name: "grass"
      },

      FOREST: {
        blockType: BlockTypes.FOREST,
        height: 0.5,
        name: "forest"
      }
    }
  }

  static HILLS = {
    name: "hills",
    height: 1,
    rgb: [194, 196, 194],
    blocks: {
      GRASS: {
        blockType: BlockTypes.GRASS,
        height: -0.4,
        name: "grass"
      },

      FOREST: {
        blockType: BlockTypes.FOREST,
        height: -0.2,
        name: "forest"
      },

      MOUNTAIN: {
        blockType: BlockTypes.MOUNTAIN,
        height: 0.3,
        name: "hills"
      },

      SNOW_MOUNTAIN: {
        blockType: BlockTypes.SNOW_MOUNTAIN,
        height: 0.6,
        name: "snow_hills"
      }
    }
  }
}