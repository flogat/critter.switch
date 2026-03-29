# Critter Switch – Technisches Umsetzungsdokument (V1)

## 1) Zielbild und Leitplanken

Critter Switch ist eine **Entertainment-first PWA** für Tablet-Landscape. Der Kernloop ist inszeniert (Fake-Analyse + Zufallsentscheidung), während die Bildtransformation via API der reale technische Effekt ist.

**Nicht-Ziele für V1:**
- keine echte Gesichtsanalyse
- kein Multiplayer / keine Cloud-Profile
- keine Monetarisierung

## 2) Architekturübersicht

## Empfohlener Stack
- React + TypeScript + Vite
- React Router (state-driven Flows + modal routes)
- Zustand (UI- und Domain-State)
- Dexie (IndexedDB Persistenz)
- Workbox (Service Worker, App-Shell Caching)

## Layer-Modell
1. **Presentation Layer** (Screens, Komponenten, Animation)
2. **Flow/Domain Layer** (Scan-Flow, State-Machine, Result Engine, XP)
3. **Persistence Layer** (Archive, Settings, Progress in IndexedDB)
4. **Integration Layer** (Kamera, OAuth, Transform-API, Netzwerkstatus)

## 3) Modulstruktur (Vorschlag)

```text
src/
  app/
    router.tsx
    providers.tsx
    appStore.ts
  flows/
    scanFlowMachine.ts
  modules/
    camera/
      cameraService.ts
      captureUtils.ts
    analysis/
      fakeAnalysisEngine.ts
      analysisTextPool.ts
    results/
      resultEngine.ts
      rarityEngine.ts
      antiRepetition.ts
    transform/
      transformService.ts
      promptComposer.ts
      transformGuards.ts
    archive/
      archiveRepository.ts
      archiveSelectors.ts
    progression/
      xpEngine.ts
      levelEngine.ts
    settings/
      settingsStore.ts
    auth/
      googleAuthService.ts
  db/
    schema.ts
    client.ts
  pwa/
    manifest.webmanifest
    sw.ts
```

## 4) App State und State-Machine

## Globaler Zustand
- `currentScreen`
- `previousScreen`
- `networkStatus` (`online` | `offline`)
- `authStatus` (`connected` | `missing` | `error`)

## Flow-spezifischer Zustand
- `activeScanSession`
- `analysisRuntime` (phase, elapsedMs, totalMs)
- `resultState` (human/suspect/kobold + metadata)
- `transformJob` (idle/running/success/error)

## Ziel-State-Machine
```text
BOOT -> HOME -> CAMERA -> PHOTO_PREVIEW -> ANALYZING
ANALYZING -> RESULT_HUMAN | RESULT_SUSPECT | RESULT_KOBOLD
RESULT_KOBOLD -> TRANSFORMING -> TRANSFORM_RESULT | TRANSFORM_ERROR
TRANSFORM_ERROR -> TRANSFORMING (retry) | RESULT_KOBOLD
ARCHIVE <-> DETAIL
SETTINGS -> previous
OAUTH_SETUP -> previous or transform context
```

## 5) Datenmodell (IndexedDB)

## Tabelle `scanSessions`
- `id`
- `createdAt`
- `originalImageRef`
- `analysisDurationMs`
- `resultType` (`human` | `suspect` | `kobold`)
- `anomalyScore?`
- `koboldClass?`
- `rarity?`

## Tabelle `transformJobs`
- `id`
- `scanSessionId`
- `status` (`queued` | `running` | `success` | `error`)
- `model`
- `stylePreset`
- `promptVersion`
- `outputImageRef?`
- `errorCode?`
- `startedAt`
- `finishedAt?`

## Tabelle `archiveEntries`
- `id`
- `scanSessionId`
- `savedAt`
- `classification`
- `rarity?`
- `stylePreset?`
- `originalImageRef`
- `transformImageRef?`
- `xpAwarded`

## Tabelle `settings`
- `analysisPace` (`short` | `standard` | `dramatic`)
- `hitRateProfile` (`low` | `normal` | `chaotic`)
- `stylePreset`
- `funMean`
- `cuteUgly`
- `cleanGrimy`
- `selectedModel`
- `autoSaveBehavior`

## Tabelle `progression`
- `level`
- `xpCurrent`
- `xpTotal`
- `legendaryCount`
- `discoveredClasses`
- `lastUnlock`

## 6) Result Engine (Random + Anti-Repetition)

## Baseline (Standard)
- Human: 45%
- Suspect: 20%
- Kobold: 35%

## Alternative Family-Fun Profil
- Human: 35%
- Suspect: 15%
- Kobold: 50%

## Kobold-Rarity
- Common 60%
- Uncommon 25%
- Rare 10%
- Epic 4%
- Legendary 1%

## Anti-Repetition Regeln
- gleicher `resultType` >2x in Folge bekommt temporäre Strafe
- gleiche `rarity` in kurzer Folge wird heruntergewichtet
- Textbausteine rotieren ohne direkte Duplikate

## 7) Fake Analysis Engine

- Laufzeit 10–20 Sekunden (settings-abhängig)
- Phasen:
  1. Subject Acquisition
  2. Humanoid Shell Check
  3. Spectral Residue Scan
  4. Glamour Veil Inspection
  5. Classification Lock
- UI-Ticks alle 200–400ms
- letzte 20%: verstärkter Lock-on Effekt

**Wichtig:** keine biometrische Auswertung; rein dramaturgisch.

## 8) Transform Service (API)

## Guards vor Start
- online?
- OAuth verbunden?
- Modell gewählt?

## Ablauf
1. Prompt aus Settings + Klassifikation bauen
2. API-Request mit Originalbild senden
3. Timeout (z. B. 45s)
4. Retry (max 2, exponentieller Backoff)
5. Ergebnisbild lokal speichern und referenzieren

## Fehlerklassen
- `network`
- `timeout`
- `auth`
- `api_unknown`

## 9) Kamera-Modul

- `getUserMedia` mit Tablet-optimierter Auflösung
- Capture via Canvas Snapshot
- Permission States:
  - denied
  - prompt
  - granted
- Fallback-Screen bei blockierter Kamera

## 10) OAuth und Sicherheit

- Google OAuth Login/Logout
- Token nur für Transform-Flow nutzen
- UI-Disclosure: Bilder bleiben lokal; nur ausgewählte Bilder werden zur Transformation gesendet
- Keine serverseitige Familien-Cloud in V1

## 11) PWA und Offline

## Muss-Kriterien
- installierbar (Manifest + Icons)
- App-Shell offline nutzbar
- Home/Archive/Settings offline verfügbar
- Transform offline klar deaktiviert + Retry-Hinweis

## Service Worker Strategie
- precache: shell, fonts, icons, core routes
- runtime cache: statische Assets
- network-first: API Transform Requests

## 12) Performance- und UX-Budgets

- Touch Targets >= 44px
- Tap-Feedback < 100ms
- Screen-Wechsel flüssig auf typischen Tablets
- Analyse/Tansform States nie ohne sichtbares Feedback

## 13) Umsetzung in Inkrementen

1. Shell + Routing + Theme-Tokens
2. Camera + Preview + Fake Analysis
3. Result Engine + Result Screens
4. Archive + Detail + Persistenz
5. Progression + XP/Level
6. OAuth + Transform API + Error Handling
7. PWA Hardening + Offline + QA
