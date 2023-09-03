class PerlinNoiseGenerator {
  static noise({size = [2,2], times, step, seed, offset = [0,0]}) {
    let noiseArr = PerlinNoiseGenerator._noise({ xSize: size[0], ySize: size[1], seed, offset});

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
        noiseLine.push(MathHelper.interpolate(noise1[y][x], noise2[y][x], 0.3));
      }

      out.push(noiseLine);
    }

    return out;
  }

  static _noise({xSize, ySize, seed, offset}) {
    let noiseArr = [];

    for (let y = offset[1]; y < ySize + offset[1]; y++) {
      let noiseLine = [];

      for (let x = offset[0]; x < xSize + offset[0]; x++) {
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
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        let prevTop = arr[y - 1] ? arr[y - 1][x] : arr[y][x];
        let prevLeft = arr[y][x - 1] ? arr[y][x - 1] : arr[y][x];
        let nextBot = arr[y + 1] ? arr[y + 1][x] : arr[y][x];
        let nextRight = arr[y][x + 1] ? arr[y][x + 1] : arr[y][x];
        
        arr[y][x] = MathHelper.interpolate(arr[y][x], prevTop, step);
        arr[y][x] = MathHelper.interpolate(arr[y][x], prevLeft, step);
        arr[y][x] = MathHelper.interpolate(arr[y][x], nextBot, step);
        arr[y][x] = MathHelper.interpolate(arr[y][x], nextRight, step);
      }
    }
  }
}