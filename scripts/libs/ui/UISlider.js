class UISlider extends UIElement {
  static EMPTY_COLOR = [0, 0, 51];
  static FULL_COLOR = [0, 51, 204];

  static LINE_WIDTH = 10;

  static getMinWidth() {
    return 250;
  }

  constructor({ manager, pos, text, isActive, isRender, min, max, value, isInt }) {
    super({
      manager: manager,
      pos: pos,
      isRender: isRender,
      isActive: isActive
    })

    this.value = value;
    this.min = min;
    this.max = max;

    this._isInt = isInt;

    this._text = text;
    this._defaultFontSize = 15;

    this.onClick = (elem) => {
      elem.getManager().setSelectedElem(elem);
    }

    this.type = "input";
  }

  static createDefault({ manager, pos, text, min, max, value }) {
    return new UISlider({
      manager: manager,
      pos: pos,
      text: text,
      isActive: true,
      isRender: true,
      min: min,
      max: max,
      value: value
    })
  }

  render({ ctx, pos }) {
    if (!this.isRender)
      return;

    let renderingPos = this._pos;

    if (pos)
      renderingPos = pos;

    this._manager.setFont(this._defaultFontSize, this._manager.defaultFont);
    let size = this._getSize(ctx);

    this._manager.setFillColor(`rgb(${UISlider.EMPTY_COLOR[0]},${UISlider.EMPTY_COLOR[1]},${UISlider.EMPTY_COLOR[2]})`)
    ctx.fillRect(renderingPos[0] - size[0] / 2, renderingPos[1] - size[1], size[0], size[1]);

    this._manager.setFillColor(`rgb(${UISlider.FULL_COLOR[0]},${UISlider.FULL_COLOR[1]},${UISlider.FULL_COLOR[2]})`);
    ctx.fillRect(renderingPos[0] - size[0] / 2, renderingPos[1] - size[1], size[0] * this.getValueOffset(), size[1]);

    this._manager.setFillColor(`rgba(200,200,200,1)`);

    if (this.isSelected())
      this._manager.setFillColor(`white`);

    ctx.fillText(this.min, renderingPos[0] - size[0] / 2 - this._defaultFontSize / 4, renderingPos[1] - size[1] - 5);
    ctx.fillText(this.max, renderingPos[0] + size[0] / 2 - this._defaultFontSize / 4, renderingPos[1] - size[1] - 5);

    if (this.value != this.min && this.value != this.max)
      ctx.fillText(Math.round(this.value * 100) / 100, renderingPos[0] - size[0] / 2 + size[0] * this.getValueOffset() - this._defaultFontSize / 2, renderingPos[1] - size[1] - 5);
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (!this.isClicked && this.isSelected())
      this.getManager().setSelectedElem(null)
  }

  checkHover(pos, ctx) {
    if (this.isSelected()) {
      this.hoverMove({ pos, ctx });
    }
  }

  hoverMove({ pos, ctx, container }) {
    let size = this._getSize(ctx);

    let startPos;

    if (container) {
      startPos = container._pos[0] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS + size[0] / 2;
    } else {
      startPos = this._pos[0]
    }

    let startWidth = (startPos - size[0] / 2);

    if (pos[0] - startWidth < 0) {
      this.setValue(this.min);
      return;
    }

    let valueOffset = (pos[0] - startWidth) / size[0];

    if (valueOffset > 1) {
      this.setValue(this.max);
      return;
    }

    this.setValue(valueOffset * (this.max - this.min) + this.min);
  }

  getValueOffset() {
    return (this.value - this.min) / (this.max - this.min);
  }

  setValue(value) {
    this.value = value;

    if (this.value > this.max)
      this.value = this.max;

    if (this.value < this.min)
      this.value = this.min;

    if (this._isInt && Math.round(this.value) != this.value)
      this.value = Math.round(this.value)

    if (this.onchange)
      this.onchange(this, this.value);
  }

  getValue() {
    return this.value;
  }

  _getSize(ctx) {
    if (!this.isRender) {
      return [0, -UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS]
    }

    return [UISlider.getMinWidth(), UISlider.LINE_WIDTH];
  }

  _getFullSize(ctx) {
    return [UISlider.getMinWidth(), UISlider.LINE_WIDTH + 5 + this._defaultFontSize];
  }
}