class Entity {
  constructor({world, pos, type}) {
    this._world = world;
    this._pos = pos;
    this._type = type;
    this.needToRemove = false;
  }

  render() {
    console.error("NO RENDER METHOD FOR ENTITY!")
  }

  update() {
    console.error("NO UPDATE METHOD FOR ENTITY!")
  }
}