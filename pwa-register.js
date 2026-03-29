(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const base = window.location.pathname.replace(/[^/]*$/, '');
    const swUrl = `${base}service-worker.js`;

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
})();
