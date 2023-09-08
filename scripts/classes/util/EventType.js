class EventType {
  static APPLICATION_START = "app_start"

  static RENDER_FRAME_START = "render_frame_start"
  static RENDER_WORLD_START = "render_world_start"
  static RENDER_WORLD_END = "render_world_end"
  static RENDER_UI_START = "render_ui_start"
  static RENDER_UI_END = "render_ui_end"
  static RENDER_FRAME_END = "render_frame_end"

  static UPDATE_START = "update_start"

  static UPDATE_CHUNK_GENERATE_START = "update_chunk_generate_start"
  static UPDATE_CHUNK_GENERATE_END = "update_chunk_generate_end"
  static UPDATE_CHUNK_BAKE_START = "update_chunk_bake_start"
  static UPDATE_CHUNK_BAKE_END = "update_chunk_bake_end"

  static UPDATE_END = "update_end"

  static GENERATE_WORLD_REQUEST = "generate_world_request"

  static ON_CHUNK_GENERATE = "on_chunk_generate";
  static ON_NEARBY_CHUNK_GENERATES = "on_nearby_chunk_generate";

  static ON_CHUNK_BAKE = "on_chunk_bake";
  static ON_NEARBY_CHUNK_BAKE = "on_nearby_chunk_bake"

  static getById(id) {
    let out = null;

    for (let name in this) {
      if (this[name] == id) {
        out = this[name];
      }
    }

    return out;
  }
}