class Chunk {
  constructor(x, y, { biome, height }) {
    this._x = x;
    this._y = y;

    this._blocks = [];
    this._needToBake = false;

    this._canvas = document.createElement("canvas");
    this._canvas.width = World.ChunkSize[0] * Application.TEXTURE_SIZE;
    this._canvas.height = World.ChunkSize[1] * Application.TEXTURE_SIZE;

    this.height = height;
    this.biome = biome;
  }

  getBlock(x, y) {
    if (y < 0 || y > World.ChunkSize[1]) {
      console.error(`[GETBLOCK ERROR] y out of bounds: ${y}`)
    }

    if (x < 0 || x > World.ChunkSize[0]) {
      console.error(`[GETBLOCK ERROR] y out of bounds: ${x}`)
    } 

    if (!this._blocks[y] || !this._blocks[y][x])
      return BlockTypes.DEFAULT;

    return this._blocks[y][x];
  }

  setBlock(x, y, block) {
    if (y < 0 || y > World.ChunkSize[1]) {
      console.error(`[SETBLOCK ERROR] y out of bounds: ${y}`)
    }

    if (x < 0 || x > World.ChunkSize[0]) {
      console.error(`[SETBLOCK ERROR] y out of bounds: ${x}`)
    }

    if (!this._blocks[y])
      this._blocks[y] = [];

    this._blocks[y][x] = block;
    this._needToBake = true;
  }

  // Рендер чанка в контексте и особой позиции
  bake() {
    let ctx = this._canvas.getContext("2d");

    for (let y = 0; y < World.ChunkSize[1]; y++) {
      for (let x = 0; x < World.ChunkSize[0]; x++) {
        let block = this.getBlock(x, y);

        if (!block) {
          console.error(`Что-то пошло не так: `, block);
        }

        ctx.fillStyle = block.getColor();
        ctx.fillRect(x * Application.TEXTURE_SIZE, y * Application.TEXTURE_SIZE, Application.TEXTURE_SIZE, Application.TEXTURE_SIZE);
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);

    this._needToBake = false;
  }

  getCanvas() {
    if (this._needToBake) {
      this.bake();
    }

    return this._canvas;
  }
}