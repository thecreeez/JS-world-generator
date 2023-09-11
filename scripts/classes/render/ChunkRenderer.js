class ChunkRenderer {

  static render(chunk, canvas = null) {
    let ctx;
    if (!canvas) {
      canvas = chunk._canvas;
      ctx = chunk._canvas.getContext("2d");
    } else {
      ctx = canvas.getContext("2d");
    }

    ctx.globalAlpha = 1;
    

    let blockSize = canvas.height / (World.ChunkSize[0]) / 2;

    ctx.save();
    ctx.translate(canvas.width / 2, blockSize * World.ChunkSize[1]);
    chunk.heightNoise.forEach((noiseLine, y) => {
      noiseLine.forEach((noiseValue, x) => {
        let z = Math.max(Math.floor(noiseValue - 20),0);
        let isoPos = ChunkRenderer.cartToIso([x, y]);
        let sizeIso = ChunkRenderer.cartToIso([noiseValue * blockSize, noiseValue * blockSize]);
        ctx.fillStyle = `rgb(${chunk.getBlock(x, y).getRGBColor()[0] + 0.5 * noiseValue},${chunk.getBlock(x, y).getRGBColor()[1] + 0.5 * noiseValue},${chunk.getBlock(x, y).getRGBColor()[2] + 0.5 * noiseValue})`;
        
        ctx.beginPath();
        //ctx.moveTo(isoPos[0] * 20 + noiseValue * 10, isoPos[1] * 20 - noiseValue * 10);
        //ctx.lineTo(isoPos[0] * 20 + noiseValue * 10 + sizeIso[0], isoPos[1] * 20 - noiseValue * 10 + sizeIso[1]);
        ctx.arc(isoPos[0] * blockSize + z, isoPos[1] * blockSize - z, blockSize, 0, Math.PI * 2);
        ctx.fill();
      })
    })
    ctx.restore();
    ctx.restore();

    ctx.fillStyle = "black";
    ctx.font = "20px arial"
    ctx.fillText(`[${chunk._x},${chunk._y}]`, 0, 20);
  }

  static cartToIso(pos) {
    return [pos[0] - pos[1], (pos[0] + pos[1]) / 2];
  }

  static isoToCart(pos) {
    return [(2 * pos[1] + pos[0]) / 2, (2 * pos[1] - pos[0]) / 2];
  }
}