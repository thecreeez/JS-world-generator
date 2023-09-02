const TICKS_PER_SECOND = 60;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let WORLD;

function start() {
  
}

async function update() {
  updateAsync();
  renderAsync();
}

async function renderAsync() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (WORLD)
    WORLD.render();

  UIManagerInstance.render();
  DebugHelper.render();
}

async function updateAsync() {
  if (WORLD)
    WORLD.update();

  UIManagerInstance.update();
  DebugHelper.update();
}