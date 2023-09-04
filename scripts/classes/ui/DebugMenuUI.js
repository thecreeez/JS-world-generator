class DebugMenuUI {
  static create(pos = [0, 0]) {
    let container = new UIContainer({
      manager: Application.UIManager,
      pos,
      isActive: true,
      isRender: true,
      name: "Debug"
    })

    container.addElement(`UpsAndFpsLabel`, new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: `FPS: 0 UPS: 0`
    }))

    container.addElement(`CameraLabel`, new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: `x: 0, y: 0`
    }))

    container.addElement(`ChunksUpdateLabel`, new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: `Chunks stored: `
    }))

    container.addElement(`ChunksRenderLabel`, new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: `Chunks rendered: `
    }))

    container.addElement("MoveButton", new UIButton({
      manager: Application.UIManager,
      text: "test",
      isActive: true,
      isRender: true,
      onClick: (elem, pos) => {
        
      }
    }))

    return container;
  }
}