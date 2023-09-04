
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
    debug: false,
    ticksPerSecond: 30,
    fpsMax: 144
  });

  let world = new World();
}