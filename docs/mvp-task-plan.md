# Critter Switch – MVP Task-Plan (umsetzungsnah)

## Phase 0 – Projektfundament (1–2 Tage)
- [ ] React + TypeScript + Vite Setup
- [ ] Grundlayout für Tablet-Landscape
- [ ] Theme-Tokens (dark surfaces, neon-lime/purple Akzente)
- [ ] Routing + leere Screen-Shells für den Hauptflow

**Ergebnis:** klickbarer Roh-Flow ohne Business-Logik.

## Phase 1 – Kernloop „Scan“ (3–4 Tage)
- [ ] Kamera-Berechtigung, Live-Preview, Capture
- [ ] Photo-Preview mit `Use Photo` / `Retake`
- [ ] Fake-Analysis Engine (10–20s) mit Phasen und Text-Rotation
- [ ] Weighted Result Engine (Human/Suspect/Kobold)
- [ ] Result Screens mit klaren CTAs

**Ergebnis:** vollständiger Entertainment-Loop ohne KI-Transform.

## Phase 2 – Lokale Sammlung (2–3 Tage)
- [ ] IndexedDB Schema + Repositories
- [ ] Speichern von Human/Suspect/Kobold Funden
- [ ] Archive Grid + Filter
- [ ] Detailansicht je Eintrag

**Ergebnis:** Scans bleiben lokal erhalten und sind wieder aufrufbar.

## Phase 3 – Progression (1–2 Tage)
- [ ] XP-Regeln implementieren
- [ ] Level-Berechnung + UI Widget
- [ ] Rewards/Badges für seltene Funde

**Ergebnis:** sichtbare Motivation über Fortschritt.

## Phase 4 – Transform Integration (3–4 Tage)
- [ ] Google OAuth Flow
- [ ] Modellauswahl in Settings
- [ ] Prompt Composer mit Presets + Slidern
- [ ] Transform Running / Result / Error Screens
- [ ] Timeout + Retry + Save-without-transform

**Ergebnis:** End-to-End Kobold-Transformation online+auth möglich.

## Phase 5 – PWA & Offline (2 Tage)
- [ ] Manifest, Icons, Theme Color
- [ ] Service Worker (App-Shell offline)
- [ ] Offline-Gating für Transform
- [ ] Offline-Meldungen und robuste Fallbacks

**Ergebnis:** installierbare PWA mit stabilem Offline-Grundverhalten.

## Phase 6 – UX-Polish & QA (2–3 Tage)
- [ ] Textpool erweitern (Scanner-Flair)
- [ ] Anti-Repetition Tuning
- [ ] Touch/Accessibility Pass
- [ ] Tablet Device QA (Landscape Fokus)
- [ ] Bugs + Release Checklist

**Ergebnis:** MVP-Kandidat für Family-Playtests.

---

## Backlog nach MVP
- [ ] mehr Kobold-Klassen und Lore-Generator
- [ ] stärkere Archive-Filter und Sortierung
- [ ] animierter Before/After Vergleich
- [ ] lokaler Export/Share
- [ ] zusätzliche Stil-Presets

## Definition of Done (MVP)
- [ ] Flow funktioniert: Home → Capture → Analyze → Result
- [ ] Kobold-Result kann transformiert werden (bei online + auth)
- [ ] Ergebnisse sind lokal speicherbar und im Archive sichtbar
- [ ] XP/Level aktualisieren konsistent
- [ ] App ist als PWA installierbar und Shell läuft offline
