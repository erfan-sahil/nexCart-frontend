type Listener = (active: boolean) => void;

let active = false;
const listeners = new Set<Listener>();

export function isSearchInteractionActive() {
  return active;
}

export function setSearchInteractionActive(next: boolean) {
  if (active === next) return;
  active = next;
  listeners.forEach((listener) => listener(active));
}

export function subscribeSearchInteraction(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
