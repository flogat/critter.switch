# Critter Switch – Prompt-Design für Kobold-Transformation

## 1) Zielsetzung

Die Transformation soll die fotografierte Person als humorvollen Kobold zeigen, mit subtiler Wiedererkennbarkeit (Identity Anchor), family-safe und nicht-horrorhaft.

## 2) Prompt-Bausteine

## A. Base Intent
- "humanoid subject revealed as disguised kobold"
- "mischievous fantasy creature transformation"

## B. Identity Anchor
- "preserve subtle recognizable facial structure and expression"
- "retain pose, framing, and key identity cues"

## C. Style Preset
- Funny
- Creepy-light
- Mischievous
- Wild
- Noble

## D. Safety/Tone
- "family-friendly fantasy art, non-graphic, non-horror"

## E. Composition
- "same composition as source image"
- "subject-centered portrait continuity"

## 3) Negative Constraints

- avoid gore
- avoid dismemberment
- avoid extreme horror realism
- avoid anatomy corruption (extra limbs/faces)
- avoid total identity replacement

## 4) Master Template

```text
Transform the photographed human subject into a [STYLE_PRESET] kobold while preserving subtle identity cues.
Keep the same pose and framing from the original image.
The kobold should look humorous and expressive, family-friendly, and clearly fantasy.
Maintain light facial resemblance and recognizable structure.
Add thematic kobold traits (ears, skin texture, mischievous expression) without horror.
Visual tone: cinematic dark-tech fantasy, playful not disturbing.
```

## 5) Preset Add-ons

## Funny
- "playful grin, exaggerated but friendly features, bright mischievous eyes"

## Creepy-light
- "slightly eerie but safe, whimsical shadows, no horror"

## Mischievous
- "trickster energy, sly expression, agile goblin-like posture"

## Wild
- "feral styling, messy textures, energetic creature vibe"

## Noble
- "regal magical kobold, elegant adornments, controlled expression"

## 6) Slider Mapping

- `Fun ↔ Mean`: controls expression warmth vs sharpness
- `Cute ↔ Ugly`: controls feature softness vs roughness
- `Clean fantasy ↔ Grimy creature`: controls texture cleanliness

## 7) Runtime Prompt Composer (Pseudo)

```ts
buildPrompt({ style, funMean, cuteUgly, cleanGrimy, preserveIdentity = true })
```

Output sections:
1. Base intent
2. Identity anchor sentence
3. Style sentence
4. Slider-influenced modifiers
5. Safety sentence
6. Composition lock sentence

## 8) QA Checklist per Generated Image

- Subject remains lightly recognizable
- No prohibited content (gore/horror)
- Style matches selected preset
- Framing preserved
- Result is humorous or playful, not disturbing
