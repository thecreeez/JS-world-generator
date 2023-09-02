const TICKS_PER_SECOND = 60;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let WORLD;

let noiseStep = 0.0001;

function start() {
  //setInterval(drawIsland, 500)
}

function drawIsland() {
  UIManagerInstance.getElement("MainMenu").getElement("PerlinNoiseStepSlider").setValue(noiseStep);
  noiseStep += 0.001;
  UIManagerInstance.getElement("MainMenu").getElement("ButtonTest").emulateClick();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (WORLD) {
    WORLD.update();
    WORLD.render();
  }

  UIManagerInstance.update();
  UIManagerInstance.render();
}