document.querySelector("canvas").width = document.body.clientWidth;
document.querySelector("canvas").height = document.body.clientHeight;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.onload = () => {
  Application.start({
    debug: true,
    ticksPerSecond: 1000,
    fpsMax: 144
  });
}