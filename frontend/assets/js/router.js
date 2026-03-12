// Simple view router for the SCLAPP SPA

let routes = {};
let mainElement = null;

export function initRouter({ mainElement: element, routes: routesMap }) {
  mainElement = element;
  routes = routesMap || {};
}

export function navigateTo(viewId) {
  if (!mainElement) return;
  const render = routes[viewId];
  if (typeof render === 'function') {
    render(mainElement);
  }
}

