class Biome {
  /**
   * @param {Block} blockType 
   * @param {Number} height 
   * @returns blockGenerateSettings for adding to biomes
   */
  static createBlockGenerateSettings(blockType, height) {
    return {
      blockType,
      height
    };
  }

  constructor({ id, heightWeight, temperatureWeight, blockHeightNaturalBounds, blocks = [], color = [0,0,0], biomeBlockType = null }) {
    this._id = id;
    this._weights = {
      height: heightWeight,
      temperature: temperatureWeight
    }

    this._blockBounds = blockHeightNaturalBounds;
    this._blocks = blocks;
    this._color = color;

    if (biomeBlockType)
      this._color = biomeBlockType.getRGBColor();
  }

  /**
   * @param {Number} height
   * @returns {Block}
   */
  getBlockType(height) {
    let biomeBlockType = BlockTypes.DEFAULT;

    let blockTypeValue = 0;
    this._blocks.forEach((blockGenerateSettings) => {
      blockTypeValue += blockGenerateSettings.height;

      if (biomeBlockType == BlockTypes.DEFAULT && height <= blockTypeValue) {
        biomeBlockType = blockGenerateSettings.blockType;
      }
    })

    return biomeBlockType;
  }

  /**
   * @param {Object} blockGenerateSettings generates by {@link Biome.createBlockGenerateSettings}
   * @returns {Biome}
   */
  addBlock(blockGenerateSettings) {
    this._blocks.push(blockGenerateSettings);

    //if (this._getMaxBlockHeight() > this._blockBounds[1]) {
    //  this._blockBounds[1] = this._getMaxBlockHeight();
    //}

    return this;
  }

  getHeight() {
    return this._weights.height;
  }

  getTemperature() {
    return this._weights.temperature;
  }

  getHeightBounds() {
    let min = 0;

    return [min, this._getMaxBlockHeight()];
  }

  getNaturalBounds() {
    return this._blockBounds;
  }

  getColor() {
    return `rgb(${this._color[0]},${this._color[1]},${this._color[2]})`;
  }

  _getMaxBlockHeight() {
    let blockHeight = 0;
    this._blocks.forEach((blockGenerateSettings) => {
      blockHeight += blockGenerateSettings.height;
    })
    return blockHeight;
  }
}