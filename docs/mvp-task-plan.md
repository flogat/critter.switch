# Critter Switch – MVP Task-Plan (umsetzungsnah)

## Phase 0 – Projektfundament (1–2 Tage)
- [ ] React + TypeScript + Vite Setup *(nicht Teil der aktuellen Vanilla-JS-Version)*
- [x] Grundlayout für Tablet-Landscape
- [x] Theme-Tokens (dark surfaces, neon-lime/purple Akzente)
- [x] Routing/Screen-Shells für den Hauptflow (state-basiert)

**Ergebnis:** klickbarer Roh-Flow ohne Backend-Abhängigkeit.

## Phase 1 – Kernloop „Scan“ (3–4 Tage)
- [x] Kamera-Berechtigung, Live-Preview, Capture
- [x] Photo-Preview mit `Foto verwenden` / `Neu aufnehmen`
- [x] Fake-Analysis Engine (10–20s) mit Phasen und Text-Rotation
- [x] Weighted Result Engine (Human/Verdacht/Kobold)
- [x] Result Screens mit klaren CTAs

**Ergebnis:** vollständiger Entertainment-Loop.

## Phase 2 – Lokale Sammlung (2–3 Tage)
- [x] Persistenz für Archive, Settings und Progression *(localStorage in V1)*
- [x] Speichern von Human/Verdacht/Kobold-Funden
- [x] Archive Grid + Filter
- [x] Detailansicht je Eintrag

**Ergebnis:** Scans bleiben lokal erhalten und sind wieder aufrufbar.

## Phase 3 – Progression (1–2 Tage)
- [x] XP-Regeln implementieren
- [x] Level-Berechnung + UI Widget
- [x] Rewards/Badge-Zähler für legendäre Funde

**Ergebnis:** sichtbare Motivation über Fortschritt.

## Phase 4 – Transform Integration (3–4 Tage)
- [x] OAuth-Verbindungszustand (simulierter Toggle für MVP)
- [x] Modellauswahl in Settings
- [x] Prompt Composer mit Presets + Slidern
- [x] Transform Running / Result / Error Screens
- [x] Timeout + Retry + Save-without-transform

**Ergebnis:** End-to-End Kobold-Transformation (MVP-simuliert) online+auth möglich.

## Phase 5 – PWA & Offline (2 Tage)
- [x] Manifest, Icons, Theme Color
- [x] Service Worker (App-Shell offline)
- [x] Offline-Gating für Transform
- [x] Offline-Meldungen und robuste Fallbacks

**Ergebnis:** installierbare PWA mit stabilem Offline-Grundverhalten.

## Phase 6 – UX-Polish & QA (2–3 Tage)
- [x] Textpool erweitert (Scanner-Flair)
- [x] Anti-Repetition Tuning für Result/Rarity
- [x] Touch/Accessibility-Basispass
- [ ] Tablet Device QA auf Realgeräten
- [x] Fehlerpfade für Transform ergänzt

**Ergebnis:** MVP-Kandidat für Family-Playtests.

---

## Backlog nach MVP
- [ ] mehr Kobold-Klassen und Lore-Generator
- [x] stärkere Archive-Filter und Sortierung
- [x] umschaltbarer Before/After Vergleich
- [x] lokaler Share-Fallback (Web Share API / Zwischenablage-Link)
- [ ] zusätzliche Stil-Presets

## Definition of Done (MVP)
- [x] Flow funktioniert: Home → Capture → Analyze → Result
- [x] Kobold-Result kann transformiert werden (bei online + auth + model)
- [x] Ergebnisse sind lokal speicherbar und im Archiv sichtbar
- [x] XP/Level aktualisieren konsistent
- [x] App ist als PWA installierbar und Shell läuft offline
