
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
  //  ticksPerSecond: 1000,
  //  fpsMax: 144
  //});

  let world = new World();

  let leftChunk = WorldGenerator.generateChunk(world, -1, 0, {});
  let chunk = WorldGenerator.generateChunk(world, 0, 0, { leftChunk });
  let rightChunk = WorldGenerator.generateChunk(world, 1, 0, { leftChunk: chunk });

  //let topChunk = WorldGenerator.generateChunk(world, 0, 1, {});
  //let bottomChunk = WorldGenerator.generateChunk(world, 0, -1, {});


  ctx.drawImage(chunk.getCanvas(), 250, 250, 250, 250)
  //ctx.drawImage(topChunk.getCanvas(), 250, 0, 250, 250)
  //ctx.drawImage(bottomChunk.getCanvas(), 250, 500, 250, 250)

  ctx.drawImage(leftChunk.getCanvas(), 0, 250, 250, 250)
  ctx.drawImage(rightChunk.getCanvas(), 500, 250, 250, 250)
}