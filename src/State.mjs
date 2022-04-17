import EventEmitter from './EventEmitter.mjs';

const EMITTER_FUNCS = Object.getOwnPropertyNames(EventEmitter.prototype);

export default
class State extends EventEmitter {
  #localState = null;

  get state() {
    throw new Error('State is not defined');
  }

  get mutations() {
    throw new Error('Mutations is not defined');
  }

  getState() {
    if (this.#localState === null) {
      this.#localState = this.state;
    }
    return this.#localState;
  }

  constructor() {
    super();

    return new Proxy(this, {
      get(object, key) {
        const state = object.getState();
        const value = state[key];
        const mutation = object.mutations[key];
        const action = typeof object[key] === 'function' ? object[key] : null;

        if ((value && mutation) || (value && action) || (mutation && action)) {
          throw new Error(`State has variable and mutation with the same name ${key}`);
        }
        if (action) {
          if (EMITTER_FUNCS.includes(key)) {
            return (...args) => action.apply(object, args);
          }
          return (...args) => action.apply(object, [mapMutations(object.mutations, { state, emit: object.emit.bind(object) }), ...args])
        }
        if (mutation) {
          return (...args) => mutation.apply(object, [{ state, emit: object.emit.bind(object) }, ...args])
        }
        return value;

        function mapMutations(mutations, ctx) {
          let mutationsCache = mutations.__cache;
          if (!mutationsCache) {
            mutationsCache = { ...ctx };
            const keys = Object.keys(mutations);
            for (const name of keys) {
              const mutation = mutations[name];
              mutationsCache[name] = (...args) => mutation.apply(object, [ctx, ...args])
            }
            mutations.__cache = mutationsCache;
          }
          return mutationsCache;
        }
      },
      set(object, key) {
        throw new Error(`Property ${key} is readonly`);
      }
    })
  }
}
