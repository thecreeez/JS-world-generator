Application.EventBus.subscribe(EventBus.TYPES.UPDATE_CHUNK_BAKE_START, () => {
  Application.Profilers.UPS_PROFILER.startTask("baking slice");
})

Application.EventBus.subscribe(EventBus.TYPES.UPDATE_CHUNK_BAKE_END, () => {
  Application.Profilers.UPS_PROFILER.endTask("baking slice");
})

Application.EventBus.subscribe(EventBus.TYPES.UPDATE_CHUNK_GENERATE_START, () => {

})

Application.EventBus.subscribe(EventBus.TYPES.UPDATE_CHUNK_GENERATE_END, () => {
  
})

Application.EventBus.subscribe(EventBus.TYPES.UPDATE_START, () => {

})

Application.EventBus.subscribe(EventBus.TYPES.UPDATE_END, () => {
  if (Application.DEBUG_MODE) {
    const DEBUG_CONTAINER = Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID);
    let WORLD_GENERATION_PROFILER_CONTAINER = DEBUG_CONTAINER.getElement("GENProfilerContainer");

    if (!WORLD_GENERATION_PROFILER_CONTAINER) {
      WORLD_GENERATION_PROFILER_CONTAINER = DEBUG_CONTAINER.addElement("GENProfilerContainer", new UIContainer({
        manager: Application.UIManager,
        pos: [0, 0],
        isActive: true,
        isRender: true,
        name: "UPD Profiler"
      }))
    }

    WORLD_GENERATION_PROFILER_CONTAINER.clearElements();
    Application.Profilers.UPS_PROFILER.getTasks().forEach((task, id) => {
      WORLD_GENERATION_PROFILER_CONTAINER.addElement(`GENDataLabel${id}`, new UILabel({
        manager: Application.UIManager,
        isRender: true,
        text: `[${DebugHelper.getDate()}] ${task.name}: ${task.time}ms`
      }))
    })

    Application.Profilers.WORLD_GENERATION_PROFILER.clear();
  }
})