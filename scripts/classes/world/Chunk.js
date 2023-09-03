class Chunk {
  constructor({ pos, noise, biome }) {
    this._pos = pos;
    this.noise = noise
    this.biome = biome;
    
    /**
     * Система установки блоков
     */
  }

  // Рендер чанка в контексте и особой позиции
  render({ ctx, pos, size }) {

  }
}

/**
 * 1) Создание чанка (С шумом)
 * 2) Создание соседнего чанка (С шумом)
 * 3) Сглаживание шумов чанков (+-2 блока обводки)
 */