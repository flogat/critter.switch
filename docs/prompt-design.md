# Critter Switch – Prompt-Design für Kobold-Transformation (V1)

## 1) Ziel des Prompting-Systems

Die Transformation soll die fotografierte Person als Kobold „enttarnen“, nicht ersetzen:
- **subtile Wiedererkennbarkeit** (Identity Anchor)
- **humorvoll/family-safe** statt Horror
- **Framing und Pose** möglichst erhalten

## 2) Prompt-Bausteine

## A) Base Intent
- detected humanoid glamoured kobold
- reveal disguised fantasy critter persona

## B) Identity Anchor
- preserve subtle recognizable facial structure
- keep slight resemblance and key expression cues

## C) Style Layer
- Funny
- Creepy-light
- Mischievous
- Wild
- Noble

## D) Safety Layer
- family-friendly fantasy creature
- non-graphic, non-horror, no gore

## E) Composition Lock
- retain original framing and subject position
- preserve pose continuity where possible

## 3) Negativvorgaben (immer aktiv)

- avoid gore
- avoid realistic horror
- avoid full identity replacement
- avoid extra limbs / broken anatomy
- avoid grotesque body distortions

## 4) Master Prompt Template

```text
Transform the photographed human subject into a [STYLE_PRESET] kobold while preserving subtle identity cues.
Keep the same framing and pose as the source image.
Maintain light recognizable facial structure and expression anchors.
The result should be playful, mischievous, family-friendly fantasy and not horror.
Add kobold traits (ears, texture, eyes, expression) without extreme anatomy distortion.
Visual tone: dark-tech magical scanner universe, cinematic but humorous.
```

## 5) Style Presets (Zusatzmodule)

## Funny
- friendly grin
- playful eyes
- softened creature features

## Creepy-light
- slightly eerie, still safe
- whimsical shadowing
- no threatening horror tone

## Mischievous
- sly expression
- trickster vibe
- agile goblin energy

## Wild
- rough textures
- feral but comedic appearance
- high-energy creature traits

## Noble
- regal magical kobold
- ornamental fantasy details
- composed expression

## 6) Slider-Mapping

## `Fun ↔ Mean`
- fun: warm, goofy, approachable
- mean: sharper expression, still family-safe

## `Cute ↔ Ugly`
- cute: rounder forms, softer details
- ugly: rougher texture and facial exaggeration

## `Clean fantasy ↔ Grimy creature`
- clean: polished magical look
- grimy: dirtier texture, rugged details

## 7) Runtime Composer (Pseudo-API)

```ts
type PromptInput = {
  style: 'funny' | 'creepy-light' | 'mischievous' | 'wild' | 'noble';
  funMean: number;      // 0..1
  cuteUgly: number;     // 0..1
  cleanGrimy: number;   // 0..1
  preserveIdentity: boolean;
};

buildPrompt(input: PromptInput): {
  prompt: string;
  negativePrompt: string;
};
```

## 8) Qualitätskriterien pro Ergebnisbild

- Person ist noch leicht erkennbar
- Ergebnis entspricht ausgewähltem Stil
- kein Horror/Gore/NSFW
- Pose und Bildkomposition wirken konsistent
- Gesamteindruck: „lustig-mysteriös“

## 9) Fehler- und Fallback-Strategie

Wenn Generierung fehlschlägt:
- klassifiziertes Originalergebnis erhalten
- Retry anbieten
- ohne Transform speichern erlauben

Wenn Ergebnis zu weit vom Ziel abweicht:
- identitätsstärkere Prompt-Variante verwenden
- Stilintensität reduzieren
- negativen Prompt um „avoid full face replacement“ verstärken
