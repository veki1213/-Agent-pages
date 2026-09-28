(() => {
  let adapter = null;
  let mountedAdapter = null;
  let mountedRoot = null;
  let cleanup = null;

  function unmount() {
    if (typeof cleanup === 'function') cleanup();
    cleanup = null;
    mountedAdapter = null;
    mountedRoot = null;
  }

  function mount() {
    const root = document.querySelector('[data-testid="knowledge-view"]');
    if (!adapter || !root || root.hidden) return false;
    if (mountedAdapter === adapter && mountedRoot === root) return true;
    unmount();
    const dispose = adapter.mount(Object.freeze({ root }));
    cleanup = typeof dispose === 'function' ? dispose : null;
    mountedAdapter = adapter;
    mountedRoot = root;
    return true;
  }

  function configure(nextAdapter) {
    if (!nextAdapter || typeof nextAdapter.mount !== 'function') {
      throw new TypeError('Knowledge prototype adapter must provide mount({ root })');
    }
    unmount();
    adapter = nextAdapter;
    mount();
    return bridge;
  }

  const bridge = Object.freeze({ configure, mount, unmount });
  window.KnowledgePrototypeBridge = bridge;
  window.configureKnowledgePrototype = configure;
})();
