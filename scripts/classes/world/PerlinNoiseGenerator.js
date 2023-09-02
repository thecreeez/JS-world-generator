class PerlinNoiseGenerator {
  static noise(xSize, ySize, times, step, seed) {
    let noiseArr = PerlinNoiseGenerator._noise(xSize, ySize, seed);

    for (let i = 0; i < times; i++) {
      PerlinNoiseGenerator._interpolate(noiseArr, step);
    }
    return noiseArr;
  }

  static _addNoises(noise1, noise2) {
    let out = [];

    for (let y = 0; y < noise1.length; y++) {
      let noiseLine = [];

      for (let x = 0; x < noise1[y].length; x++) {
        noiseLine.push(MathHelper.interpolate(noise1[y][x], noise2[y][x], 0.5));
      }

      out.push(noiseLine);
    }

    return out;
  }

  static _noise(xSize, ySize, seed) {
    let noiseArr = [];

    for (let y = 0; y < ySize; y++) {
      let noiseLine = [];

      for (let x = 0; x < xSize; x++) {
        let random = MathHelper.createRandom(seed * x * y);
        // -1 или 1
        let randomNum = MathHelper.randomInt(0, 1, random) * 2 - 1;

        noiseLine.push(randomNum);
      }

      noiseArr.push(noiseLine);
    }

    return noiseArr;
  }

  static _interpolate(arr, step) {
    for (let y = 1; y < arr.length - 1; y++) {
      for (let x = 1; x < arr[y].length - 1; x++) {
        let prevTop = arr[y - 1][x];
        let prevLeft = arr[y][x - 1];
        let nextBot = arr[y + 1][x];
        let nextRight = arr[y][x + 1]
        
        arr[y][x] = MathHelper.interpolate(arr[y][x], prevTop, step);
        arr[y][x] = MathHelper.interpolate(arr[y][x], prevLeft, step);
        arr[y][x] = MathHelper.interpolate(arr[y][x], nextBot, step);
        arr[y][x] = MathHelper.interpolate(arr[y][x], nextRight, step);
      }
    }
  }
}