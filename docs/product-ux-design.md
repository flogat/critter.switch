# Critter Switch – Produkt- und UX-Design-Dokument

## 1. Produktüberblick

**Critter Switch** ist eine humorvolle, familienfreundliche Web-App im Stil eines futuristischen „Kobold-Detektors“. Die App läuft als **Progressive Web App (PWA)** auf Tablets und kann über den Browser auf den Homescreen installiert werden, sodass sie sich fast wie eine native App anfühlt.

Die Grundidee: Nutzer starten einen Scan, machen ein Foto und erleben danach eine bewusst inszenierte, pseudo-wissenschaftliche Analyse. Am Ende entscheidet die App über einen gesteuerten Zufallsmechanismus, ob die fotografierte Person ein gewöhnlicher Mensch ist oder ein getarnter Kobold. Bei einem Treffer kann das Originalbild über eine Bildgenerierungs-API in eine Kobold-Version transformiert werden.

Die App ist **Entertainment-first**, nicht Utility-first. Die Illusion, Atmosphäre und das Sammel- und Überraschungserlebnis sind wichtiger als echte Bilderkennung.

---

## 2. Produktziele

### Primäre Ziele
- Ein lustiges, wiederholt nutzbares Familienerlebnis schaffen.
- Die Scanner-Fantasie glaubwürdig und atmosphärisch inszenieren.
- Einfache Nutzung auf dem Tablet im Vollbildmodus ermöglichen.
- Über Sammlung, Level und seltene Kobolde langfristig Motivation erzeugen.

### Sekundäre Ziele
- KI-generierte Koboldbilder mit Wiedererkennungswert erzeugen.
- Über stylische Settings kleine Personalisierung ermöglichen.
- Das Stitch-Design möglichst nah und glaubwürdig in eine funktionierende PWA übersetzen.

### Nicht-Ziele
- Keine echte Gesichtsanalyse oder echte Wesenserkennung.
- Kein Multiplayer.
- Keine Cloud-Galerie oder Nutzerkonten für Familienmitglieder.
- Keine Monetarisierung.
- Keine Sprachsteuerung oder Sprachausgabe.

---

## 3. Plattform und technische Leitplanken

### Plattform
- **Web-App / PWA**
- Fokus auf **Tablet Landscape**
- Installation per „Zum Homescreen hinzufügen“
- Vollbildnahes Erlebnis, touch-optimiert

### Datenspeicherung
- Fotos und Sammlungsdaten nur **lokal auf dem Gerät**
- Kein externer Upload außer für die Bildgenerierung an die gewählte API
- Lokale Persistenz über IndexedDB oder lokale App-Datenbank im Browser

### KI / API
- Bildtransformation per **Google Nano Banana 2** über API
- Login per **Google OAuth**
- Modellauswahl in Settings

### App-Prinzip
- Analyse ist **inszeniert und zufallsbasiert**
- Bildtransformation ist der echte technische Wow-Moment

---

## 4. Zielgruppe und Nutzungskontext

### Zielgruppe
- Familie
- Kinder + Erwachsene gemeinsam
- Niedrige Einstiegshürde
- Spaß, Staunen, Lachen

### Nutzungssituation
- Gemeinsam auf dem Sofa
- Bei Familienfeiern
- „Scann mal Papa / Oma / Bruder“
- Kurze Sessions, aber mit Wiederholungscharakter

### UX-Konsequenzen
- Große Buttons
- Sehr klare Schrittfolge
- Kaum Text-Eingaben
- Sofort verständliche States
- Atmosphärische, aber einfache Interaktion

---

## 5. Creative Direction / Experience Pillars

Die gestalterische Richtung ist **„Tactical Enchantment“**: ein dunkles High-Tech-Interface mit Neon-Lime als aktivem Signal, Purple für mysteriöse Daten und einer asymmetrischen Sci-Fi-Instrumenten-Ästhetik.

### Experience Pillars
1. **Scanner-Fantasie** – alles wirkt wie ein geheimes Detektionsgerät.
2. **Dramatische Inszenierung** – technisch/spannend, obwohl spielerisch.
3. **Humor + Wiedererkennung** – Ergebnisbild lustig und wiedererkennbar.
4. **Sammeltrieb** – Varianten/Seltenheiten/Level motivieren.
5. **Low-friction Touch UX** – wenige Aktionen, große Tap-Zonen, schneller Flow.

### Gestalterische Regeln
- Dunkle Flächen statt heller Karten
- Neon sparsam, aber gezielt einsetzen
- Space Grotesk / technische Labels für Scanner-Gefühl
- Tonale Layering statt harter Linien
- „Ghost Border“ statt starker Divider
- Glows statt klassischer Schatten

---

## 6. Kern-Feature-Set für V1

