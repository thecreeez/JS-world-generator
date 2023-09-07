class BlockTypes {
  static DEFAULT = new Block({ red: 0, green: 0, blue: 0 })

  static OCEAN = new Block({ red: 22, green: 70, blue: 120 })
  static DEEP_OCEAN = new Block({ red: 15, green: 50, blue: 70 })

  static SAND = new Block({ red: 209, green: 245, blue: 66 })
  static STONE = new Block({ red: 120, green: 120, blue: 120 })
  static GRASS = new Block({ red: 67, green: 179, blue: 2 })
  static FOREST = new Block({ red: 5, green: 115, blue: 10 })
  
  static MOUNTAIN = new Block({ red: 100, green: 100, blue: 100 })
  static HIGH_MOUNTAIN = new Block({ red: 76, green: 76, blue: 76 })
  static SNOW_MOUNTAIN = new Block({ red: 194, green: 196, blue: 194 })

  static ONLY_RED = new Block({ red: 255, green: 0, blue: 0 })
}