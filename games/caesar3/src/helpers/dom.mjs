export
function addClass(elements, ...args) {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el.classList.add(...args));
}

export
function removeClass(elements, ...args) {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el.classList.remove(...args));
}

export
function addEvent(el, event, func) {
  const callback = (e) => {
    e.preventDefault();
    func(e);
  };
  el.addEventListener(event, callback);
  return () => {
    el.removeEventListener(event, callback);
  };
}

export
function addEventOnce(el, event, func) {
  const callback = (e) => {
    e.preventDefault();
    el.removeEventListener(event, callback);
    func(e);
  };
  el.addEventListener(event, callback);
}