### Enthalten
- PWA Shell
- Startscreen / Scanner Home
- Kameraaufnahme
- Fake-Analyse mit dramaturgischer Animation (10–20 Sekunden)
- Ergebnisentscheidung per Zufallslogik
- Ergebnis-Screen Mensch oder Kobold
- KI-Transformation bei Kobold-Treffer
- Settings-Dialog
- Lokale Sammlung / Archive
- Level-System
- Seltene Koboldtypen
- OAuth-Login für Google API Nutzung

### Nicht in V1
- Multiplayer
- Cloud Sync
- Familienprofile
- Audio / Voice
- Soziale Features

---

## 7. Haupt-User-Flow

### Flow A – Standard Scan
1. App öffnen
2. Scanner-Home mit **Start Check**
3. Tap auf **Start Check**
4. Kamera öffnet sich
5. Foto aufnehmen
6. Analyse-Sequenz 10–20 Sekunden
7. Ergebnisentscheidung
8. Ergebnis: Mensch / Verdacht / Kobold
9. Bei Kobold: Transformation starten
10. KI-Bild wird erzeugt
11. Lokal in Sammlung speichern
12. XP / Fortschritt / Seltenheit anzeigen

### Flow B – Kein Kobold
1. Foto
2. Analyse
3. Ergebnis: Human confirmed / No anomaly
4. Optional als Fehlscan speichern
5. Zurück zum Start oder nächster Scan

### Flow C – API/Transform-Fehler
1. Kobold erkannt
2. Transformation startet
3. API schlägt fehl oder dauert zu lange
4. App zeigt Retry + Ergebnis ohne Transform speicherbar

---

## 8. Informationsarchitektur / Hauptscreens

1. Splash / App Boot
2. Scanner Home
3. Camera Capture
4. Analysis Running
5. Result – Human
6. Result – Suspect
7. Result – Kobold Detected
8. Transformation Running
9. Transformation Result
10. Archive / Collection
11. Critter Detail
12. Settings Dialog / Drawer
13. OAuth / API Setup

---

## 9. Screen-Spezifikation (kompakt)

### 9.1 Splash
- 1–2 Sekunden Boot-Atmosphäre
- Danach zu Home

### 9.2 Scanner Home
- Großer Start-CTA, Archive/Settings sekundär
- Atmosphärische Labels erlaubt, CTA maximal klar

### 9.3 Camera Capture
- Live Preview, großer Capture-Button, Back/Cancel
- Permission-Handling und Retake-Option

### 9.4 Analysis Running
- 10–20 Sekunden pseudo-technische Analyse
- Animierte Ringe, Daten, Meldungsrotation
- Lock-on im letzten Drittel verstärken

### 9.5 Result Human
- Originalbild + humorvoll-technischer „All clear“-Text
- Scan Again / Save / Back Home

### 9.6 Result Suspect
- Zwischenstufe mit Anomaly-Score
- Rescan / Save / optional Force Transform

### 9.7 Result Kobold Detected
- Jackpot-Screen mit Klasse, Rarity, Traits
- Primär-CTA: **Transform Subject**

### 9.8 Transformation Running
- API läuft im Hintergrund, UI inszeniert Technikprozess
- Timeout/Retry berücksichtigen

### 9.9 Transformation Result
- Generiertes Bild groß + Vorher/Nachher
- Save / Scan Next / View Detail

### 9.10 Archive
- Grid mit Filtern, XP/Level, Detailzugriff

### 9.11 Critter Detail
- Großansicht + Meta/Traits/Lore

### 9.12 Settings
- Auth/Model/Style/Analyse/Collection/App
- Tablet-geeignet als Drawer oder Modal

### 9.13 OAuth Setup
- Kurze Erklärung + Login + Fehlerstates

---

## 10. State Machine

```text
BOOT -> HOME
HOME -> CAMERA
CAMERA -> PHOTO_PREVIEW
PHOTO_PREVIEW -> ANALYZING | CAMERA
ANALYZING -> RESULT_HUMAN | RESULT_SUSPECT | RESULT_KOBOLD
RESULT_HUMAN -> HOME | CAMERA
RESULT_SUSPECT -> HOME | CAMERA | TRANSFORMING(optional)
RESULT_KOBOLD -> TRANSFORMING | HOME
TRANSFORMING -> TRANSFORM_RESULT | TRANSFORM_ERROR
TRANSFORM_ERROR -> TRANSFORMING(retry) | RESULT_KOBOLD
TRANSFORM_RESULT -> SAVE_TO_ARCHIVE | HOME | CAMERA
ARCHIVE -> DETAIL
DETAIL -> ARCHIVE
SETTINGS -> previous screen
```

---

## 11. Ergebnislogik / Random System

### Standard-Wahrscheinlichkeiten
- Human: 45%
- Suspect: 20%
- Kobold: 35%

