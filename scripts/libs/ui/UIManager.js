class UIManager {

  static ButtonMinWidth = 200;
  static SliderMinWidth = 200;
  static TextInputMinWidth = 200;

  static font = "Lato";
  static fontSize = 15;

  constructor(canvas) {
    this._elements = new Map();
    this._selected = null;

    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");

    this._lastUpdate = Date.now();

    this.defaultFont = "arial";

    this.mousePos = false;
  }

  addElement(id, element) {
    if (this.hasElement(id)) {
      return this.error("Can't add element. Id is already used.")
    }

    if (!element || !element.render || !element.update) {
      return this.error("Can't add element. Bugged element.")
    }

    this._elements.set(id, element);

    return element;
  }

  hasElement(id) {
    if (this._elements.get(id))
      return true;

    return false;
  }

  removeElement(id) {
    return this._elements.delete(id);
  }

  getElement(id) {
    return this._elements.get(id);
  }

  getContext() {
    return this._ctx;
  }

  render() {
    for (let element of this._elements) {
      element[1].render({
        ctx: this._ctx
      });
    }
  }

  update() {
    let currentTime = Date.now();
    let deltaTime = currentTime - this._lastUpdate;

    for (let element of this._elements) {
      element[1].update(deltaTime);
    }

    this._lastUpdate = currentTime;
  }

  error(message) {
    console.error("UIManager", message);
  }

  setFont(size, font) {
    this._ctx.font = size + "px " + font;
  }

  setFillColor(color) {
    this._ctx.fillStyle = color;
  }

  setStrokeColor(color) {
    this._ctx.strokeStyle = color;
  }

  setStrokeWidth(width) {
    this._ctx.lineWidth = width;
  }

  setSelectedElem(elem) {
    this._selected = elem;
  }

  getSelectedElem() {
    return this._selected;
  }

  onmousedown(pos) {
    this.setSelectedElem(null);

    for (let element of this._elements) {
      element[1].checkClick(pos, this._ctx);
    }
  }

  onmouseup(pos) {
    for (let element of this._elements) {
      element[1].onmouseup(pos);
    }
  }

  onmousemove(pos) {
    for (let element of this._elements) {
      element[1].checkHover(pos, this._ctx);
    }

    this.mousePos = pos;
  }

  onkeydown(key, code) {
    if (this.getSelectedElem() && this.getSelectedElem().onkeydown)
      this.getSelectedElem().onkeydown(key, code)
  }
}