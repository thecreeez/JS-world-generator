
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

window.onload = () => {
  Application.start({
    debug: true,
    ticksPerSecond: 60,
    fpsMax: 165
  });
}

function fill(x1, y1, x2, y2, blockType) {

  let xLength = Math.max(x2 + 1, x1 + 1) - Math.min(x1, x2);
  let yLength = Math.max(y2 + 1, y1 + 1) - Math.min(y1, y2);
  
  if (xLength * yLength > Application.MAX_CHANGE_BLOCKS_PER_COMMAND) {
    console.error(`Нельзя изменять так много блоков за раз! (Max:${Application.MAX_CHANGE_BLOCKS_PER_COMMAND}, Current:${xLength * yLength})`)
    return;
  }

  for (let x = Math.min(x1, x2); x < Math.max(x2 + 1, x1 + 1); x++) {
    for (let y = Math.min(y1, y2); y < Math.max(y2 + 1, y1 + 1); y++) {
      let chunkPos = MathHelper.globalToChunkPos([x,y]);
      let chunk = Application.World.getChunk(chunkPos[0], chunkPos[1]);

      if (chunk) {
        let localPos = MathHelper.globalToChunkLocalPos([x,y]);
        chunk.setBlock(localPos[0], localPos[1], blockType);
      }
    } 
  }
}