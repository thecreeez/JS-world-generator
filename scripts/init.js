document.querySelector("canvas").width = 1280;
document.querySelector("canvas").height = 800;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.onload = () => {
  Application.start({
    debug: true,
    ticksPerSecond: 60,
    fpsMax: 2
  });
}