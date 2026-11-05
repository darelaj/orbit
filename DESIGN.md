# Orbit design brief

Status: revised after the owner rejected the initial plain analytical interface. This replaces the earlier direction. The existing React shell is a technical baseline, not the intended finished design.

## Decisions from the owner

| Topic | Accepted direction |
| --- | --- |
| Main inspiration | HSR character and relic screens: visual equipment, statistics beside the selected item |
| Information density | Balanced: relics stay visual and key numbers remain easy to compare |
| Artwork | Real character artwork and splash art may be a major part of the interface |
| Workspace | Top navigation, wide working area, details in a side panel |
| Motion | Short panel and selection transitions; numeric information remains stable |
| Themes | Fully working dark and light modes |
| Process | Antislop DURING, applied while planning and implementing |

The owner has not selected a palette/type option or supplied an external reference URL. The choices below are proposals, not an attributed owner preference. Do not repeat the already answered questions.

## Design read

An HSR equipment-analysis workspace for PC players: cinematic character presence around a clear relic interface. ENERGY 2 / RHYTHM 2 / MOTION 2. Here MOTION 2 means short user-triggered transitions, not scroll reveals or continuous animation.

The inspiration should be recognizable from equipment composition, rarity treatment, selected-state framing, character art, and stat alignment. Color alone is insufficient. Artwork cannot cover controls or make measurements harder to scan.

## What changes from the rejected shell

- Replace the generic empty rectangle with an equipment-oriented import state that explains what will fill the workspace.
- Replace the table-first visual assumption with a relic grid and selected-item side panel. A compact list remains an optional useful view, not the sole identity.
- Give character context and the six equipment slots a clear compositional role. No marketing hero or slogans above the work area.
- Use characterful, moderately condensed headings and restrained game-style framing. Body copy and measurements stay legible.
- Keep navigation at the top and the work area wide. No permanent left navigation rail.
- Remove generic four-metric overview rows, decorative status lights, and unrelated dashboard charts.

## Identity, artwork, and motifs

Orbit is an equipment workbench situated in HSR's visual world. Its recurring motif is the six-slot loadout: a selected relic, its slot, and its contribution to a build. Repeated slot positions and aligned measurements connect inventory, comparison, and search results.

Orbit remains a text wordmark. The owner authorized game artwork, not an invented logo or fabricated character art. Use actual game imagery from documented sources. Do not generate imitations of relic icons or portraits and present them as official assets.

Use selected-character artwork as a contained visual anchor. Show art for the character being inspected or optimized, not a random decorative character. If no character is selected, item content leads and the art area stays absent or shows an honest empty state. Record asset URLs, source, and any redistribution notices before committing files.

## Proposed palette and typography

| Role | Dark proposal | Light proposal | Purpose |
| --- | --- | --- | --- |
| Page | Midnight #0E1726 | Warm ivory #F3F0E8 | Frame equipment and artwork |
| Panel | Blue slate #18283D | Near-white #FFFDF7 | Keep numerical content on opaque surfaces |
| Selected surface | Slate #23374D | Pale stone #E8E7DF | Distinguish selection and active controls |
| Primary text | Ivory #F2EEE3 | Ink #17283C | Stable reading contrast |
| Secondary text | Pale gray #B7C4CE | Slate gray #4D606D | Readable supporting labels |
| Main accent | Muted gold #DFC38A | Dark gold #805A15 | Primary action, equipment annotations, selected framing |
| Structural color | Ice blue #9CCBDD | Deep blue #285F75 | Slot context and timeline guides, used sparingly |

These are starting tokens, not a contrast certification. Measure actual foreground/background pairs in both themes and adjust before delivery. Neutrals plus gold and one cool structural color form the palette. Timeline actors also need names/lane numbers rather than extra hues alone.

Avoid neon cyan, purple gradients, glowing background orbs, and starfield wallpaper. A quiet image fade may protect reading contrast, with a defined boundary and purpose. It must not turn every panel into glass.

Proposed heading direction: a moderately condensed sans-serif, starting with Windows Bahnschrift or an appropriately licensed locally bundled alternative after inspecting it. This is not a final font choice by the owner. Use Segoe UI/system sans-serif for controls and explanations, tabular numerals for stats, and monospace only where AV timestamp alignment benefits. Do not use oversized marketing headings or extreme tracking.

No external font CDN at runtime. Record the source and license before bundling a font.

## Surfaces and interaction language

Mostly opaque panels, a restrained radius scale (controls 4px, item panels 6px, dialogs 10px), and shadows only for dialogs/drawers. Short corner brackets or cut-corner framing may identify a selected relic or active loadout. Do not outline every object with decorative geometry.

Use actual relic/set/character assets where relevant. Stat labels do not need an icon each. Level/rarity annotations may use gold because they communicate equipment information. Do not put decorative arrows on every action or add capsule badges above page titles.

## Desktop and responsive composition

Top bar: Orbit text name, implemented workspace destinations, theme control, import/backup actions. An inventory context row shows source, import time, actual counts, and precision because they affect the player's decisions.

