class Chunk {
  constructor(x, y, { height, biome, temperature }) {
    this._x = x;
    this._y = y;

    this._blocks = [];
    this._needToBake = false;

    this._canvas = document.createElement("canvas");
    this._canvas.width = World.ChunkSize[0] * Application.TEXTURE_SIZE;
    this._canvas.height = World.ChunkSize[1] * Application.TEXTURE_SIZE;

    this.height = height;

    this.biome = biome;
    this.temperature = temperature;

    this.animationTime = 500 / (Application.World.camera.getSpeed() != 0 ? Application.World.camera.getSpeed() : 1);
    this.currentAnimationTime = this.animationTime;
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
      return
    }

    if (x < 0 || x > World.ChunkSize[0]) {
      console.error(`[SETBLOCK ERROR] x out of bounds: ${x}`)
      return
    }

    if (!this._blocks[y])
      this._blocks[y] = [];

    this._blocks[y][x] = block;
    this._needToBake = true;
  }

  getChunkPos() {
    return [this._x, this._y];
  }

  // Рендер чанка в контексте и особой позиции
  _bake({ renderType = Camera.RENDER_TYPES.DEFAULT, alpha = 0} = {}) {
    let ctx = this._canvas.getContext("2d");

    for (let y = 0; y < World.ChunkSize[1]; y++) {
      for (let x = 0; x < World.ChunkSize[0]; x++) {
        let block = this.getBlock(x, y);

        if (!block) {
          console.error(`Что-то пошло не так: `, block);
        }

        switch (renderType) {
          case Camera.RENDER_TYPES.DEFAULT: ctx.fillStyle = block.getColor(); break;
          case Camera.RENDER_TYPES.HEIGHTS: {let color = this.height[y][x] / this.getBiome().getNaturalBounds()[1] * 255; ctx.fillStyle = `rgb(${color}, ${color}, ${color})`; break};
          case Camera.RENDER_TYPES.BIOMES: {let color = this.getBiome().getColor(); ctx.fillStyle = color; break};
        }
         
        ctx.fillRect(x * Application.TEXTURE_SIZE, y * Application.TEXTURE_SIZE, Application.TEXTURE_SIZE, Application.TEXTURE_SIZE);
      }
    }

    if (Application.DEBUG_MODE) {
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);
    }

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this._renderType = renderType;
    this._needToBake = false;

    Application.EventBus.invoke(EventType.ON_CHUNK_BAKE, this);
    let adjacentChunks = Application.World.getAdjacentChunks(this._x, this._y);

    for (const side in adjacentChunks) {
      if (adjacentChunks[side])
        Application.EventBus.invoke(EventType.ON_NEARBY_CHUNK_BAKE, { chunk: adjacentChunks[side], side, baked: this });
    }
  }

  setNeedToBake(value) {
    this._needToBake = value;
  }

  getCanvas(renderType = Camera.RENDER_TYPES.DEFAULT) {
    if (this._needToBake) {
      this._bake({ renderType });
    }

    if (Camera.RENDER_TYPE != this._renderType) {
      this._bake({ renderType });
    }

    if (this.currentAnimationTime > 0) {
      this.currentAnimationTime--;
    }

    return this._canvas;
  }

  getTemperature() {
    return this.temperature;
  }

  getBiome() {
    return this.biome;
  }
}