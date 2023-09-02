Application.EventBus.subscribe(EventBus.TYPES.RENDER_UI_START, () => {
  Application.Profilers.FPS_PROFILER.startTask("Render UI")
})

Application.EventBus.subscribe(EventBus.TYPES.RENDER_UI_END, () => {
  Application.Profilers.FPS_PROFILER.endTask("Render UI")
})