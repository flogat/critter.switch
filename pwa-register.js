(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  async function buildVersionedSwUrl(swUrl) {
    try {
      const response = await fetch(swUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to fetch service worker (${response.status})`);

      const source = await response.text();
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
      const hash = Array.from(new Uint8Array(digest))
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 16);

      return `${swUrl}?v=${hash}`;
    } catch (error) {
      console.warn('Service worker version check failed, using fallback URL:', error);
      return swUrl;
    }
  }

  window.addEventListener('load', async () => {
    const base = window.location.pathname.replace(/[^/]*$/, '');
    const swUrl = `${base}service-worker.js`;

    try {
      const versionedSwUrl = await buildVersionedSwUrl(swUrl);
      const registration = await navigator.serviceWorker.register(versionedSwUrl);

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
