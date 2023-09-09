class MathHelper {
  static interpolate(a0, a1, w) {
    return (a1 - a0) * w + a0;
  }

  static randomInt(min, max, random) {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  static randomInBounds(min, max, random) {
    return random() * (max - min) + min;
  }

  static createRandom(s) {
    if (Application.RandomMethod == Application.RandomTypes.FullRandom)
      return Math.random

    return function () {
      return Math.sin(Math.random() * s);
    }
  }

  static randomSeed() {
    return Math.floor(Math.random() * Math.random() * 1000000)
  }

  static globalToChunkPos(pos) {
    return [Math.floor(pos[0] / World.ChunkSize[0]), Math.floor(pos[1] / World.ChunkSize[1])]
  }

  static globalToChunkLocalPos(pos) {
    let localPos = [pos[0] % World.ChunkSize[0], pos[1] % World.ChunkSize[1]];

    if (localPos[0] < 0) {
      localPos[0] = World.ChunkSize[0] + localPos[0];
    }

    if (localPos[1] < 0) {
      localPos[1] = World.ChunkSize[1] + localPos[1];
    }

    return localPos;
  }

  static getVectorLength(pos) {
    return Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2));
  }

  static clamp(min, max, value) {
    if (value > max)
      return max;

    if (value < min)
      return min;

    return value;
  }
}