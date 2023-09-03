class Chunk {
  static Tags = {
    NeedToGenerate: "NeedToGenerate"
  }

  constructor({red = 0, green = 0, blue = 0, alpha = 1, height = 0, biome = World.Biomes.DEFAULT, tags = [], rgb = [0,0,0]} = {}) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = 1;
    this._height = height;
 
    if (rgb) {
      this._red = rgb[0];
      this._green = rgb[1];
      this._blue = rgb[2];
    }

    this._tags = tags;
    this._biome = biome;
  }

  addTag(tag) {
    if (this.hasTag(tag)) {
      return false;
    }

    this._tags.push(tag);
    return true;
  }

  hasTag(tag) {
    let bHas = false;

    this._tags.forEach((tagCandidate) => {
      if (!bHas && tagCandidate == tag) {
        bHas = true;
      }
    })

    return bHas;
  }

  removeTag(tag) {
    if (!this.hasTag(tag)) {
      return false;
    }

    this._tags = this._tags.filter((tagCandidate) => tagCandidate != tag)
    return true;
  }

  setBiome(biome) {
    this._biome = biome;

    if (this.hasTag(Chunk.Tags.NeedToGenerate)) {
      this.setColor(biome.rgb);
    }
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