class PerlinNoiseGenerator {
  // Мб создавать шум по чанкам
  static noise({ size = [2, 2], times, step, seed, offset = [0, 0] }) {
    let noiseArr = PerlinNoiseGenerator._noise({ xSize: size[0], ySize: size[1], seed, offset });

    for (let i = 0; i < times; i++) {
      PerlinNoiseGenerator._interpolate(noiseArr, step);
    }

    return noiseArr;
  }

  // TO-DO: MAKE SMOOTH BITCH
  static smoothNoise({ noise, leftNoise = null, rightNoise = null, topNoise = null, bottomNoise = null, times, step}) {
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
        noise[y][0] = MathHelper.interpolate(noise[y][0], leftNoiseValue, step);
      }
    }

    if (rightNoise) {
      for (let y = 0; y < rightNoise.length; y++) {
        let rightNoiseValue = rightNoise[y][0];
        noise[y][noise[y].length - 1] = MathHelper.interpolate(noise[y][noise[y].length - 1], rightNoiseValue, step);
      }
    }

    if (topNoise) {

    }

    if (bottomNoise) {

    }

    return noise;
  }

  static _noise({ xSize, ySize, seed, offset }) {
    let noiseArr = [];

    for (let y = offset[1]; y < ySize + offset[1]; y++) {
      let noiseLine = [];

      for (let x = offset[0]; x < xSize + offset[0]; x++) {
        let random = MathHelper.createRandom(seed * x * y);
        let randomNum = MathHelper.randomInt(-1, 1, random);

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