class PerlinNoiseGenerator {
  /* СДЕЛАТЬ MIN/MAX ЗНАЧЕНИЯ */
  static noise({ size = [2, 2], times, step, seed, bounds = [-1, 1] }) {
    let noiseArr = PerlinNoiseGenerator._noise({ xSize: size[0], ySize: size[1], seed, bounds });

    for (let i = 0; i < times; i++) {
      PerlinNoiseGenerator._interpolate(noiseArr, step);
    }

    return noiseArr;
  }

  // Сглаживает разницу между шумами (берет только самый крайний и сглаживает ровно blockSmooth значений)
  static smoothNoise({ noise, leftNoise = null, rightNoise = null, topNoise = null, bottomNoise = null, blockSmooth = 5, step, mainNoiseBounds = [-1,1], secondNoiseBounds = [-1,1] }) {
    if (!noise) {
      console.error(`noise is not presented.`)
      return noise;
    }

    if (!leftNoise && !rightNoise && !topNoise && !bottomNoise) {
      console.error(`no need to smooth.`)
      return noise;
    }

    if (leftNoise) {
      for (let y = 0; y < leftNoise.length; y++) {
        let leftNoiseValue = leftNoise[y][leftNoise[y].length - 1];

        noise[y][0] = MathHelper.interpolate(noise[y][0] / mainNoiseBounds[1], leftNoiseValue / secondNoiseBounds[1], step);
        for (let i = 1; i < Math.min(blockSmooth, noise[y].length); i++) {
          noise[y][i] = MathHelper.interpolate(noise[y][i] / mainNoiseBounds[1], noise[y][i - 1] / secondNoiseBounds[1], step);
        }
      }
    }

    if (rightNoise) {
      for (let y = 0; y < rightNoise.length; y++) {
        let rightNoiseValue = rightNoise[y][0];

        noise[y][noise[y].length - 1] = MathHelper.interpolate(noise[y][noise[y].length - 1] / mainNoiseBounds[1], rightNoiseValue / secondNoiseBounds[1], step);
        for (let i = 1; i < Math.min(blockSmooth, noise[y].length); i++) {
          noise[y][noise[y].length - 1 - i] = MathHelper.interpolate(noise[y][noise[y].length - 1 - i] / mainNoiseBounds[1], noise[y][noise[y].length - i] / secondNoiseBounds[1], step);
        }
      }
    }

    if (topNoise) {
      for (let x = 0; x < topNoise[topNoise.length - 1].length; x++) {
        let topNoiseValue = topNoise[topNoise.length - 1][x];

        noise[0][x] = MathHelper.interpolate(noise[0][x] / mainNoiseBounds[1], topNoiseValue / secondNoiseBounds[1], step);
        for (let i = 1; i < Math.min(blockSmooth, noise.length); i++) {
          noise[i][x] = MathHelper.interpolate(noise[i][x] / mainNoiseBounds[1], noise[i - 1][x] / secondNoiseBounds[1], step);
        }
      }
    }

    if (bottomNoise) {
      for (let x = 0; x < bottomNoise[0].length; x++) {
        let bottomNoiseValue = bottomNoise[0][x];

        noise[noise.length - 1][x] = MathHelper.interpolate(noise[noise.length - 1][x] / mainNoiseBounds[1], bottomNoiseValue / secondNoiseBounds[1], step);
        for (let i = 1; i < Math.min(blockSmooth,noise.length); i++) {
          noise[noise.length - 1 - i][x] = MathHelper.interpolate(noise[noise.length - 1 - i][x] / mainNoiseBounds[1], noise[noise.length - i][x] / secondNoiseBounds[1], step);
        }
      }
    }

    return noise;
  }

  static _noise({ xSize, ySize, seed, offset = [0, 0], bounds = [-1, 1] }) {
    let noiseArr = [];

    for (let y = offset[1]; y < ySize + offset[1]; y++) {
      let noiseLine = [];

      for (let x = offset[0]; x < xSize + offset[0]; x++) {
        let random = MathHelper.createRandom(seed * x * y);
        let randomNum = MathHelper.randomInt(Math.min(bounds[0], bounds[1]), Math.max(bounds[0], bounds[1]), random);

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

        //arr[y][x] = Math.round(arr[y][x] * 10000) / 10000;
      }
    }
  }
}