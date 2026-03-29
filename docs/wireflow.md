# Critter Switch – Wireflow & Screen-Spec (V1)

## 1) Primäre Navigation

- Home / Scanner
- Archive
- Settings

Kontext-Screens (Camera, Analysis, Transform) reduzieren die Hauptnavigation visuell, um Fokus zu halten.

## 2) Wireflow (Kurzform)

```text
Splash
  -> Scanner Home
Scanner Home
  -> Camera Capture
  -> Archive
  -> Settings
Camera Capture
  -> Photo Preview
  -> Home
Photo Preview
  -> Analysis Running
  -> Camera Capture
Analysis Running
  -> Result Human
  -> Result Suspect
  -> Result Kobold Detected
Result Human
  -> Camera Capture
  -> Home
Result Suspect
  -> Camera Capture
  -> Home
  -> Transform Running (optional)
Result Kobold Detected
  -> Transform Running
  -> Save Detection
  -> Home
Transform Running
  -> Transform Result
  -> Transform Error
Transform Error
  -> Retry Transform
  -> Result Kobold Detected
Transform Result
  -> Save to Archive
  -> Critter Detail
  -> Camera Capture
  -> Home
Archive
  -> Critter Detail
  -> Home
Settings
  -> OAuth Setup
OAuth Setup
  -> back to Settings or Transform Flow
```

## 3) Screen-Spezifikation

## 01 – Splash / Boot
**Zweck:** kurzer atmosphärischer Einstieg.

**Elemente:** Branding, System-Status, Boot-Ticker.

**Transition:** automatisch nach 1–2s zu Home.

---

## 02 – Scanner Home
**Zweck:** zentraler Startscreen.

**Pflicht-Elemente:**
- Start Check (dominanter CTA)
- Archive Shortcut
- Settings Shortcut
- atmosphärische Statuslabels

**Aktionen:**
- Start Check → Camera
- Archive → Archive
- Settings → Settings Drawer

---

## 03 – Camera Capture
**Zweck:** Foto aufnehmen.

**Pflicht-Elemente:**
- Live-Preview
- Capture Button
- Cancel/Back
- dezentes Scan-Overlay

**Edge Case:** kein Kamerazugriff → Permission-Fallbackscreen.

---

## 04 – Photo Preview
**Zweck:** Bestätigung vor Analyse.

**Aktionen:**
- Use Photo → Analysis
- Retake → Camera
- optional Cancel → Home

---

## 05 – Analysis Running
**Zweck:** pseudo-technische Dramaturgie (10–20s).

**Analysephasen:**
1. Subject acquisition
2. Humanoid shell check
3. Spectral anomaly scan
4. Glamour veil inspection
5. Classification lock

**Transition:** automatisch zu Human/Suspect/Kobold.

---

## 06 – Result Human
**Zweck:** All-clear Ergebnis.

**CTAs:**
- Scan Again
- Back Home
- optional Save Scan

---

## 07 – Result Suspect
**Zweck:** unklare Signatur als Varianz.

**CTAs:**
- Rescan
- Save Suspicion
- optional Force Transform
- Back Home

---

## 08 – Result Kobold Detected
**Zweck:** Jackpot vor Transform.

**Pflicht-Elemente:**
- Kobold-Klasse
- Rarity
- Trait-Werte
- großer Transform CTA

**CTAs:**
- Transform Subject
- Save Detection
- Back Home

---

## 09 – Transform Running
**Zweck:** API-Lauf sichtbar machen.

**Inhalt:** Originalbild + Progress-Inszenierung + Statusmeldungen.

**Transition:** success → Transform Result / error → Transform Error.

---

## 10 – Transform Result
**Zweck:** finaler Wow-Screen.

**CTAs:**
- Save to Archive
- View Detail
- Scan Next
- Back Home

**Optional:** Before/After Toggle.

---

## 11 – Transform Error
**Zweck:** robuste Fehlerbehandlung.

**CTAs:**
- Retry Transform
- Save Detection Only
- Back

**Fehlerstatus:** timeout, auth, network.

---

## 12 – Archive / Collection
**Zweck:** lokale Sammlung + Motivation.

**Filter:** All, Humans, Suspects, Kobolds, Rare+.

**Eintrag:** Thumbnail, Typ, Rarity, Datum, Stil.

---

## 13 – Critter Detail
**Zweck:** Detailansicht gespeicherter Funde.

**Inhalte:** Bild(er), Klassifikation, Rarity, Traits/Lore, Datum.

**CTAs:** Back to Archive, Delete Entry.

---

## 14 – Settings
**Zweck:** kompakte Konfiguration.

**Bereiche:**
1. Account/API
2. Transformation Style
3. Analysis Behavior
4. Collection/Storage
5. App/PWA

---

## 15 – OAuth / API Setup
**Zweck:** Login + API-Nutzung erklären.

**Kernhinweis:** Bilder bleiben lokal, nur ausgewählte Bilder gehen für Transform an die API.

## 4) Flow Guards

- `canCapture = cameraPermissionGranted`
- `canTransform = isOnline && isAuthenticated && modelConfigured`
- `canSave = imageRefExists && classificationExists`

## 5) UX-Regeln für alle Screens

- Pro Screen **ein dominanter CTA**
- Große Touch-Zonen (Tablet)
- Keine Sackgassen: immer Home- oder Scan-Weiterführung
- Dekorative Tech-Labels nur ergänzend, nie CTA verdrängen
