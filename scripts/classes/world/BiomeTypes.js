class BiomeTypes {
  static ICE_LAKE = {
    name: "ice_lake",
    height: -0.75,
    rgb: [0,60,0],
    blocks: {
      ICE: {
        blockType: new Block({ red: 111, green: 167, blue: 199 }),
        height: 1,
        name: "ice"
      }
    }
  }

  static ICE_LAND = {
    name: "ice_land",
    height: -0.3,
    blocks: {
      SNOW: {
        blockType: new Block({ red: 201, green: 201, blue: 201 }),
        height: 0,
        name: "snow"
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

      //GRASS: {
      //  blockType: new Block({ red: 112, green: 47, blue: 0 }),
      //  height: 1,
      //  name: "grass"
      //}
    }
  }

  static OCEAN = {
    name: "ocean",
    height: 0.2,
    rgb: [35, 119, 181],
    blocks: {
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
    height: 0.65,
    rgb: [67, 179, 2],
    blocks: {
      DEEP_OCEAN: {
        blockType: BlockTypes.DEEP_OCEAN,
        height: -0.2,
        name: "ocean_little_deep"
      },

      OCEAN: {
        blockType: BlockTypes.OCEAN,
        height: 0,
        name: "ocean"
      },

      SAND: {
        blockType: BlockTypes.SAND,
        height: 0.2,
        name: "sand"
      },

      GRASS: {
        blockType: BlockTypes.GRASS,
        height: 0.6,
        name: "grass"
      },

      STONE: {
        blockType: BlockTypes.STONE,
        height: 0.7,
        name: "stone"
      },

      FOREST: {
        blockType: BlockTypes.FOREST,
        height: 1,
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