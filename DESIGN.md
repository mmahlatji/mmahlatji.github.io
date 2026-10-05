---
name: Moleboheng Mahlatji — Portfolio
description: A live simulation ground — the subject's work is the interface, running in real time.
colors:
  signal: "#2440d8"
  signal-strong: "#1a2fb0"
  signal-soft: "rgba(36, 64, 216, 0.12)"
  field: "#f2f1eb"
  field-raised: "#faf9f5"
  field-deep: "#e7e5dc"
  ink: "#161616"
  ink-2: "#54514a"
  ink-3: "#6b6860"
  line: "rgba(22, 22, 22, 0.12)"
  line-strong: "rgba(22, 22, 22, 0.26)"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 12vw, 9.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5.5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  md: "3px"
  sm: "2px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  section: "clamp(4rem, 8vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.4rem"
  card:
    backgroundColor: "{colors.field-raised}"
    rounded: "{rounded.md}"
    padding: "1.4rem"
---

# Design System: Moleboheng Mahlatji — Portfolio

## Overview

**Creative North Star: "The Live Simulation Ground"**

The portfolio is a field, and the field is running. The subject builds simulations — a FLIP fluid solver, a 2D ray tracer — so the site proves it by running one from the first viewport: a real, interactive particle field that stirs as the visitor moves the cursor. The work is the interface, not a picture of it. The hero headline sits directly over the live field; each project card carries its own small live demo (particle flow, draggable light, data graph). Nothing here is a static mock — the page is alive, and its liveliness is the evidence.

The visual system is an instrument panel, not a poster: a warm-neutral paper field, near-black ink marks, and a single cobalt "signal" blue reserved for everything live — the cursor's force source, active states, the running indicator, the traveling data packet. Type is a technical grotesque (Archivo) for display and body, and a real mono (JetBrains Mono) for code, data, and metadata. Surfaces are flat with near-sharp corners; the only shadow is the response of a card lifting.

Motion is not decoration. The simulation is the authored motion moment: continuous, physical, and driven by the cursor. The one decorative flourish — a pulsing live dot — simply tells the truth that the page is running. Everything else is still.

**Key Characteristics:**
- A live, running particle field as the first viewport and the hero's ground.
- Per-project live demos: particle flow, draggable 2D ray tracer, data graph.
- Warm-neutral paper field + near-black ink + one cobalt "signal" accent for live states.
- Technical grotesque (Archivo) + real mono (JetBrains Mono) for code and data.
- Flat, near-sharp instrument panels; shadow only on hover lift.
- Single authored motion source: the simulation itself, respecting `prefers-reduced-motion`.

## Colors

The palette is a warm-neutral field with one cobalt signal. Neutrals separate hierarchy by value; the signal marks everything that is live or interactive.

### Primary
- **Signal** (#2440d8): The single accent, and it means one thing — *live*. The cursor force source and its halo, active and focus states, the running dot, the ray-tracer's light, the data graph's traveling packet, link and accent text, and text selection. It is never a large neutral fill.

### Neutral
- **Field** (#f2f1eb): The ground the simulation runs on — the base canvas.
- **Field Raised** (#faf9f5): Cards, footer — the lighter surface above the field.
- **Field Deep** (#e7e5dc): Inline code background.
- **Ink** (#161616): Headlines, primary buttons, the strongest text.
- **Ink 2** (#54514a): Running text, descriptions, secondary text.
- **Ink 3** (#6b6860): Metadata, dates, indexes, labels — still ≥4.5:1 on field.
- **Line** (rgba(22,22,22,0.12)): Hairline rules and borders.
- **Line Strong** (rgba(22,22,22,0.26)): Emphasized borders, ghost-button strokes.

### Named Rules

**The Live-Only Signal Rule.** The cobalt signal appears only where something is live or interactive. A static decorative blue is a mistake; the color is a status, not a tint.

**The Ink Field Rule.** The simulation is drawn in ink (or signal for a fluid/live effect) on the paper field. It is a mark on paper, never a glow on black — no neon, no dark-mode default.

## Typography

**Display & Body Font:** Archivo (with system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** A technical grotesque carries both display and body — weight and tight negative tracking give the headings their instrument-gauge authority, while the same family's regular weight keeps body text clean and readable. The mono is reserved for code, data, and metadata, where its tabular numerals and fixed rhythm do real work.

### Hierarchy
- **Display** (800, clamp(3rem → 9.5rem), line-height 0.9): The hero name. Letter-spacing -0.04em.
- **Headline** (700, clamp(2rem → 4rem), line-height 1): Section and page titles.
- **Title** (700, 1.35rem, line-height 1.1): Card titles, timeline roles, post titles.
- **Body** (400, 1rem, line-height 1.6): Running text; bio lead paragraphs open larger and heavier.
- **Label** (400, 0.72rem, letter-spacing 0.08em, uppercase): Meta strings, tags, indexes, nav — with tabular numerals.

### Named Rules

**The Two Voices Rule.** Archivo for display and body, JetBrains Mono for code/data/meta only. Mono is never a costume for "technical" — it only appears where it renders actual data or code.

## Layout

A single centered container (`max-width: 1200px`) with fluid side gutters (`clamp(1.25rem → 4rem)`). Sections are separated by hairline rules (`border-top`) and breathe with `clamp(4rem → 7rem)` of vertical padding — the rhythm is a ruled instrument, not a card deck. The hero fills the viewport and centers its content over the full-bleed field. Projects form a three-column grid that steps to two at 900px and one at 560px; About is a 1.5fr/1fr split that collapses to one column below 900px. The blog post column is capped at 42rem for reading.

## Elevation & Depth

The system is flat by default. Depth comes from tonal layering (field → raised → ink) and hairline rules. The only shadow is a response: a card gains a soft, offset shadow as it lifts 3px on hover.

### Shadow Vocabulary
- **Shadow Soft** (`0 1px 2px rgba(22,22,22,0.05), 0 10px 30px rgba(22,22,22,0.07)`): Resting elevation, unused at idle.
- **Shadow Hover** (`0 2px 6px rgba(22,22,22,0.06), 0 22px 50px rgba(22,22,22,0.1)`): Card hover lift.

### Named Rules

**The Flat-By-Default Rule.** Surfaces sit flat at rest. Shadow appears only as a response to state (hover lift); nothing casts a shadow while idle.

## Shapes

The form language is near-sharp — an instrument, not a cloud. Cards use a 3px radius; controls and chips use 2px. Buttons are squared with a 3px radius and a 1px ink border. The recurring signature is the small signal square (the nav mark, the favicon) — a fixed, precise chip of the one live color.

## Components

### Buttons
- **Character:** squared, mono-labeled, ink-filled, quiet until hovered.
- **Shape:** 3px radius, 1px border.
- **Primary:** ink background, field text, mono uppercase, `0.85rem 1.4rem` padding.
- **Hover / Focus:** background shifts to signal, border follows, text turns white, lifts 1px. Focus is a 2px signal outline.
- **Ghost:** transparent background, ink text, 1px `--line-strong` border. Hover inverts to ink.

### Chips / Tags
- **Style:** mono 0.66rem, `--ink-2` text, 1px `--line` border, 2px radius, `0.24rem 0.55rem` padding.

### Cards
- **Corner Style:** 3px radius, 1px `--line` border, `overflow: hidden`.
- **Background:** `--field-raised`.
- **Shadow Strategy:** hover lift only (see Elevation).
- **Top demo strip:** a 120px live canvas (the project's running demo). Only the interactive ray tracer carries a `drag the light` hint; the passive demos (water, pipeline) sit unlabeled.
- **Internal Padding:** 1.4rem.

### Inputs / Fields
No inputs exist; contact is a mailto link. Intentionally omitted.

### Navigation
- **Style:** fixed top bar, transparent at rest, gaining a blurred field background and hairline border after scroll. Left: a signal square mark + mono name. Center: mono uppercase links. Right: a pulsing "simulating" live indicator and a compact ink "Contact" button. Below 860px the links and indicator collapse.

### Live Simulation (signature)
The page's defining component. A canvas particle field with real physics — a wind field, weak home springs, and a cursor repulsion force with a signal halo. In `fluid` mode (the FLIP project's demo) it becomes flowing water: a directional channel current, local cohesion that clumps droplets into streams, and soft overlapping metaball blobs. Respects `prefers-reduced-motion` (renders a static frame) and pauses off-screen or in a hidden tab.

### Ray Tracer (signature)
A live 2D ray tracer: a draggable light source casts 260 rays that stop at the first occluding circle, leaving real shadows. The ray-tracer project's demo.

### Data Pipeline (signature)
The ADMIT project's demo, drawn from its real architecture: source sheets feed adapters, which normalize into validation and reconciliation, then into the applicant lifecycle state machine — `applied → reviewed → offer → accepted → ready`, with a minority of rows denied. A live flow diagram with moving records and tiny mono stage labels.

## Do's and Don'ts

### Do:
- **Do** keep the signal blue strictly for live or interactive elements — a status, never a tint.
- **Do** express hierarchy by stepping up or down the neutral scale (field → raised → ink).
- **Do** use mono only for code, data, and metadata, with tabular numerals.
- **Do** keep surfaces flat and near-sharp (2–3px radius); reserve shadow for hover lift.
- **Do** demonstrate, don't decorate: every live element should map to something the subject actually built.
- **Do** respect `prefers-reduced-motion` (static frame, no auto-motion).

### Don't:
- **Don't** introduce a second saturated color; signal blue is the only chroma.
- **Don't** render the simulation as neon-on-black — it is ink on paper.
- **Don't** use a serif display or an eyebrow/kicker above headings.
- **Don't** add gradients or glass to content; the only glow is the cursor's signal halo.
- **Don't** round controls into pills; the 2–3px near-sharp corner is part of the voice.
