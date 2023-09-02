class ChunksSettingsUI {
  static create(pos = [0, 0]) {
    let container = new UIContainer({
      manager: Application.UIManager,
      pos: pos,
      isActive: true,
      isRender: true,
      name: "Chunks Settings"
    })

    ChunkStorage.getAll().forEach((chunkType) => {
      container.addElement(`${chunkType.type}Label`, new UILabel({
        manager: Application.UIManager,
        isRender: true,
        text: `Высота чанка ${chunkType.type}`
      }))

      container.addElement(`${chunkType.type}Slider`, new UISlider({
        manager: Application.UIManager,
        isActive: true,
        isRender: true,
        min: -1,
        max: 1,
        value: chunkType.defaultHeight
      }))

      container.getElement(`${chunkType.type}Slider`).onchange = (elem, value) => {
        elem.getManager().getElement("MainMenu").getElement("ButtonGenerate").emulateClick();
      }
    })

    return container;
  }
}