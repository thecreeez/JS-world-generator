class Noise {
  static encode(value) {
    if (value > 2 || value < 1) {
      console.error(`Noise number must be [1, 2]`)
      return null;
    }

    if (value == 1)
      return `eee1`;

    if (value == 2)
      return `eee2`;

    let valueString = value.toString();

    
    valueString = valueString.replace(".", ``);
    valueString = "0" + valueString.substring(1, 4);
    
    while (valueString.length < 4) {
      valueString += "e";
    }

    return valueString;
  }

  static decode(value) {
    if (value == `eee1`)
      return 1;

    if (value == `eee2`)
      return 2;

    let firstNumPos = 0;

    while (value.charAt(firstNumPos) == "0") {
      firstNumPos++;
    }

    value = value.replaceAll("e", ``)

    let onlyNumbers = value.substring(firstNumPos, value.length);
    return Number(onlyNumbers) / Math.pow(10, onlyNumbers.length + firstNumPos - 1) + 1;
  }

  constructor({xSize, ySize, noise}) {
    this._noise = noise;
    this._xSize = xSize;
    this._ySize = ySize;
  }

  get(x, y) {
    let numericPosition = (x + y * this._xSize) * 4;

    if (numericPosition < 0 || numericPosition > this._noise.length) {
      return null;
    }

    return Noise.decode(this._noise.substring(numericPosition, numericPosition + 4));
  }

  set(x, y, value) {
    let numericPosition = (x + y * this._xSize) * 4;

    if (numericPosition < 0 || numericPosition > this._noise.length) {
      return;
    }

    this._noise = this._noise.slice(0, numericPosition) + Noise.encode(value) + this._noise.slice(numericPosition + 4);
  }

  getSize() {
    return [this._xSize, this._ySize]
  }
}