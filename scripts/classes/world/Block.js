class Block {
  constructor({red = 0, green = 0, blue = 0, alpha = 1, height = 0, blockType = null} = {}) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha;
    this._height = height;

    if (blockType) {
      this._red = blockType._red - blockType._red * (Math.random() / 20);
      this._green = blockType._green - blockType._green * (Math.random() / 20);
      this._blue = blockType._blue - blockType._blue * (Math.random() / 20);
    }
  }

  setColor(rgb) {
    this._red = rgb[0];
    this._green = rgb[1];
    this._blue = rgb[2];
  }

  setHeight(height) {
    this._height = height;
  }

  getColor() {
    return `rgba(${this._red},${this._green},${this._blue},${this._alpha})`;
  }

  getRGBColor() {
    return [this._red, this._green, this._blue]
  }

  getHeight() {
    return this._height;
  }
}