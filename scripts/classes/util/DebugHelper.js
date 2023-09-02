class DebugHelper {
  static FPS = 0;
  static _FPS_ON_THIS_SECOND = 0;

  static UPS = 0;
  static _UPS_ON_THIS_SECOND = 0;

  static update() {
    DebugHelper._UPS_ON_THIS_SECOND++;
    offsetX += 1 * World.TICK_SPEED;
  }

  static render() {
    DebugHelper._FPS_ON_THIS_SECOND++;

    /**
     * TO-DO: MAKE EVENTBUS AND MOVE THIS SOMEWHERE....
     */
    if (UIManagerInstance.getElement("DebugMenu").hasElement("ProfilerDataFPSContainer")) {
      UIManagerInstance.getElement("DebugMenu").removeElement("ProfilerDataFPSContainer")
    }

    UIManagerInstance.getElement("DebugMenu").addElement(`ProfilerDataFPSContainer`, new UIContainer({
      manager: UIManagerInstance,
      pos: [0, 0],
      isActive: true,
      isRender: true,
      name: "Frame Profiler"
    }))

    FPS_PROFILER.getTasks().forEach((task, id) => {
      UIManagerInstance.getElement("DebugMenu").getElement("ProfilerDataFPSContainer").addElement(`DataLabel${id}`, new UILabel({
        manager: UIManagerInstance,
        isRender: true,
        text: `[${DebugHelper.getDate()}] ${task.name}: ${task.time}ms`
      }))
    })

    FPS_PROFILER.clear();
  }

  static count() {
    DebugHelper.FPS = DebugHelper._FPS_ON_THIS_SECOND;
    DebugHelper._FPS_ON_THIS_SECOND = 0;

    DebugHelper.UPS = DebugHelper._UPS_ON_THIS_SECOND;
    DebugHelper._UPS_ON_THIS_SECOND = 0;

    UIManagerInstance.getElement("DebugMenu").getElement("UpsAndFpsLabel").setValue(`FPS: ${DebugHelper.FPS} UPS: ${DebugHelper.UPS}`)
  }

  static createProfiler() {
    return {
      _tasks: new Map(),
      _doneTasks: [],

      startTask(name) {
        this._tasks.set(name, Date.now());
      },

      endTask(name) {
        if (!this._tasks.get(name)) {
          return;
        }

        this._doneTasks.push({
          name: name,
          time: Date.now() - this._tasks.get(name)
        })
      },

      getTasks() {
        return this._doneTasks;
      },

      clear() {
        this._tasks = new Map();
        this._doneTasks = [];
      }
    }
  }

  static getDate() {
    let date = new Date();

    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  }
}