# Critter Switch (GitHub Pages PWA)

Critter Switch is now set up as an installable **Progressive Web App (PWA)** optimized for **tablet landscape** and designed to be used directly from its GitHub Pages URL.

## What is included

- Installable web app manifest (`manifest.webmanifest`)
- Service worker app-shell caching (`service-worker.js`) for offline use after first load
- PWA/mobile meta tags in `index.html`
- Landscape-first configuration (`orientation: "landscape"` in manifest)
- App icon: `icons/icon.svg`
- GitHub Actions workflow for automatic GitHub Pages deployment

## Run locally (optional)

Local development is optional and not required for normal use:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

> Note: PWA installability requires **HTTPS** or `localhost`.

## Publish on GitHub Pages (recommended primary workflow)

### 1) Push this repository to GitHub

Make sure this workflow file exists:

- `.github/workflows/deploy.yml`

### 2) Enable GitHub Pages for Actions deployment

In your GitHub repository:

1. Go to **Settings → Pages**
2. Under **Build and deployment**, set:
   - **Source** = `GitHub Actions`

No `/docs` branch publishing setup is needed because deployment is handled by the workflow.

### 3) Deploy

- Push to `main` (or trigger **Actions → Deploy Critter Switch to GitHub Pages → Run workflow**).
- Wait until the workflow finishes successfully.

### 4) Open your hosted app URL

GitHub Pages URL pattern:

- User/Org site repo (`<username>.github.io`):
  - `https://<username>.github.io/`
- Project repo (typical):
  - `https://<username>.github.io/<repository-name>/`

For this project repository, expect the second pattern.

## Repository subpath hosting support

Yes. This app is configured to work when hosted either:

- at domain root (`/`), or
- under a repository subpath (`/<repo>/`)

How this is handled:

- relative links in HTML (`styles.css`, `app.js`, icon paths)
- manifest with relative `start_url` and `scope` (`./`)
- service worker registration built from the current path
- service worker cache list uses relative app-shell entries

## Install on iPad (Safari)

1. Open your GitHub Pages HTTPS URL in **Safari**.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Confirm name and tap **Add**.
5. Launch from the home screen icon.

## Install on Android (Chrome)

1. Open your GitHub Pages HTTPS URL in **Chrome**.
2. Wait for install prompt, or tap menu (`⋮`) → **Install app** / **Add to Home screen**.
3. Confirm install.

## Offline behavior

- First visit downloads and caches app shell files.
- After first successful load, app can open offline.
- Dynamic online-only parts (e.g., network-dependent transform simulation gate) still respect online/offline status in the UI logic.

## iPad/iOS PWA limitations (important)

- Web Push support and background behavior differ from desktop/Android.
- Storage can be cleared by iOS under space pressure.
- Some browser APIs are more restricted in home-screen mode.
- Camera/media permissions may be stricter and can require user interaction context.

## Project structure

- `index.html` – App layout, PWA meta tags, manifest wiring
- `styles.css` – Neon scanner visuals
- `app.js` – Existing scanner interactions and local archive logic
- `manifest.webmanifest` – Install metadata, icons, standalone display, landscape preference
- `service-worker.js` – App-shell cache strategy for offline use
- `pwa-register.js` – Service worker registration compatible with subpaths
- `.github/workflows/deploy.yml` – CI deploy to GitHub Pages
- `icons/icon.svg` – PWA icons

## Product design artifacts

- `docs/wireflow.md` – screen flow and transitions
- `docs/technical-implementation-plan.md` – architecture/state/data/PWA plan
- `docs/prompt-design.md` – kobold transformation prompt templates
- `docs/mvp-task-plan.md` – phased implementation roadmap
- `docs/product-ux-design.md` – product and UX design document
