class EventBus {
  static TYPES = {
    
  }

  constructor() {
    this._subscribers = {};
  }

  subscribe(eventName, func) {
    if (!EventType.getById(eventName)) {
      return console.error(`EventType with id ${eventName} isn't exist in EventType context (Register it to static context).`)
    }

    if (!this._subscribers[eventName]) {
      this._subscribers[eventName] = [];
    }

    this._subscribers[eventName].push(func);
  }

  invoke(eventName, data) {
    if (!EventType.getById(eventName)) {
      return console.error(`EventType with id ${eventName} isn't exist in EventType context (Register it to static context).`)
    }
    
    if (!this._subscribers[eventName]) {
      return;
    }

    this._subscribers[eventName].forEach((subscriber) => {
      subscriber(data);
    })
  }
}