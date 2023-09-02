class Application {
  static UIManager = new UIManager(document.querySelector("canvas"));
  static EventBus = new EventBus();

  static World;
  static DEBUG_MODE = false;

  static RandomTypes = {
    FullRandom: "Случайно",
    SeedRandom: "Псевдослучайно"
  }

  static RandomMethod = Application.RandomTypes.SeedRandom;

  static Profilers = {
    FPS_PROFILER: DebugHelper.createProfiler(),
    WORLD_GENERATION_PROFILER: DebugHelper.createProfiler()
  }

  static start({ debug = false, ticksPerSecond = 60, fpsMax = 144 }) {
    Application.DEBUG_MODE = debug;

    this.EventBus.invoke(EventBus.TYPES.APPLICATION_START, {
      debug,
      ticksPerSecond,
      fpsMax
    })

    if (Application.DEBUG_MODE) {
      Application.UIManager.addElement(DebugHelper.DEBUG_HELPER_MENU_ID, DebugMenuUI.create([World.getBoundsOnScreen()[0], 0]));
    }

    Application.World = new World({
      seed: MathHelper.randomSeed()
    })

    setInterval(() => {
      Application.render()
    }, 1000 / fpsMax)

    setInterval(() => {
      Application.update()
    }, 1000 / ticksPerSecond)

    // Счетчик для дебага
    setInterval(() => {
      DebugHelper.count();
    }, 1000)

    //Application.UIManager.addElement("MainMenu", MainMenuUI.create());

    document.querySelector("canvas").onmousemove = (e) => {
      Application.UIManager.onmousemove([e.clientX, e.clientY]);
    }

    document.querySelector("canvas").onmousedown = (e) => {
      Application.UIManager.onmousedown([e.clientX, e.clientY]);
    }

    document.querySelector("canvas").onmouseup = (e) => {
      Application.UIManager.onmouseup([e.clientX, e.clientY]);
    }

    window.onkeydown = (e) => {
      Application.UIManager.onkeydown(e.key, e.code)
    }
  }

  static render() {
    this.EventBus.invoke(EventBus.TYPES.RENDER_FRAME_START, {});
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Application.World) {
      this.EventBus.invoke(EventBus.TYPES.RENDER_WORLD_START, {});
      Application.World.render();
      this.EventBus.invoke(EventBus.TYPES.RENDER_WORLD_END, {});
    }

    this.EventBus.invoke(EventBus.TYPES.RENDER_UI_START, {});
    Application.UIManager.update();
    Application.UIManager.render();
    this.EventBus.invoke(EventBus.TYPES.RENDER_UI_END, {});

    this.EventBus.invoke(EventBus.TYPES.RENDER_FRAME_END, {});
  }

  static update() {
    if (Application.World)
      Application.World.update();

    DebugHelper.update();
  }
}