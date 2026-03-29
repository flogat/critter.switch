# Critter Switch – Technisches Umsetzungsdokument (V1)

## 1. Zielbild

Eine tablet-optimierte PWA mit lokalem Speicher, pseudo-analytischem Scan-Flow, zufallsbasierter Ergebnislogik und optionaler KI-Transformation via API.

## 2. Architektur (Frontend-first)

## Stack (empfohlen)
- React + TypeScript
- Vite
- Zustand oder Redux Toolkit (kleiner globaler State)
- IndexedDB (Dexie) für lokale Daten
- React Router (zustandsbasierte Routen + Modals)
- Workbox Service Worker für PWA caching

## Schichten
1. **UI Layer** (Screens, Components, animations)
2. **Domain Layer** (scan engine, result randomizer, progression)
3. **Data Layer** (indexedDB repositories, settings store)
4. **Integration Layer** (camera APIs, OAuth, transform API)

## 3. Modulstruktur

```text
src/
  app/
    router.tsx
    providers.tsx
  modules/
    scan/
      scanMachine.ts
      fakeAnalysisEngine.ts
      resultEngine.ts
      rarityEngine.ts
    camera/
      cameraService.ts
    transform/
      transformService.ts
      promptBuilder.ts
    archive/
      archiveRepository.ts
    progression/
      xpService.ts
    settings/
      settingsStore.ts
    auth/
      authService.ts
  screens/
    HomeScreen.tsx
    CameraScreen.tsx
    AnalysisScreen.tsx
    ResultScreen.tsx
    TransformScreen.tsx
    ArchiveScreen.tsx
    DetailScreen.tsx
  db/
    schema.ts
    client.ts
  pwa/
    manifest.webmanifest
    sw.ts
```

## 4. State-Management

## Core App State
- `currentScreen`
- `activeScanSession`
- `analysisRuntime`
- `result`
- `transformJob`
- `networkStatus`
- `authStatus`

## Persistenter State
- `settings`
- `archiveEntries`
- `progression`

## 5. Datenmodell (V1)

## ScanSession
- `id`
- `createdAt`
- `sourceImageRef`
- `analysisDurationMs`
- `resultType` (human/suspect/kobold)
- `rarity?`
- `koboldClass?`

## TransformJob
- `id`
- `scanSessionId`
- `status` (queued/running/success/error)
- `promptPreset`
- `outputImageRef?`
- `errorCode?`

## ArchiveEntry
- `id`
- `savedAt`
- `classification`
- `rarity?`
- `stylePreset?`
- `originalImageRef`
- `transformImageRef?`
- `xpAwarded`

## UserSettings
- `analysisPace` (short/standard/dramatic)
- `hitRateProfile` (low/normal/chaotic)
- `stylePreset`
- `funMean`
- `cuteUgly`
- `cleanGrimy`
- `autoSavePolicy`
- `selectedModel`

## ProgressState
- `level`
- `xpCurrent`
- `xpTotal`
- `legendaryCount`
- `discoveredClasses`

## 6. Result Engine

## Baseline weights
- Human 45%
- Suspect 20%
- Kobold 35%

## Anti-Repetition
- penalize same `resultType` if repeated >=2x
- penalize same `rarity` if repeated recently
- rotate text pools without immediate duplicates

## Rarity distribution (kobold only)
- Common 60, Uncommon 25, Rare 10, Epic 4, Legendary 1

## 7. Fake Analysis Engine

- random duration from settings profile
- scripted phases:
  1) baseline acquisition
  2) spectral cross-check
  3) anomaly escalation
  4) lock-on finale
- emits UI frames every 200–400ms
- does **not** use biometric inference

## 8. Transform Service

- input: original image blob + style params + prompt template
- guard checks: online + auth + model
- timeout handling (e.g., 30–45s)
- retry with exponential backoff (max 2 in UI action scope)
- return generated image blob URL + metadata

## 9. Kamera-Modul

- `navigator.mediaDevices.getUserMedia`
- capture frame to canvas/blob
- permission error mapping:
  - denied
  - not found
  - in use

## 10. OAuth/API

- Google OAuth login/logout
- token state in memory + secure local persistence where needed
- show explicit “images sent only for transformation” disclosure
- model selector in settings

## 11. PWA-Anforderungen

- manifest with app name/icons/theme/background
- service worker:
  - precache app shell
  - runtime cache for static assets
  - network-first for transform calls (no cache)
- offline behavior:
  - scan flow available
  - transform unavailable with actionable message

## 12. UX/Performance Requirements

- landscape-first breakpoints
- large touch targets (>=44px)
- transition feedback under 100ms for tap interactions
- transform loading skeleton + progress narrative

## 13. Telemetrie (lokal oder optional)

- track counts only (no cloud by default)
- scans started/completed
- result distribution
- transform success/error rates

## 14. MVP Delivery Phasen

1. Shell + navigation + settings skeleton
2. camera + preview + fake analysis
3. result engine + result screens
4. archive + progression
5. transform integration + auth
6. PWA hardening + offline states + polish
