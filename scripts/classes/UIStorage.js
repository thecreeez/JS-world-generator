class UIStorage {
  /**
   * 
   * @param {UIManager} manager 
   * @returns 
   */
  static MAIN_UI(manager) {
    let container = new UIContainer({
      manager,
      pos: [0, 0],
      isActive: true,
      isRender: true,
      name: "Настройка"
    })

    container.addElement("PerlinNoiseStepSliderLabel", new UILabel({
      manager,
      isRender: true,
      text: "Сглаживание шума перлина"
    }))

    container.addElement("PerlinNoiseStepSlider", new UISlider({
      manager,
      isActive: true,
      isRender: true,
      min: 0.001,
      max: 0.9,
      value: 0.1
    }))

    container.getElement(`PerlinNoiseStepSlider`).onchange = (elem, value) => {
      elem.getManager().getElement("MainMenu").getElement("ButtonGenerate").emulateClick();
    }

    container.addElement("PerlinNoiseIterationsSliderLabel", new UILabel({
      manager,
      isRender: true,
      text: "Кол-во итераций сглаживания"
    }))

    container.addElement("PerlinNoiseIterationsSlider", new UISlider({
      manager,
      isActive: true,
      isRender: true,
      min: 1,
      max: 24,
      isInt: true,
      value: 10
    }))

    container.getElement(`PerlinNoiseIterationsSlider`).onchange = (elem, value) => {
      elem.getManager().getElement("MainMenu").getElement("ButtonGenerate").emulateClick();
    }

    container.addElement("PerlinNoiseSeedSpaceTop", new UILabel({
      manager,
      isRender: true,
      text: ""
    }))

    container.addElement("PerlinNoiseSeedLabel", new UILabel({
      manager,
      isRender: true,
      text: "Рандом"
    }))

    container.addElement("ButtonSwitchRandomType", new UIButton({
      manager,
      text: `Тип: ${World.method}`,
      isActive: true,
      isRender: true,
      onClick: (elem, pos) => {
        if (World.method == World.METHODS.FULL_RANDOM) {
          World.method = World.METHODS.SEED_RANDOM;

          elem.getContainer().getElement("PerlinNoiseSeedTextInput").setActive(true);
          elem.getContainer().getElement("PerlinNoiseSeedTextInput").setRenderActive(true);

          elem.getContainer().getElement("ButtonSeedRandom").setActive(true);
          elem.getContainer().getElement("ButtonSeedRandom").setRenderActive(true);
        } else {
          World.method = World.METHODS.FULL_RANDOM;

          elem.getContainer().getElement("PerlinNoiseSeedTextInput").setActive(false);
          elem.getContainer().getElement("PerlinNoiseSeedTextInput").setRenderActive(false);

          elem.getContainer().getElement("ButtonSeedRandom").setActive(false);
          elem.getContainer().getElement("ButtonSeedRandom").setRenderActive(false);
        }

        elem.setText(`Тип: ${World.method}`);
      }
    }))

    container.addElement("PerlinNoiseSeedTextInput", new UITextInput({
      manager,
      isActive: true,
      isRender: true,
      whiteList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      maxSymbols: 10,
      placeholder: "Seed",
      value: Math.floor(Math.random() * 999999999)
    }))

    container.addElement("ButtonSeedRandom", new UIButton({
      manager,
      text: "Рандомный сид",
      isActive: true,
      isRender: true,
      onClick: (elem, pos) => {
        let container = elem.getContainer();
        let noiseSeed = container.getElement("PerlinNoiseSeedTextInput");

        noiseSeed.setValue(Math.floor(Math.random() * 999999999));
        elem.getManager().getElement("MainMenu").getElement("ButtonGenerate").emulateClick();
      }
    }))

    container.addElement("PerlinNoiseSeedSpaceBottom", new UILabel({
      manager,
      isRender: true,
      text: ""
    }))

    container.addElement("WorldLabel", new UILabel({
      manager,
      isRender: true,
      text: "Мир"
    }))

    container.addElement("ButtonEntityIsOn", new UIButton({
      manager,
      text: "Настройки чанков",
      isActive: true,
      isRender: true,
      onClick: (elem, pos) => {
        let hasMenu = elem.getManager().hasElement("ChunkSettings");

        if (hasMenu) {
          elem.getManager().removeElement("ChunkSettings");
          elem.setText("Настройки чанков");
        } else {
          elem.getManager().addElement("ChunkSettings", UIStorage.CHUNKS_SETTINGS(elem.getManager()));
          elem.setText("Настройки чанков");
        }
      }
    }))

    container.addElement("WorldSizeXLabel", new UILabel({
      manager,
      isRender: true,
      text: "Размер X"
    }))

    container.addElement("WorldSizeXSlider", new UISlider({
      manager,
      isActive: true,
      isRender: true,
      min: 1,
      max: 500,
      isInt: true,
      value: World.SIZE[0]
    }))

    container.getElement(`WorldSizeXSlider`).onchange = (elem, value) => {
      elem.getManager().getElement("MainMenu").getElement("ButtonGenerate").emulateClick();
    }

    container.addElement("WorldSizeYLabel", new UILabel({
      manager,
      isRender: true,
      text: "Размер Y"
    }))

    container.addElement("WorldSizeYSlider", new UISlider({
      manager,
      isActive: true,
      isRender: true,
      min: 1,
      max: 500,
      isInt: true,
      value: World.SIZE[1]
    }))

    container.getElement(`WorldSizeYSlider`).onchange = (elem, value) => {
      elem.getManager().getElement("MainMenu").getElement("ButtonGenerate").emulateClick();
    }

    container.addElement("WorldSpeedLabel", new UILabel({
      manager,
      isRender: true,
      text: "Скорость мира"
    }))

    container.addElement("WorldSpeedSlider", new UISlider({
      manager,
      isActive: true,
      isRender: true,
      min: 0.1,
      max: 50,
      value: 1
    }))

    container.getElement(`WorldSpeedSlider`).onchange = (elem, value) => {
      World.TICK_SPEED = value;
    }

    container.addElement("WorldSpaceBottom", new UILabel({
      manager,
      isRender: true,
      text: ""
    }))

    container.addElement("ButtonGenerate", new UIButton({
      manager,
      text: "Генерация",
      isActive: true,
      isRender: true,
      onClick: (elem, pos) => {

        let container = elem.getContainer();

        let noiseStep = container.getElement("PerlinNoiseStepSlider");
        let noiseIterations = container.getElement("PerlinNoiseIterationsSlider");
        let noiseSeed = container.getElement("PerlinNoiseSeedTextInput");

        let worldXSize = container.getElement("WorldSizeXSlider");
        let worldYSize = container.getElement("WorldSizeYSlider");

        let generationData = {
          chunkTypesSettings: {},
          perlinNoiseStep: noiseStep.getValue(), 
          perlinNoiseTimes: noiseIterations.getValue(),
          seed: noiseSeed.getValue(),
          worldXSize: worldXSize.getValue(),
          worldYSize: worldYSize.getValue()
        };

        let chunkSettings = elem.getManager().getElement("ChunkSettings");

        // Если меню настроек открыто
        if (chunkSettings) {
          ChunkStorage.getAll().forEach((chunkType) => {
            let chunkHeight = chunkSettings.getElement(`${chunkType.type}Slider`).getValue();
            generationData.chunkTypesSettings[chunkHeight] = {
              type: chunkType.type,
              height: chunkHeight,
              rgb: chunkType.rgb
            }
          })
        } else {
          // Если меню настроек закрыто
          ChunkStorage.getAll().forEach((chunkType) => {
            generationData.chunkTypesSettings[chunkType.defaultHeight] = {
              type: chunkType.type,
              height: chunkType.defaultHeight,
              rgb: chunkType.rgb
            }
          })
        }

        WORLD = new World(generationData); 
      }
    }))

    return container;
  }

  static CHUNKS_SETTINGS(manager) {
    let container = new UIContainer({
      manager,
      pos: [0, 0],
      isActive: true,
      isRender: true,
      name: "Chunks Settings"
    })

    ChunkStorage.getAll().forEach((chunkType) => {
      container.addElement(`${chunkType.type}Label`, new UILabel({
        manager,
        isRender:true,
        text: `Высота чанка ${chunkType.type}`
      }))

      container.addElement(`${chunkType.type}Slider`, new UISlider({
        manager,
        isActive: true,
        isRender: true,
        min: -1,
        max: 1,
        value: chunkType.defaultHeight
      }))

      container.getElement(`${chunkType.type}Slider`).onchange = (elem, value) => {
        elem.getManager().getElement("MainMenu").getElement("ButtonTest").emulateClick();
      }
    })

    return container;
  }
}