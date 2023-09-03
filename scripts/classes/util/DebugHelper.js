class DebugHelper {
  static FPS = 0;
  static _FPS_ON_THIS_SECOND = 0;

  static UPS = 0;
  static _UPS_ON_THIS_SECOND = 0;

  static DEBUG_HELPER_MENU_ID = "DebugMenu";

  static update() {
    DebugHelper._UPS_ON_THIS_SECOND++;
  }

  static render() {
    DebugHelper._FPS_ON_THIS_SECOND++;
  }

  static count() {
    DebugHelper.FPS = DebugHelper._FPS_ON_THIS_SECOND;
    DebugHelper._FPS_ON_THIS_SECOND = 0;

    DebugHelper.UPS = DebugHelper._UPS_ON_THIS_SECOND;
    DebugHelper._UPS_ON_THIS_SECOND = 0;

    if (Application.DEBUG_MODE) {
      Application.UIManager.getElement("DebugMenu").getElement("UpsAndFpsLabel").setValue(`FPS: ${DebugHelper.FPS} UPS: ${DebugHelper.UPS}`)
    }
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

      addCustomTask(name, time) {
        this._doneTasks.push({
          name: name,
          time: time
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