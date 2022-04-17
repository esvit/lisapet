export default
class State {
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
    return new Proxy(this, {
      get(object, key) {
        const state = object.getState();
        const value = state[key];
        const mutation = object.mutations[key];
        const action = object[key];

        if ((value && mutation) || (value && action) || (mutation && action)) {
          throw new Error('State has variable and mutation with the same name');
        }
        if (action) {
          return (...args) => action.apply(object, [mapMutations(object.mutations, { state }), ...args])
        }
        if (mutation) {
          return (...args) => mutation.apply(object, [{ state }, ...args])
        }
        return value;

        function mapMutations(mutations, ctx) {
          let mutationsCache = mutations.__cache;
          if (!mutationsCache) {
            mutationsCache = {};
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
      set(object, key, value, proxy) {
        const state = object.getState();
        if (state[key] !== value) {
          state[key] = value;
        }
        return true;
      }
    })
  }
}
