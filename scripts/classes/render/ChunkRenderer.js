class ChunkRenderer {
  static render(world) {
    let [x,y] = [0,0];

    let heightNoise = PerlinNoiseGenerator.noise({
      size: World.ChunkSize,
      times: WorldGenerator.HEIGHT_NOISE_TIMES,
      step: WorldGenerator.HEIGHT_NOISE_STEP,
      seed: world.getSeed() * x * y * 30,
      bounds: [0, 10]
    })

    PerlinNoiseGenerator.manipulateWithValues(heightNoise, Math.floor);

    let chunk = new Chunk(x, y, { heightNoise, world })
    
    chunk.heightNoise.forEach((noiseLine, y) => {
      noiseLine.forEach((noiseValue, x) => {
        let isoPos = ChunkRenderer.cartToIso([x, y]);
        ctx.fillStyle = `rgba(${noiseValue * 25},${noiseValue * 25},${noiseValue * 25}, 1)`;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 - 100);
        ctx.beginPath();
        console.log(isoPos)
        ctx.arc(isoPos[0] * 20 + noiseValue * 10, isoPos[1] * 20 + noiseValue * 10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      })
    })
  }

  static cartToIso(pos) {
    return [pos[0] - pos[1], (pos[0] + pos[1]) / 2];
  }

  static isoToCart(pos) {
    return [(2 * pos[1] + pos[0]) / 2, (2 * pos[1] - pos[0]) / 2];
  }
}