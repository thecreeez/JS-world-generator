Application.EventBus.subscribe(EventBus.TYPES.GENERATING_WORLD_START, () => {

})

Application.EventBus.subscribe(EventBus.TYPES.GENERATING_WORLD_END, () => {
  // Профайлер для генерации мира

  if (Application.DEBUG_MODE) {
    const DEBUG_CONTAINER = Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID);
    let WORLD_GENERATION_PROFILER_CONTAINER = DEBUG_CONTAINER.getElement("GENProfilerContainer");

    if (!WORLD_GENERATION_PROFILER_CONTAINER) {
      WORLD_GENERATION_PROFILER_CONTAINER = DEBUG_CONTAINER.addElement("GENProfilerContainer", new UIContainer({
        manager: Application.UIManager,
        pos: [0, 0],
        isActive: true,
        isRender: true,
        name: "GEN Profiler"
      }))
    }

    WORLD_GENERATION_PROFILER_CONTAINER.clearElements();
    Application.Profilers.WORLD_GENERATION_PROFILER.getTasks().forEach((task, id) => {
      WORLD_GENERATION_PROFILER_CONTAINER.addElement(`GENDataLabel${id}`, new UILabel({
        manager: Application.UIManager,
        isRender: true,
        text: `[${DebugHelper.getDate()}] ${task.name}: ${task.time}ms`
      }))
    })

    Application.Profilers.WORLD_GENERATION_PROFILER.clear();
  }
})