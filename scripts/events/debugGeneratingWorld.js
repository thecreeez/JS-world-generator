Application.EventBus.subscribe(EventType.UPDATE_START, () => {

})

Application.EventBus.subscribe(EventType.UPDATE_END, ({ deltaTime, generatedChunks, timeToGenerateChunks, maxTimeToGenerateChunks }) => {
  if (Application.DEBUG_MODE) {
    const DEBUG_CONTAINER = Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID);
    let UPS_PROFILER_CONTAINER = DEBUG_CONTAINER.getElement("UPSProfilerContainer");

    if (!UPS_PROFILER_CONTAINER) {
      UPS_PROFILER_CONTAINER = DEBUG_CONTAINER.addElement("UPSProfilerContainer", new UIContainer({
        manager: Application.UIManager,
        pos: [0, 0],
        isActive: true,
        isRender: true,
        name: "UPS Profiler"
      }))

      UPS_PROFILER_CONTAINER.addElement(`deltaTimeLabel`, new UILabel({
        manager: Application.UIManager,
        isRender: true,
        text: `DeltaTime: ${deltaTime}ms`
      }))

      UPS_PROFILER_CONTAINER.addElement(`generatedChunksLabel`, new UILabel({
        manager: Application.UIManager,
        isRender: true,
        text: `Generated chunks: ${generatedChunks}`
      }))

      UPS_PROFILER_CONTAINER.addElement(`timeToGenerateLabel`, new UILabel({
        manager: Application.UIManager,
        isRender: true,
        text: `Time: ${timeToGenerateChunks}ms/${maxTimeToGenerateChunks}ms`
      }))

      

      DebugHelper.CACHE["update"] = {
        deltaTimeValues: [],
        generatedChunksValues: [],
        timeToGenerateChunksValues: [],
        max: 50
      };
      return;
    }

    let cache = DebugHelper.CACHE["update"];

    cache.deltaTimeValues.unshift(deltaTime);
    if (cache.deltaTimeValues.length > cache.max) {
      cache.deltaTimeValues.splice(cache.deltaTimeValues.length - 1, 1);
    }
    let deltaTimeRound = 0;
    cache.deltaTimeValues.forEach((deltaTimeItem) => {
      deltaTimeRound += deltaTimeItem;
    })
    deltaTimeRound = Math.round(deltaTimeRound / cache.deltaTimeValues.length);

    cache.generatedChunksValues.unshift(generatedChunks);
    if (cache.generatedChunksValues.length > cache.max) {
      cache.generatedChunksValues.splice(cache.generatedChunksValues.length - 1, 1);
    }
    let generatedChunksRound = 0;
    cache.generatedChunksValues.forEach((generatedChunksItem) => {
      generatedChunksRound += generatedChunksItem;
    })
    generatedChunksRound = Math.round(generatedChunksRound / cache.generatedChunksValues.length * 100) / 100;

    cache.timeToGenerateChunksValues.unshift(timeToGenerateChunks);
    if (cache.timeToGenerateChunksValues.length > cache.max) {
      cache.timeToGenerateChunksValues.splice(cache.timeToGenerateChunksValues.length - 1, 1);
    }
    let timeToGenerateChunksRound = 0;
    cache.timeToGenerateChunksValues.forEach((timeToGeneratedChunksItem) => {
      timeToGenerateChunksRound += timeToGeneratedChunksItem;
    })
    timeToGenerateChunksRound = Math.round(timeToGenerateChunksRound / cache.timeToGenerateChunksValues.length);

    UPS_PROFILER_CONTAINER.getElement(`deltaTimeLabel`).setValue(`DeltaTime: ${deltaTimeRound}ms`)
    UPS_PROFILER_CONTAINER.getElement(`generatedChunksLabel`).setValue(`Generated chunks: ${generatedChunksRound}`)
    UPS_PROFILER_CONTAINER.getElement(`timeToGenerateLabel`).setValue(`Time: ${timeToGenerateChunksRound}ms/${maxTimeToGenerateChunks}ms`)
  }
})