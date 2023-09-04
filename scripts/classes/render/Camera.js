class Camera {
  constructor({ pos = [0,0] } = {}) {
    this._pos = pos;
    this._fov = 1;
    this._chunkDefaultSize = 250;

    this._distanceToRender = 5;
    this._distanceToGenerate = 3

    this._speed = World.ChunkSize[0] / 10;
  }

  move(pos) {
    this._pos[0] += pos[0];
    this._pos[1] += pos[1];

    this._onmove();
  }

  getSpeed() {
    return this._speed;
  }

  getChunkPos() {
    return [Math.floor(this._pos[0] / World.ChunkSize[0]), Math.floor(this._pos[1] / World.ChunkSize[1])];
  }

  _onmove() {
    Application.UIManager.getElement("DebugMenu").getElement("CameraLabel").setValue(`ChunkPos:[${this.getChunkPos()}] / Pos:[${this.getPos()}]`)
  }

  getPos() {
    return this._pos;
  }

  getDistanceToRender() {
    return this._distanceToRender;
  }

  getDistanceToGenerate() {
    return Math.min(this._distanceToGenerate, this._distanceToRender);
  }

  getChunkSizeOnScreen() {
    return this._chunkDefaultSize * this._fov;
  }
}