At wide desktop widths, use a flexible work area and a 320-380px detail panel. At intermediate widths, detail becomes a drawer. At narrow widths, retain top navigation and a single-column equipment flow; the document itself never overflows horizontally.

The four requested destinations are Inventory, Perbandingan build, Optimizer, and Speed tuning. Add links only when their views work. Use links for navigation and buttons for actions.

## Inventory

Primary decision: which relic should the player inspect or try in a build?

The main area contains filters and a balanced relic grid. Each cell shows a real item/slot image, set, level, main stat, four active substats, and equipment/lock/discard state. Values remain visible without hover. Repetition is appropriate because cells represent equivalent equipment objects.

Selecting an item updates the right panel without moving the grid. The panel contains the complete stat breakdown, active versus preview/reroll stats, identity, current owner, and an action to use the relic in loadout B. Selection has a visible frame and accessible state text.

Show the actual result count. Supported filters include slot, set, main stat, level, rarity, equipped state, lock/discard, and text search. Use pagination or virtualization for thousands of items.

First run gives a real JSON import action and scanner instructions. A synthetic demo is explicitly labeled; it never resembles an invented personal account or UID.

## Build comparison

Primary decision: what changes when switching from A to B?

Make selected-character artwork a major anchor beside the equipment workspace, contained in its own area. Crop art with reserved space or opaque surfaces for labels. It must not reduce the editors or stat ledger to a small afterthought.

Show consistent six-slot loadouts: Head, Hands, Body, Feet, Sphere, Rope. A remains the reference and B is editable. Align A, B, and signed delta columns. Baseline values do not animate while B changes.

Prioritize SPD decimals, the selected objective, and relevant thresholds. Show profile inputs, manual corrections, static set effects, and excluded mechanics. Saved loadouts retain snapshots/identities according to the import contract.

## Optimizer

Primary decision: which legal candidate meets the target?

Use compact controls beside wide results. Portraits supply character context; objective and real search status lead during a run. Each result contains six small relic cells, key stats, constraint status, and a compare action.

Name the objective and its scope. ATK/CRIT index is not DPS. Expose supported bounds, set requirements, exclusions, and search settings. Real progress and an immediate cancel action replace decorative activity.

Disclose exact versus heuristic search, the candidate pool, and evaluated counts. No-results text distinguishes exhaustive infeasibility from a heuristic that found no legal build.

## Speed tuning

Primary decision: who acts when, and does the order meet the cycle target?

Up to four named members can use portraits for recognition. The main visual is the AV timeline: cycle boundaries, named lanes, numbered actions, timestamps. Lines carry calculation meaning; they are not a decorative background grid.

Keep a numeric event list alongside/below the visual. Use matching names and order. Art supports identification without competing with thresholds.

Place fixed-speed/buff/initial-advance assumptions near controls. Carry the source precision from build comparison and show OCR uncertainty near boundary-sensitive results.

## Motion

- Relic selection: surface/frame transition around 120-160ms.
- Side panel: restrained opacity/position transition around 160-220ms, without reflowing the grid.
- Page transition: at most 150-200ms, without delaying controls.
- Numeric results: replace the value or briefly highlight a change; never count up through intermediate values.
- No endless shimmer, particles, floating objects, pulsing dots, parallax, or automatic splash effects.
- Reduced-motion removes non-essential transitions. Loading may use static status/progress text.

## States, copy, and accessibility

Use Indonesian actions and familiar HSR stat names. Preserve source character/set names. Explain limitations next to affected results. Do not claim an optimal build unless the search establishes the stated guarantee.

Cover first run, filtered-empty results, validation error, storage restore/failure, missing images, search, cancellation, no result, and uncertain data. A missing image gets a labeled slot/name fallback, never a broken layout or invented official-looking art.

All fields have visible labels, controls at least 44px hit targets, logical keyboard order, visible focus, and working dialog Escape/focus return. Both themes meet AA text contrast. Images have explicit dimensions/aspect ratios and appropriate alt text.

## Purpose register

| Choice | Reason |
| --- | --- |
| Equipment composition | The owner selected HSR character/relic screens as the primary inspiration. |
| Relic grid plus side details | Separates visual scanning from full item inspection. |
| Top navigation | The owner requested a wide work area with navigation above it. |
| Contained character splash | The owner explicitly allowed prominent artwork; selected-character context gives it a role. |
| Gold annotations and framing | Connects high-rarity equipment with primary selection/action. |
| Opaque stat surfaces | Preserves contrast independently of artwork. |
| Condensed headings and tabular stats | Adds game-interface character while retaining numerical legibility. |
| Short panel/selection motion | Makes state changes perceptible while measurements stay stable. |
| Shared theme tokens | Keeps the two requested modes functionally equal. |

## Implementation and review

Design documentation branch: docs/design-direction. Implement visual changes on feat/hsr-visual-direction, separate from importer/math work.

Before final UI delivery, record the antislop gate and a control-by-control walkthrough in docs/VERIFICATION.md. Verify both themes, wide/narrow layouts, keyboard operation, image failure, import/error states, comparison, search cancellation, and timeline behavior. A functional shell is not evidence of accepted visual design.
