class UIElement {
  constructor({ manager, pos, onHover, onClick, isActive, isRender }) {
    this._manager = manager;
    this._pos = pos;
    this.onHover = onHover;
    this.onClick = onClick;

    this.isActive = isActive;
    this.isRender = isRender;

    this.isHover = false;
    this.isClicked = false;

    this.animationState = 1;
  }

  render() {
    
  }

  update(deltaTime) {
    if (this.animationState < 1)
      this.animationState += 0.8 * deltaTime / 1000;

    if (this.animationState > 1) {
      this.animationState = 1;
    }
  }

  checkHover(pos, ctx) {
    if (!this.isActive)
      return this.isHover = false;

    if (this.isInCollision(pos, ctx)) {
      if (!this.isHover && !this.isSelected()) {
        this.animationState = 0;

        if (this.onHover)
          this.onHover(this, pos);
      }

      this.isHover = true;
    } else if (this.isHover) {
      this.animationState = 0;
      this.isHover = false;
    }
  }

  checkClick(pos, ctx) {
    if (!this.isActive || !this.onClick)
      return false;

    if (this.isInCollision(pos, ctx)) {
      this.onClick(this, pos);
      this.isClicked = true;
    }
  }

  emulateClick() {
    this.onClick(this, [0,0]);
  }

  isInCollision(pos, ctx) {
    if (!this._getSize)
      return false;

    let size = this._getSize(ctx);

    if (this._pos[0] - size[0] / 2 > pos[0])
      return false;

    if (this._pos[0] + size[0] / 2 < pos[0])
      return false;

    if (this._pos[1] - size[1] > pos[1])
      return false;

    if (this._pos[1] < pos[1])
      return false;

    return true;
  }

  setActive(state) {
    this.isActive = state;
    this.animationState = 0;
  }

  setRenderActive(state) {
    this.isRender = state;
  }

  getManager() {
    return this._manager;
  }

  setContainer(container) {
    this._container = container;
  }

  getContainer() {
    return this._container;
  }

  isSelected() {
    return this == this.getManager().getSelectedElem()
  }

  onmouseup(pos) {
    this.isClicked = false;
  }
}