
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

window.onload = () => {
  //Application.start({
  //  debug: true,
  //  ticksPerSecond: 60,
  //  fpsMax: 165
  //});

  let world = new World({  })
  ChunkRenderer.render(world);
}

/**
 * Fill blocks in range to blockType
 * 
 * Example: fill(-100, 100, -100, 100, BlockTypes.ONLY_RED)
 * @param {Integer} x1 
 * @param {Integer} y1 
 * @param {Integer} x2 
 * @param {Integer} y2 
 * @param {Block} blockType 
 */
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

/**
 * Fills blocks in [x1,x2] size to blockType with function
 * 
 * Example: fillByFunction((x) => Math.sin(x / 5) * 5, -100, 100, BlockTypes.ONLY_RED)
 * @param {Function} func 
 * @param {Integer} x1 
 * @param {Integer} x2 
 * @param {Block} blockType 
 */
function fillByFunction(func, x1, x2, blockType) {
  let prevHeight = null;
  for (let x = Math.min(x1, x2); x < Math.max(x1,x2); x++) {
    let pos = [x, Math.round(func(x))];

    let chunkPos = MathHelper.globalToChunkPos(pos);
    let localPos = MathHelper.globalToChunkLocalPos(pos);

    let chunk = Application.World.getChunk(chunkPos[0], chunkPos[1]);

    if (chunk) {
      chunk.setBlock(localPos[0], localPos[1], blockType);

      for (let y = Math.min(pos[1], prevHeight); y < Math.max(pos[1], prevHeight); y++) {
        let chunkPos = MathHelper.globalToChunkPos([pos[0], y]);
        let localPos = MathHelper.globalToChunkLocalPos([pos[0], y]);

        let chunk = Application.World.getChunk(chunkPos[0], chunkPos[1]);

        if (chunk) {
          chunk.setBlock(localPos[0], localPos[1], blockType);
        }
      }

      prevHeight = pos[1];
    }
  }
}