class UIContainer extends UIElement {
  static DEFAULT_MARGIN_BETWEEN_ELEMENTS = 15;

  static BACKGROUND_COLOR = [0, 0, 0, 1];

  static HEADER_COLOR = [0, 0, 120, 1];
  static HEADER_HEIGHT = 20;
  static IS_HEADER_ON = true;

  constructor({ manager, pos, isActive, isRender, elements, name }) {
    super({
      manager: manager,
      pos: pos,
      isActive: isActive,
      isRender: isRender,
      onClick: (elem, pos) => {
        if (this._pos[1] < pos[1] && UIContainer.IS_HEADER_ON && this._pos[1] + UIContainer.HEADER_HEIGHT > pos[1]) {
          elem.getManager().setSelectedElem(elem);
          return;
        }

        let localPos = [pos[0], pos[1]];
        localPos[0] -= this._pos[0];
        localPos[1] -= this._pos[1];

        let element = this.getElementByLocalPos(localPos, this.getManager().getContext());

        if (!element)
          return;

        element.isClicked = true;

        if (element.onClick)
          element.onClick(element, pos);
      },
    })
    this._elements = new Map();
    this._name = name;

    this._renderType = "leftTop";
    this._type = "container";

    if (elements)
      this._elements = elements;

    this._pin = null;
  }

  pinTo(container) {
    this._pin = container;
  }

  addElement(id, element) {
    if (this.hasElement(id)) {
      return this.getManager().error("Can't add element. Id is already used.")
    }

    element.setContainer(this);
    this._elements.set(id, element);

    return element;
  }

  hasElement(id) {
    if (this._elements.get(id))
      return true;

    return false;
  }

  getElement(id) {
    return this._elements.get(id);
  }

  removeElement(id) {
    return this._elements.delete(id);
  }

  render({ ctx, pos }) {
    super.render();

    if (!this.isRender)
      return;

    let renderingPos = [this._pos[0], this._pos[1]];
    let size = this._getSize(ctx);

    if (pos) {
      renderingPos = [pos[0] - size[0] / 2, pos[1] - size[1]];
    }

    this._renderContainer(ctx, renderingPos);
    this._renderElements(ctx, renderingPos);
  }

  _renderContainer(ctx, renderingPos) {
    let size = this._getSize(ctx);

    this.getManager().setFillColor(this.getBackgroundColor())

    ctx.fillRect(renderingPos[0], renderingPos[1], size[0], size[1] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS);

    if (UIContainer.IS_HEADER_ON) {
      this.getManager().setFillColor(this.getHeaderColor())
      ctx.fillRect(renderingPos[0], renderingPos[1], size[0], UIContainer.HEADER_HEIGHT);

      this.getManager().setFillColor("white");
      this.getManager().setFont(UIContainer.HEADER_HEIGHT - 5, "arial");
      ctx.fillText(this._name, renderingPos[0] + 5, renderingPos[1] + UIContainer.HEADER_HEIGHT - 5);
    }
  }

  _renderElements(ctx, renderingPos) {
    let yElements = UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS;

    if (UIContainer.IS_HEADER_ON) {
      yElements += UIContainer.HEADER_HEIGHT;
    }

    this._elements.forEach((element) => {
      let size = element._getFullSize ? element._getFullSize(ctx) : element._getSize(ctx);
      let elementPos = [renderingPos[0], renderingPos[1]];

      elementPos[0] += UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS + size[0] / 2;
      elementPos[1] += yElements + size[1];

      element.render({
        ctx,
        pos: elementPos
      });

      yElements += size[1] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS;
    })
  }

  checkHover(pos, ctx) {
    if (this.isSelected()) {
      // HEADER ACTIONS
      this.hoverMove(pos)
    }

    // ELEMENTS CHECK
    let localPos = [pos[0], pos[1]];
    localPos[0] -= this._pos[0];
    localPos[1] -= this._pos[1];

    let element = this.getElementByLocalPos(localPos, ctx);

    this._elements.forEach((elementCandidate) => {
      if (element != elementCandidate)
        elementCandidate.isHover = false;
    })

    if (!element)
      return;

    if (!element.isHover) {
      element.animationState = 0;

      if (element.onHover)
        element.onHover(element, pos);
    }

    if (element.isClicked && element.hoverMove) {
      element.hoverMove({ pos, ctx, container: this });
    }

    element.isHover = true;
  }

