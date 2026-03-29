(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    const base = window.location.pathname.replace(/[^/]*$/, '');
    const swUrl = `${base}service-worker.js`;

    try {
      const registration = await navigator.serviceWorker.register(swUrl);

      // Force a SW update check on each load so GitHub Pages deployments are picked up quickly.
      registration.update();

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  });
})();
