# Critter Switch – Prompt-Design für Kobold-Transformation (V1)

## 1) Ziel des Prompting-Systems

Die Transformation soll die fotografierte Person als Kobold „enttarnen“, nicht ersetzen:
- **subtile Wiedererkennbarkeit** (Identitätsanker)
- **humorvoll/familienfreundlich** statt Horror
- **Bildausschnitt und Pose** möglichst erhalten

## 2) Prompt-Bausteine

## A) Grundintention
- enttarne ein getarntes humanoides Kobold-Subjekt
- zeige eine fantasievolle Kobold-Persona statt eines komplett neuen Charakters

## B) Identitätsanker
- erkennbare Gesichtsstruktur dezent erhalten
- Mimik und Ausdruckshinweise möglichst beibehalten

## C) Stilebene
- Lustig
- Leicht gruselig
- Schelmisch
- Wild
- Edel

## D) Sicherheitsebene
- familienfreundliche Fantasy-Kreatur
- nicht grafisch, nicht horrorlastig, kein Gore

## E) Kompositions-Lock
- ursprünglichen Bildausschnitt und Motivposition erhalten
- Posenkontinuität soweit möglich bewahren

## 3) Negativvorgaben (immer aktiv)

- vermeide Gore
- vermeide realistischen Horror
- vermeide vollständigen Identitätsersatz
- vermeide zusätzliche Gliedmaßen / kaputte Anatomie
- vermeide groteske Körperverzerrungen

## 4) Master-Prompt-Vorlage

```text
Transformiere das fotografierte menschliche Subjekt in einen [STIL_PRESET]-Kobold und bewahre subtile Identitätsmerkmale.
Behalte Bildausschnitt und Pose der Quelle möglichst bei.
Erhalte leichte Wiedererkennbarkeit über Gesichtsstruktur und Ausdrucksanker.
Das Ergebnis soll verspielt, schelmisch und familienfreundlich sein – nicht horrorhaft.
Füge Kobold-Merkmale (Ohren, Textur, Augen, Ausdruck) hinzu, ohne extreme anatomische Verzerrungen.
Visueller Ton: dunkles High-Tech-Magie-Scanner-Universum, cineastisch aber humorvoll.
```

## 5) Stil-Presets (Zusatzmodule)

## Lustig
- freundliches Grinsen
- verspielte Augen
- weichere Kreaturenmerkmale

## Leicht gruselig
- leicht unheimlich, aber weiterhin familienfreundlich
- verspielte Schattenstimmung
- kein bedrohlicher Horrorton

## Schelmisch
- listiger Ausdruck
- Trickster-Vibe
- agile Kobold-Energie

## Wild
- raue Texturen
- verwildert, aber komisch
- hohe Energie in den Kreaturenmerkmalen

## Edel
- würdevoller magischer Kobold
- ornamentale Fantasy-Details
- gefasster Ausdruck

## 6) Slider-Mapping

## `Spaß ↔ Gemein`
- Spaß: warm, albern, zugänglich
- Gemein: schärferer Ausdruck, aber familienfreundlich

## `Süß ↔ Hässlich`
- Süß: rundere Formen, weichere Details
- Hässlich: rauere Textur und stärkere Gesichtsexaggeration

## `Saubere Fantasy ↔ Schmuddelige Kreatur`
- sauber: polierter, magischer Look
- schmuddelig: dreckigere Textur, rustikaler Eindruck

## 7) Laufzeit-Komponierung (Pseudo-API)

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

- Person bleibt leicht erkennbar
- Ergebnis entspricht dem gewählten Stil
- kein Horror/Gore/NSFW
- Pose und Bildkomposition wirken konsistent
- Gesamteindruck: „lustig-mysteriös“

## 9) Fehler- und Fallback-Strategie

Wenn Generierung fehlschlägt:
- klassifiziertes Originalergebnis erhalten
- Wiederholung anbieten
- Speichern ohne Transformation erlauben

Wenn Ergebnis zu weit vom Ziel abweicht:
- identitätsstärkere Prompt-Variante verwenden
- Stilintensität reduzieren
- Negativprompt um „vermeide vollständigen Gesichtsersatz“ verstärken
