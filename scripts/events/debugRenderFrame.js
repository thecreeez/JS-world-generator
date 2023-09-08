Application.EventBus.subscribe(EventType.RENDER_FRAME_START, () => {
  
})

Application.EventBus.subscribe(EventType.RENDER_FRAME_END, () => {
  DebugHelper.render();

  // Профайлер для отрисовки кадра
  if (Application.DEBUG_MODE) {
    const DEBUG_CONTAINER = Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID);
    let FPS_PROFILER_CONTAINER = DEBUG_CONTAINER.getElement("FPSProfilerContainer");

    if (!FPS_PROFILER_CONTAINER) {
      FPS_PROFILER_CONTAINER = DEBUG_CONTAINER.addElement("FPSProfilerContainer", new UIContainer({
        manager: Application.UIManager,
        pos: [0, 0],
        isActive: true,
        isRender: true,
        name: "FPS Profiler"
      }))
    }

    FPS_PROFILER_CONTAINER.clearElements();
    Application.Profilers.FPS_PROFILER.getTasks().forEach((task, id) => {
      FPS_PROFILER_CONTAINER.addElement(`FPSDataLabel${id}`, new UILabel({
        manager: Application.UIManager,
        isRender: true,
        text: `[${DebugHelper.getDate()}] ${task.name}: ${task.time}ms`
      }))
    })

    Application.Profilers.FPS_PROFILER.clear();
  }

  //Application.World = new World({ offset: [Application.World.offset[0] + 1, Application.World.offset[1] + 1], seed: Application.World._seed })
})