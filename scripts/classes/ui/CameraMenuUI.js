class CameraMenuUI {
  static create(pos = [0, 0]) {
    let container = new UIContainer({
      manager: Application.UIManager,
      pos,
      isActive: true,
      isRender: true,
      name: "Камера"
    })

    container.addElement("FOVSliderLabel", new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: "FOV"
    }))

    container.addElement("FOVSlider", new UISlider({
      manager: Application.UIManager,
      isActive: true,
      isRender: true,
      min: 0.1,
      max: 12,
      value: 1
    }))

    container.getElement(`FOVSlider`).onchange = (elem, value) => {
      Application.World.camera.setFOV(value);
    }

    container.addElement("DistanceRenderLabel", new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: "Прогрузка чанков"
    }))

    container.addElement("DistanceRenderSlider", new UISlider({
      manager: Application.UIManager,
      isActive: true,
      isRender: true,
      min: 1,
      max: 15,
      isInt: true,
      value: 5
    }))

    container.getElement(`DistanceRenderSlider`).onchange = (elem, value) => {
      Application.World.camera.setRenderDistance(value);
    }

    container.addElement("DistanceGenerationLabel", new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: "Генерация чанков"
    }))

    container.addElement("DistanceGenerationSlider", new UISlider({
      manager: Application.UIManager,
      isActive: true,
      isRender: true,
      min: 1,
      max: 15,
      isInt: true,
      value: 5
    }))

    container.getElement(`DistanceGenerationSlider`).onchange = (elem, value) => {
      Application.World.camera.setGenerationDistance(value);
    }

    container.addElement("CameraSpeedLabel", new UILabel({
      manager: Application.UIManager,
      isRender: true,
      text: "Скорость камеры"
    }))

    container.addElement("CameraSpeedSlider", new UISlider({
      manager: Application.UIManager,
      isActive: true,
      isRender: true,
      min: 0,
      max: World.ChunkSize[0],
      isInt: true,
      value: World.ChunkSize[0] / 10
    }))

    container.getElement(`CameraSpeedSlider`).onchange = (elem, value) => {
      Application.World.camera.setSpeed(value);
    }

    return container;
  }
}