class EventBus {
  static TYPES = {
    APPLICATION_START: "app_start",

    RENDER_FRAME_START: "render_frame_start",
    RENDER_WORLD_START: "render_world_start",
    RENDER_WORLD_END: "render_world_end",
    RENDER_UI_START: "render_ui_start",
    RENDER_UI_END: "render_ui_end",
    RENDER_FRAME_END: "render_frame_end",

    UPDATE_START: "update_start",

    UPDATE_CHUNK_GENERATE_START: "update_chunk_generate_start",
    UPDATE_CHUNK_GENERATE_END: "update_chunk_generate_end",
    UPDATE_CHUNK_BAKE_START: "update_chunk_bake_start",
    UPDATE_CHUNK_BAKE_END: "update_chunk_bake_end",

    UPDATE_END: "update_end",

    GENERATE_WORLD_REQUEST: "generate_world_request"
  }

  constructor() {
    this._subscribers = {};
  }

  subscribe(eventName, func) {
    if (!this._subscribers[eventName]) {
      this._subscribers[eventName] = [];
    }

    this._subscribers[eventName].push(func);
  }

  invoke(eventName, data) {
    if (!this._subscribers[eventName]) {
      return;
    }

    this._subscribers[eventName].forEach((subscriber) => {
      subscriber(data);
    })
  }
}