### Family-Fun-Alternative
- Human: 35%
- Suspect: 15%
- Kobold: 50%

### Kobold-Rarity
- Common 60%
- Uncommon 25%
- Rare 10%
- Epic 4%
- Legendary 1%

### Anti-Repetition
- gleiche Rarity/Klasse/Texte rotieren und dämpfen

---

## 12. Level- und Sammlungs-System

### XP-Vorschlag
- Human gespeichert: 5 XP
- Suspect gespeichert: 10 XP
- Kobold Common: 20 XP
- Rare+: 35–100 XP

### Level-Modell
- Level 1–20
- Belohnungen: Texte, Frames, Badges, Name-Pools, Stile

---

## 13. Prompting / KI-Transformation

### Zielbild
- Kobold-Look klar sichtbar
- Subtile Wiedererkennbarkeit der Person
- family-safe, nicht horrorlastig

### Schlüsselanforderungen
- preserve facial identity cues lightly
- keep resemblance subtle but noticeable
- humorous/mischievous/family-friendly
- pose/framing erhalten

### Negative Leitlinien
- no gore
- no realistic horror
- no broken anatomy

---

## 14. Tone of Voice

Die App „nimmt ihren Unsinn ernst“:
- technisch
- trocken
- leicht ironisch
- pseudo-wissenschaftlich / pseudo-militärisch

---

## 15. Visuelle Umsetzungsrichtlinien

- Tablet landscape first
- dunkle Palette, kein weißer UI-Card-Look
- Neon-Lime für aktive Signale
- Purple für rare/lore/traits
- Glows sparsam, Fokus auf klare Hierarchie

---

## 16. PWA-Anforderungen

### Muss
- installierbar auf Homescreen
- Manifest + Icons + Theme Color
- offline-fähige App-Shell
- Graceful Degradation ohne Internet

### Offline-Verhalten
- Scan/Fake-Analyse/Archiv weiter nutzbar
- KI-Transform deaktiviert mit klarer Meldung

---

## 17. Fehlerfälle / Edge Cases

- Kamera nicht erlaubt → dedizierter Fallback-Screen
- Kein Internet → Transform deaktiviert
- API nicht eingeloggt → OAuth Setup aufrufen
- API Timeout → Retry + Save ohne Transform

---

## 18. MVP-Empfehlung

### V1 Fokus
1. PWA Shell
2. Home
3. Camera
4. Fake Analysis
5. Random Result
6. API Transform
7. Local Archive
8. Settings (Style/Model)
9. XP/Level Basis

### Später
- mehr Klassen/Stile
- bessere Filter
- stärkere Before/After-Inszenierung
- Export/Share

---

## 19. Technische Architektur (High Level)

- Frontend: React + TypeScript + Vite + Tailwind
- State: Zustand
- Routing: React Router
- Persistenz: IndexedDB (Dexie)
- Module: camera, analysis engine, result randomizer, transform, archive, progression, settings, auth

---

## 20. Offene Entscheidungen

- Suspect bereits in V1?
- Transform auto-start oder manuell?
- Anzahl Style-Presets in V1?
- Originalbild immer oder optional speichern?
- Umfang Lore-/Name-Generator?

---

## 21. Konkrete Produkt-Empfehlung

- Direkt in Scanner-Home starten
- Start Check → Kamera → Analyse → Ergebnis
- Suspect selten, Human/Kobold dominant
- Bei Kobold Transform prominent anbieten
- jeden Fund lokal sammelbar machen
- Stil: **lustig-mysteriös**, nicht horrorhaft

---

## 22. Wireflow (Kurz)

```text
Splash -> Home
Home -> Camera | Archive | Settings
Camera -> Preview | Home
Preview -> Analysis | Camera
Analysis -> Result Human | Suspect | Kobold
Kobold -> Transform Running -> Result | Error
Archive -> Detail
Settings -> OAuth Setup
```

---

## 23. Engineering-Roadmap (Kurz)

1. App Shell + PWA Basis
2. Kernflow ohne API
3. Local Storage + Archive + Progress
4. OAuth + Transform API
5. Polish (Animation, Install Hint, Offline UX)

---

## 24. Definition of Done (MVP)

- PWA installierbar
- kompletter Scanflow stabil
- Fake Analyse dramaturgisch überzeugend
- Ergebnislogik variiert sichtbar
- Transform API integriert (mit Fehlerhandling)
- lokale Speicherung + Archive + Detail funktionieren
- Settings für Stil/Modell aktiv

---

## 25. Nächste Artefakte

1. Prompt-Design (Templates + Presets)
2. Umsetzbarer MVP-Task-Plan (Tickets)
3. Komponenten-Spec (UI System)
4. API-Integrationspapier (OAuth, Modell, Fehlerpfade)
