class Chunk {
  constructor({red, green, blue, alpha}) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha;

    if (!this._alpha)
      this._alpha = 1;
  }

  getColor() {
    return `rgba(${this._red},${this._green},${this._blue},${this._alpha})`;
  }
}