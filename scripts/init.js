document.querySelector("canvas").width = 1280;
document.querySelector("canvas").height = 800;

const UIManagerInstance = new UIManager(document.querySelector("canvas"));

window.onload = () => {
  start();
  setInterval(update, 1000 / TICKS_PER_SECOND);

  UIManagerInstance.addElement("MainMenu", UIStorage.MAIN_UI(UIManagerInstance));

  document.querySelector("canvas").onmousemove = (e) => {
    UIManagerInstance.onmousemove([e.clientX, e.clientY]);
  }

  document.querySelector("canvas").onmousedown = (e) => {
    UIManagerInstance.onmousedown([e.clientX, e.clientY]);
  }

  document.querySelector("canvas").onmouseup = (e) => {
    UIManagerInstance.onmouseup([e.clientX, e.clientY]);
  }

  window.onkeydown = (e) => {
    UIManagerInstance.onkeydown(e.key, e.code)
  }
}