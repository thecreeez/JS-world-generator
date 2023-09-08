Application.EventBus.subscribe(EventType.RENDER_UI_START, () => {
  Application.Profilers.FPS_PROFILER.startTask("Render UI")
})

Application.EventBus.subscribe(EventType.RENDER_UI_END, () => {
  Application.Profilers.FPS_PROFILER.endTask("Render UI")
})