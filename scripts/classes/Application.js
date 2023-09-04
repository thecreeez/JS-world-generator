class Application {
  static UIManager = new UIManager(document.querySelector("canvas"));
  static EventBus = new EventBus();

  static World;
  static DEBUG_MODE = false;

  static TEXTURE_SIZE = 1;

  static MAX_FPS = 60;
  static MAX_TICKS = 20;

  static MAX_CHANGE_BLOCKS_PER_COMMAND = 100000;

  static _logoTime = 2000;
  static _keyToLogoStartsDissapear = 500;
  static _currentLogoTime = Application._logoTime;

  static mousePos = [0,0]

  static _deltaTimes = {
    update: Date.now(),
    render: Date.now()
  }

  static RandomTypes = {
    FullRandom: "Случайно",
    SeedRandom: "Псевдослучайно"
  }

  static RandomMethod = Application.RandomTypes.FullRandom;

  static Profilers = {
    FPS_PROFILER: DebugHelper.createProfiler(),
    UPS_PROFILER: DebugHelper.createProfiler(),
  }

  static start({ debug = false, ticksPerSecond = 60, fpsMax = 144 }) {
    Application.DEBUG_MODE = debug;
    Application.MAX_FPS = fpsMax;
    Application.MAX_TICKS = ticksPerSecond;

    this.EventBus.invoke(EventBus.TYPES.APPLICATION_START, {
      debug,
      ticksPerSecond,
      fpsMax
    })

    Application.UIManager.addElement("cameraUI", CameraMenuUI.create([0, 0]));

    if (Application.DEBUG_MODE) {
      Application.UIManager.addElement(DebugHelper.DEBUG_HELPER_MENU_ID, DebugMenuUI.create([0, 0]));

      Application.UIManager.getElement(DebugHelper.DEBUG_HELPER_MENU_ID).pinTo(Application.UIManager.getElement("cameraUI"))
    }

    Application.World = new World({
      seed: MathHelper.randomSeed()
    })

    setInterval(() => {
      Application.render(Date.now() - Application._deltaTimes.render)
      Application._deltaTimes.render = Date.now();
    }, 1000 / fpsMax)

    setInterval(() => {
      Application.update(Date.now() - Application._deltaTimes.update)
      Application._deltaTimes.update = Date.now();
    }, 1000 / ticksPerSecond)

    // Счетчик для дебага
    setInterval(() => {
      DebugHelper.count();
    }, 1000)

    document.querySelector("canvas").onmousemove = (e) => {
      Application.UIManager.onmousemove([e.clientX, e.clientY]);

      Application.mousePos = [e.clientX, e.clientY];
    }

    document.querySelector("canvas").onmousedown = (e) => {
      Application.UIManager.onmousedown([e.clientX, e.clientY]);
    }

    document.querySelector("canvas").onmouseup = (e) => {
      Application.UIManager.onmouseup([e.clientX, e.clientY]);
    }

    window.onkeydown = (e) => {
      Application.UIManager.onkeydown(e.key, e.code)

      switch (e.code) {
        case "KeyW": Application.World.camera.move([0, -Application.World.camera.getSpeed()]);  break;
        case "KeyA": Application.World.camera.move([-Application.World.camera.getSpeed(), 0]); break;
        case "KeyS": Application.World.camera.move([0, Application.World.camera.getSpeed()]); break;
        case "KeyD": Application.World.camera.move([Application.World.camera.getSpeed(), 0]); break;
        case "Enter": {
          let chunkPos = Application.World.camera.getChunkPos();
          Application.World.setChunk(chunkPos[0], chunkPos[1], WorldGenerator.generateChunk(Application.World, chunkPos[0], chunkPos[1], Application.World.getAdjacentChunks(chunkPos[0], chunkPos[1])))
          break;
        }
      }
    }
  }

  static render(deltaTime) {
    this.EventBus.invoke(EventBus.TYPES.RENDER_FRAME_START, {});
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Application.World) {
      this.EventBus.invoke(EventBus.TYPES.RENDER_WORLD_START, {});
      let backColor = Application.World.getBackgroundColor();
      ctx.fillStyle = `rgb(${backColor[0]},${backColor[1]},${backColor[2]})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      Application.World.render(deltaTime);
      this.EventBus.invoke(EventBus.TYPES.RENDER_WORLD_END, {});
    }

    this.EventBus.invoke(EventBus.TYPES.RENDER_UI_START, {});
    if (Application._currentLogoTime > 0) {
      this.renderLogo();
      Application._currentLogoTime -= deltaTime;
    }

    Application.UIManager.update();
    Application.UIManager.render();
    this.EventBus.invoke(EventBus.TYPES.RENDER_UI_END, {});

    this.EventBus.invoke(EventBus.TYPES.RENDER_FRAME_END, {});
  }

  static update(deltaTime) {
    if (Application.World)
      Application.World.update(deltaTime);

    DebugHelper.update();
  }

  static renderLogo() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    ctx.font = "40px arial"

    let text = "[thecreeez generation]";

    ctx.fillStyle = `rgba(${255 - Application.World.getBackgroundColor()[[0]]},${255 - Application.World.getBackgroundColor()[1]},${255 - Application.World.getBackgroundColor()[2]},${Application._currentLogoTime / Application._keyToLogoStartsDissapear})`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
}