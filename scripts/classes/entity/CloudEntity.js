class CloudEntity extends Entity {
  constructor({world, pos, seed}) {
    super({
      world,
      pos,
      type: "cloud"
    })

    this._blockSize = 20;

    if (Math.random() > 0.5) {
      this._blockSize = this._blockSize / 2;
      this._isHigher = true;
    }

    this._noise = PerlinNoiseGenerator.noise(MathHelper.randomInt(1, 2, Math.random), MathHelper.randomInt(1,2,Math.random), 10, 0.05, seed);
  }

  render() {
    this._noise.forEach((blockLine, y) => {
      blockLine.forEach((blockValue, x) => {
        if (Math.abs(blockValue) > 0.3) {
          ctx.fillStyle = `rgba(255,255,255,0.25)`

          if (this._isHigher)
            ctx.fillStyle = `rgba(110,110,110,0.1)`

          ctx.fillRect(this._pos[0] + this._blockSize * x, this._pos[1] + this._blockSize * y, this._blockSize, this._blockSize);
        }
      })
    })
  }

  update() {
    this._pos[0] -= 1 * World.TICK_SPEED;

    // Если за краями
    if (this._pos[0] + (this._noise[0].length + 1) * this._blockSize < 0) {
      this.needToRemove = true;
    }
  }
}