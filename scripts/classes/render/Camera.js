class Camera {
  constructor({ pos = [0,0] }) {
    this._pos = pos;
    this._fov = 1;

    // in slices
    this._distanceToRender = 10;
  }

  move(pos) {
    this._pos[0] += pos[0];
    this._pos[1] += pos[1];

    this._onmove();
  }

  _onmove() {

  }
}