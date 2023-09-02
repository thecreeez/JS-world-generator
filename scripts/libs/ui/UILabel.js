class UILabel extends UIElement {
  static LABEL_COLOR = [255, 255, 255, 1];
  static FONT_SIZE = 15;

  constructor({ manager, pos, isRender, text }) {
    super({
      manager: manager,
      pos: pos,
      isRender: isRender,
      isActive: true
    })

    this._text = text;
  }

  render({ ctx, pos }) {
    super.render();

    if (!this.isRender)
      return;

    this._manager.setFont(UILabel.FONT_SIZE, this._manager.defaultFont);
    this._manager.setFillColor(`rgba(${UILabel.LABEL_COLOR[0]},${UILabel.LABEL_COLOR[1]},${UILabel.LABEL_COLOR[2]},${UILabel.LABEL_COLOR[3]})`)

    let size = this._getSize(ctx);

    let renderingPos = this._pos;

    if (pos)
      renderingPos = pos;

    ctx.fillText(this._text, renderingPos[0] - ctx.measureText(this._text).width / 2, renderingPos[1] - UILabel.FONT_SIZE * 0.3);
  }

  _getSize(ctx) {
    if (!this.isRender) {
      return [0, -UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS]
    }

    return [ctx.measureText(this._text).width, UILabel.FONT_SIZE + 2];
  }

  setValue(value) {
    this._text = value;
  }
}