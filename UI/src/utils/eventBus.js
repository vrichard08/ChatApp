class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName, callback) {
    if (!this.events[eventName]) return;
    
    if (callback) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    } else {
      delete this.events[eventName];
    }
  }

  emit(eventName, data) {
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach(callback => {
      callback(data);
    });
  }

  // Clear all events
  clear() {
    this.events = {};
  }
}

export default new EventBus(); 