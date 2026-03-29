# Critter Switch (GitHub Pages PWA)

Critter Switch ist als installierbare **Progressive Web App (PWA)** eingerichtet, für **Tablet-Landscape** optimiert und direkt über die GitHub-Pages-URL nutzbar.

## Enthaltene Funktionen

- Installierbares Web-App-Manifest (`manifest.webmanifest`)
- Service-Worker App-Shell-Caching (`service-worker.js`) für Offline-Nutzung nach dem ersten Laden
- PWA-/Mobile-Meta-Tags in `index.html`
- Landscape-First-Konfiguration (`orientation: "landscape"` im Manifest)
- App-Icon: `icons/icon.svg`
- GitHub-Actions-Workflow für automatische GitHub-Pages-Deployments
- Vollständiger MVP-Flow inkl. Detailansicht, Transform-Fehlerpfad, Retry und Save-without-transform
- Deutsche UI-Texte und deutsche Produktdokumentation

## Lokal starten (optional)

```bash
python3 -m http.server 8080
```

Dann `http://localhost:8080` öffnen.

> Hinweis: PWA-Installierbarkeit erfordert **HTTPS** oder `localhost`.

## Auf GitHub Pages veröffentlichen (empfohlener Workflow)

### 1) Repository nach GitHub pushen

Sicherstellen, dass diese Workflow-Datei vorhanden ist:

- `.github/workflows/deploy.yml`

### 2) GitHub Pages für Actions-Deployment aktivieren

In deinem GitHub-Repository:

1. **Settings → Pages** öffnen
2. Unter **Build and deployment** setzen:
   - **Source** = `GitHub Actions`

Keine `/docs`-Branch-Publishing-Konfiguration nötig, weil das Deployment per Workflow läuft.

### 3) Deployen

- Auf `main` pushen (oder **Actions → Deploy Critter Switch to GitHub Pages → Run workflow** ausführen).
- Warten, bis der Workflow erfolgreich beendet ist.

### 4) Gehostete App-URL öffnen

GitHub-Pages-URL-Schema:

- User/Org-Site-Repo (`<username>.github.io`):
  - `https://<username>.github.io/`
- Projekt-Repo (typisch):
  - `https://<username>.github.io/<repository-name>/`

Für dieses Projekt wird in der Regel das zweite Muster genutzt.

## Hosting im Repository-Unterpfad

Die App funktioniert sowohl:

- auf Domain-Root (`/`), als auch
- in einem Repository-Unterpfad (`/<repo>/`)

Umsetzung:

- relative Links in HTML (`styles.css`, `app.js`, Icon-Pfade)
- Manifest mit relativen `start_url` und `scope` (`./`)
- Service-Worker-Registrierung aus aktuellem Pfad
- relative App-Shell-Einträge in der Cache-Liste

## Installation auf iPad (Safari)

1. GitHub-Pages-HTTPS-URL in **Safari** öffnen.
2. Auf **Teilen** tippen.
3. **Zum Home-Bildschirm** wählen.
4. Namen bestätigen und **Hinzufügen** tippen.
5. Über das Homescreen-Icon starten.

## Installation auf Android (Chrome)

1. GitHub-Pages-HTTPS-URL in **Chrome** öffnen.
2. Auf Installationshinweis warten oder Menü (`⋮`) → **App installieren** / **Zum Startbildschirm hinzufügen**.
3. Installation bestätigen.

## Offline-Verhalten

- Erster Besuch lädt und cached die App-Shell-Dateien.
- Nach erfolgreichem Erstladen ist die App offline startbar.
- Online-abhängige Teile (z. B. Transformationslauf) werden im UI sauber über Guards behandelt.

## KI-Transformation konfigurieren (native Gemini API, ohne eigenes Backend)

1. In Google AI Studio einen eigenen API Key erzeugen.
2. In der App unter **Einstellungen** den Key unter **Google API Key** eintragen.
3. Modell auswählen (Standard: **Nano Banana 2 / Gemini 3.1 Flash Image Preview**).
4. Optional die API-Basis-URL anpassen (Standard: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`).

Die App baut daraus automatisch den nativen Gemini-Endpunkt im Format
`/v1beta/models/{model}:generateContent`, ergänzt den `key`-Query-Parameter und sendet zusätzlich den Header `x-goog-api-key`.

Der Request nutzt das native Gemini-Format (`contents[].parts[]` + `inlineData`) und fordert Bildausgabe über `generationConfig.responseModalities = ["IMAGE"]` an.

## Projektstruktur

- `index.html` – App-Layout, PWA-Meta, Manifest-Verknüpfung
- `styles.css` – Neon-Scanner-Visuals
- `app.js` – Scanner-Flow, lokale Sammlung, Detailansicht, Transform-Guards/Fehlerpfad
- `manifest.webmanifest` – Install-Metadaten, Icons, Standalone, Landscape-Präferenz
- `service-worker.js` – App-Shell-Cache-Strategie
- `pwa-register.js` – Service-Worker-Registrierung mit Subpath-Support
- `.github/workflows/deploy.yml` – CI-Deployment auf GitHub Pages
- `icons/icon.svg` – PWA-Icons

## Produktdokumentation

- `docs/wireflow.md` – Screenflow und Übergänge
- `docs/technical-implementation-plan.md` – Architektur/State/Daten/PWA-Plan
- `docs/prompt-design.md` – Prompt-Bausteine für Kobold-Transformation
- `docs/mvp-task-plan.md` – MVP-Roadmap mit Umsetzungsstatus
- `docs/product-ux-design.md` – Produkt- und UX-Design-Dokument
