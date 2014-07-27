#include <pebble.h>

static Window *window;
static TextLayer *text_layer;
static TextLayer *top_layer;
int axis = 0;

enum {
  X_AXIS_UP = 0x0,
  X_AXIS_DOWN = 0x1,
  Y_AXIS_UP = 0x2,
  Y_AXIS_DOWN = 0x03,
};

static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
  if (axis == 0) {
    axis = 1;
    text_layer_set_text(top_layer, "X-Axis");
  } else {
    axis = 0;
    text_layer_set_text(top_layer, "Y-Axis");
  }
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  int message = (axis != 0) ? Y_AXIS_UP : X_AXIS_UP;
  text_layer_set_text(text_layer, "Up");
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);
  Tuplet value = TupletInteger(0, message);
  dict_write_tuplet(iter, &value);
  app_message_outbox_send();
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  int message = (axis != 0) ? Y_AXIS_DOWN : X_AXIS_DOWN;
  text_layer_set_text(text_layer, "Down");
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);
  Tuplet value = TupletInteger(0, message);
  dict_write_tuplet(iter, &value);
  app_message_outbox_send();
}

static void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
}
void out_sent_handler(DictionaryIterator* sent, void *context) {
  // outgoing message delivered
  APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message sent!");
}

void out_failed_handler(DictionaryIterator* failed, AppMessageResult reason, void* context) {
  // outgoing message failed
  APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message failed!");

}

static void app_message_init(void) {
  app_message_register_outbox_sent(out_sent_handler);
  app_message_register_outbox_failed(out_failed_handler);

  const uint32_t outbound_size = 64;
  const uint32_t inbound_size = 64;
  app_message_open(inbound_size, outbound_size);
}
static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  text_layer = text_layer_create((GRect) { .origin = { 0, 75 }, .size = { bounds.size.w, 50 } });
  text_layer_set_text(text_layer, "Press buttons to move Drone");
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(text_layer));

  top_layer = text_layer_create((GRect) { .origin = { 0, 20 }, .size = { bounds.size.w, 50 } });
  text_layer_set_text(top_layer, "X - Axis");
  text_layer_set_alignment(top_layer, GTextAlignmentCenter);
  text_layer_set_font(top_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
  layer_add_child(window_layer, text_layer_get_layer(top_layer));
}

static void window_unload(Window *window) {
  text_layer_destroy(text_layer);
}

static void init(void) {
  app_message_init();
  window = window_create();
  window_set_click_config_provider(window, click_config_provider);
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  const bool animated = true;
  window_stack_push(window, animated);
}

static void deinit(void) {
  window_destroy(window);
}

int main(void) {
  init();

  APP_LOG(APP_LOG_LEVEL_DEBUG, "Done initializing, pushed window: %p", window);

  app_event_loop();
  deinit();
}
