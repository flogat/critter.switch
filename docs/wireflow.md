# Critter Switch – Wireflow (V1)

## 1) Global Navigation / Entry Points

- **Primary route:** `HOME`
- **Secondary persistent actions:** `ARCHIVE`, `SETTINGS`
- **Contextual routes:** `CAMERA`, `ANALYZING`, result states, transform states
- **Overlay routes:** `OAUTH_SETUP`, permission/error dialogs

## 2) Screen-by-Screen Wireflow

## BOOT / SPLASH

**UI Elements**
- Logo + system status
- Boot message ticker

**Transitions**
- Auto (1–2s) → `HOME`
- If `first_launch=true` and PWA not installed, optional install hint overlay

---

## HOME (Scanner Home)

**Primary CTA**
- `Start Check` → `CAMERA`

**Secondary Actions**
- `Archive` → `ARCHIVE`
- `Settings` → `SETTINGS`

**Atmospheric Data (read-only)**
- Latest capture label
- Sensor status
- Threat flavor indicator

---

## CAMERA (Live Capture)

**Actions**
- `Capture` → `PHOTO_PREVIEW`
- `Cancel/Back` → `HOME`

**Edge states**
- `permission=denied` → `CAMERA_PERMISSION_BLOCKED`
- `camera_unavailable` → fallback text + back to `HOME`

---

## PHOTO_PREVIEW

**Actions**
- `Use Photo` → `ANALYZING`
- `Retake` → `CAMERA`
- `Cancel` → `HOME`

---

## ANALYZING (10–20s dramatized)

**Behavior**
- Pseudo-analysis feed runs via timer
- Last ~3s visual lock-on pulse

**Transitions (weighted random)**
- `RESULT_HUMAN`
- `RESULT_SUSPECT`
- `RESULT_KOBOLD`

**Actions while running**
- Optional `Abort` → `HOME`

---

## RESULT_HUMAN

**Content**
- Original image
- Human confirmation text + scanner flavor

**Actions**
- `Scan Again` → `CAMERA`
- `Save to Archive` → save + toast
- `Home` → `HOME`

---

## RESULT_SUSPECT

**Content**
- Original image
- Uncertain signal score

**Actions**
- `Rescan` → `CAMERA`
- `Save Suspicion` → save + toast
- Optional `Force Transform` → `TRANSFORMING`
- `Home` → `HOME`

---

## RESULT_KOBOLD

**Content**
- Original image
- Kobold class + rarity + traits

**Actions**
- `Transform Subject` → `TRANSFORMING`
- `Save Detection` → save original classification
- `Scan Next` → `CAMERA`
- `Home` → `HOME`

---

## TRANSFORMING

**Behavior**
- Executes real API transform
- Pseudo-tech progress feed shown independently

**Transitions**
- success → `TRANSFORM_RESULT`
- timeout/error → `TRANSFORM_ERROR`

---

## TRANSFORM_ERROR

**Content**
- Error classification (timeout/network/auth)
- Original scan preserved

**Actions**
- `Retry` → `TRANSFORMING`
- `Save without Transform` → archive entry
- `Back to Kobold Result` → `RESULT_KOBOLD`

---

## TRANSFORM_RESULT

**Content**
- Generated kobold image
- Before/after compare
- Rarity + XP gain

**Actions**
- `Save to Archive` → save + toast
- `View Details` → `DETAIL`
- `Scan Next` → `CAMERA`
- `Home` → `HOME`

---

## ARCHIVE

**Content**
- Grid list with filters (All/Human/Suspect/Kobold/Rare)
- XP + level widget

**Actions**
- tap entry → `DETAIL`
- delete entry
- back/home

---

## DETAIL

**Content**
- Full image(s), metadata, lore, traits

**Actions**
- `Back to Archive` → `ARCHIVE`
- optional delete

---

## SETTINGS (Drawer/Modal)

**Sections**
- API/Auth
- Transformation style/intensity
- Analysis time + hit frequency
- Local data controls
- PWA/install hints

**Actions**
- `Save/Close` → previous screen
- If auth required → `OAUTH_SETUP`

---

## OAUTH_SETUP

**Actions**
- `Login with Google` (OAuth)
- model selection
- return to previous context

## 3) State Conditions / Guards

- `canTransform = isOnline && isAuthenticated && modelConfigured`
- `canCapture = cameraPermissionGranted`
- `saveAllowed = imageBlobExists && classificationExists`

## 4) Wireflow Notes for UX

- Keep one dominant CTA per screen.
- Preserve captured photo throughout result + transform flows.
- Prefer modal/drawer patterns for settings/setup to avoid flow loss.
- Avoid dead ends: every state has a clear “back to scan” or “home” path.