  onHover(element, pos) {
    this.checkHover(pos, this.getManager().getContext());
  }

  hoverMove(pos) {
    if (this.getManager().mousePos) {
      let delta = [pos[0] - this.getManager().mousePos[0], pos[1] - this.getManager().mousePos[1]];

      this._pos[0] += delta[0];
      this._pos[1] += delta[1];
    }
  }

  _getSize(ctx) {
    if (!this.isRender) {
      return [0, -UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS]
    }

    let size = this.getElementsSize(ctx);

    let width = Math.max(...size[0]);

    this.getManager().setFont(UIContainer.HEADER_HEIGHT - 5, "arial");
    let nameWidth = ctx.measureText(this._name).width;

    if (nameWidth + UIContainer.HEADER_HEIGHT > width)
      width = nameWidth + UIContainer.HEADER_HEIGHT * 2;

    let height;
    if (size[1].length > 0)
      height = size[1].reduce((a, b) => a + b);
    else
      height = 0;

    height += UIContainer.HEADER_HEIGHT;

    return [width, height];
  }

  getElementsSize(ctx) {
    let widths = [];
    let heights = [];

    for (let element of this._elements) {
      let size = element[1]._getFullSize ? element[1]._getFullSize(ctx) : element[1]._getSize(ctx);

      widths.push(size[0] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS * 2);
      heights.push(size[1] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS)
    }

    return [widths, heights];
  }

  getBackgroundColor() {
    return `rgb(${UIContainer.BACKGROUND_COLOR[0]},${UIContainer.BACKGROUND_COLOR[1]},${UIContainer.BACKGROUND_COLOR[2]},${UIContainer.BACKGROUND_COLOR[3]})`
  }

  getHeaderColor() {
    return `rgb(${UIContainer.HEADER_COLOR[0]},${UIContainer.HEADER_COLOR[1]},${UIContainer.HEADER_COLOR[2]},${UIContainer.HEADER_COLOR[3]})`
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this._pin) {
      this._pos = [this._pin._pos[0], this._pin._pos[1] + this._pin._getSize(this.getManager().getContext())[1] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS];
    }

    for (let element of this._elements) {
      element[1].update(deltaTime);
    }

    if (!this.isClicked && this.isSelected())
      this.getManager().setSelectedElem(null);
  }

  // Нужна отдельная проверка потому что рендер идет слева сверху, а не посередине как у остальных элементов
  isInCollision(pos, ctx) {
    let size = this._getSize(ctx);

    if (this._pos[0] > pos[0])
      return false;

    if (this._pos[0] + size[0] < pos[0])
      return false;

    if (this._pos[1] > pos[1])
      return false;

    if (this._pos[1] + size[1] < pos[1])
      return false;

    return true;
  }

  getElementByLocalPos(pos, ctx) {
    let elementOut = null;

    let yElements = UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS;

    if (UIContainer.IS_HEADER_ON) {
      yElements += UIContainer.HEADER_HEIGHT;
    }

    this._elements.forEach((element) => {
      let size = element._getFullSize ? element._getFullSize(ctx) : element._getSize(ctx);;
      let elementPos = [this._pos[0], this._pos[1]];

      elementPos[0] += UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS + size[0] / 2;
      elementPos[1] += yElements + size[1];

      let isIntersection = true;
      if (pos[0] < UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS)
        isIntersection = false;

      if (pos[0] > size[0] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS)
        isIntersection = false;

      if (pos[1] < yElements)
        isIntersection = false;

      if (pos[1] > yElements + size[1])
        isIntersection = false;

      if (isIntersection) {
        elementOut = element;
      }

      yElements += size[1] + UIContainer.DEFAULT_MARGIN_BETWEEN_ELEMENTS;
    })

    return elementOut;
  }

  onmouseup(pos) {
    this.isClicked = false;
    for (let element of this._elements) {
      element[1].onmouseup(pos);
    }
  }
}