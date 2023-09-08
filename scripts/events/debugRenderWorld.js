Application.EventBus.subscribe(EventType.RENDER_WORLD_START, () => {
  Application.Profilers.FPS_PROFILER.startTask("Render world")
})

Application.EventBus.subscribe(EventType.RENDER_WORLD_END, () => {
  Application.Profilers.FPS_PROFILER.endTask("Render world")
})