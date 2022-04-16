const globalScope = this;

export default
class DependencyInjection {
  #instances = {};

  #proxy = null;

  #parent = null;

  #scope = null;

  #stack = [];

  static createRoot(scope = null) {
    const di = new DependencyInjection(scope, null);
    di.set('di', di);
    return di;
  }

  constructor(scope = null, parent = null) {
    this.#parent = parent;

    this.#scope = scope || globalScope;

    this.#proxy = new Proxy({}, {
      get: (target, name) => this.get(name),
      set: (target, name, value) => this.set(name, value)
    });
  }

  set(name, value) {
    this.#instances[name] = value;
  }

  get(nameOrClass) {
    const className = typeof nameOrClass === 'string' ? nameOrClass : nameOrClass.prototype.constructor.name;
    if (this.#instances[className]) {
      return this.#instances[className];
    }
    if (this.#parent) {
      return this.#parent.get(nameOrClass);
    }
    const clsConstr = typeof nameOrClass === 'string' ? (this.#scope[nameOrClass] || eval(nameOrClass)) : nameOrClass;
    if (this.#stack.find((fn) => fn === className)) {
      throw new Error(`Circular dependency found ${this.#stack.join(' -> ')} -> ${className}`);
    }
    this.#stack.push(className);
    this.#instances[className] = new clsConstr(this.#proxy);
    this.#stack.pop();
    return this.#instances[className];
  }

  scope(scope = null) {
    return new DependencyInjection(scope, this);
  }
}
