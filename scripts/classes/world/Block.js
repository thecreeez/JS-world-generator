class Block {
  constructor({red = 0, green = 0, blue = 0, alpha = 1, height = 0, biome = null, blockType = null} = {}) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha;
    this._height = height;

    this._biome = biome;

    if (blockType) {
      this._red = blockType._red - blockType._red * (Math.random() / 6);
      this._green = blockType._green - blockType._green * (Math.random() / 6);
      this._blue = blockType._blue - blockType._blue * (Math.random() / 6);
    }
  }

  setBiome(biome) {
    this._biome = biome;
  }

  setColor(rgb) {
    this._red = rgb[0];
    this._green = rgb[1];
    this._blue = rgb[2];
  }

  getBiome() {
    return this._biome;
  }

  setHeight(height) {
    this._height = height;
  }

  getColor() {
    return `rgba(${this._red},${this._green},${this._blue},${this._alpha})`;
  }

  getBiomeColor() {
    if (!this.getBiome()) {
      return this.getColor();
    }
    
    return`rgba(${this.getBiome().rgb[0]},${this.getBiome().rgb[1]},${this.getBiome().rgb[2]},1)`;
  }

  getHeight() {
    return this._height;
  }

  getHeightWithBiomeHeight() {
    if (!this.getBiome()) {
      return this.getHeight();
    }

    return Math.max(this.getHeight() + this._biome.height, 0);
  }
}