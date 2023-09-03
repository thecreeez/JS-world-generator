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

    container.addElement("MoveButton", new UIButton({
      manager: Application.UIManager,
      text: "Очистить",
      isActive: true,
      isRender: true,
      onClick: (elem, pos) => {
        Application.World.removeSlice(2,2);
      }
    }))

    return container;
  }
}