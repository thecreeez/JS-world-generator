class ChunkStorage {
  static OCEAN_DEEP = { rgb: [15, 50, 70], height: -0.4 }
  static OCEAN_LITTLE_DEEP = { rgb: [22, 70, 120], height: -0.15 }
  static OCEAN = { rgb: [35, 119, 181], height: 0 }

  static BEACH = { rgb: [226, 230, 7], height: 0.2 }
  static BEACH_GRASS = { rgb: [120, 200, 5], height: 0.3 }
  static GRASS = { rgb: [67, 179, 2], height: 0.4}
  static FOREST = { rgb: [5, 115, 10], height: 0.5 }

  static MOUNTAIN = { rgb: [76, 76, 76], height: 0.7 }
  static SNOW_MOUNTAIN = { rgb: [194, 196, 194], height: 0.75 }

  //static ZERO_AND_ABOVE = { rgb: [255, 0, 0], height: 0.2 }
  //static ONE_AND_ABOVE = {rgb: [0,0,0], height: 1}

  static getAll() {
    let chunkTypes = [];

    for (let type in this) {
      chunkTypes.push({
        type: type,
        rgb: ChunkStorage[type].rgb,
        defaultHeight: ChunkStorage[type].height
      })
    }

    return chunkTypes;
  }
}