export default
class EventEmitter {
  #events = {};

  emit(eventName, ...args) {
    if (!this.#events[eventName]) {
      return;
    }
    for (const func of this.#events[eventName]) {
      func.apply(this, [eventName, ...args]);
    }
  }

  on(eventName, func) {
    this.#events[eventName] = this.#events[eventName] || [];
    this.#events[eventName].push(func);
  }

  off (eventName, func = null) {
    if (func === null) {
      this.#events[eventName] = [];
      return;
    }
    this.#events[eventName] = this.#events[eventName].filter(fn => fn !== func);
  }

  once(eventName, func) {
    this.on(eventName, function handler () {
      this.off(eventName, handler);
      func.apply(this, arguments);
    });
  }
}
