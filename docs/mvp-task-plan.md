# Critter Switch – MVP Task-Plan

## Phase 0 – Foundation (1–2 days)

- [ ] Project bootstrap (React + TS + Vite)
- [ ] Basic layout shell for tablet landscape
- [ ] Theme tokens and core components (buttons/panels/badges)
- [ ] Routing scaffold for all target screens

**Deliverable:** clickable skeleton without business logic.

## Phase 1 – Core Scan Loop (3–4 days)

- [ ] Camera permission + live preview
- [ ] Photo capture + preview (use/retake)
- [ ] Fake analysis engine with timed narrative feed
- [ ] Result engine (human/suspect/kobold) with weighted randomness
- [ ] Result screens with primary CTAs

**Deliverable:** complete entertainment loop without AI transform.

## Phase 2 – Local Persistence & Collection (2–3 days)

- [ ] IndexedDB schema + repository layer
- [ ] Save result entries (human/suspect/kobold)
- [ ] Archive grid + filters
- [ ] Detail view for entries

**Deliverable:** local collection and replayability baseline.

## Phase 3 – Progression System (1–2 days)

- [ ] XP award rules
- [ ] Level calculation model
- [ ] Progress widget on home/archive/result

**Deliverable:** visible progression and reward loop.

## Phase 4 – AI Transform Integration (3–4 days)

- [ ] OAuth setup flow
- [ ] API client abstraction + model config
- [ ] Prompt composer with style presets/sliders
- [ ] Transform running / success / error screens
- [ ] Retry + timeout handling

**Deliverable:** end-to-end kobold transformation flow.

## Phase 5 – PWA & Reliability (2 days)

- [ ] Manifest, icons, theme color
- [ ] Service worker and app-shell offline support
- [ ] Network-aware transform gating
- [ ] Graceful fallbacks for no internet

**Deliverable:** installable PWA with robust offline behavior.

## Phase 6 – Polish & QA (2–3 days)

- [ ] Text pool expansion for scanner flavor lines
- [ ] Anti-repetition tuning for result/rarity/text
- [ ] Touch target/accessibility pass
- [ ] Device QA (tablet landscape focus)
- [ ] Bug fixes + release checklist

**Deliverable:** MVP candidate ready for family playtesting.

## Definition of Done (MVP)

- User can complete full loop from Home → Capture → Analyze → Result.
- Kobold results can be transformed via API when online+authenticated.
- All results can be saved and reviewed locally in archive.
- XP/Level visibly updates.
- App is installable and app shell works offline.
