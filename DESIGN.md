# Orbit design brief

Status: O-03b implements the owner's Figma reference with the approved review revisions. The earlier O-03a layout is superseded. The synthetic demo remains separate from O-04a personal inventory import. Imported items use the same panel/grid/theme language with catalogue-derived main stats and sourced local set/slot icons; unknown sets keep textual identification; no unrelated artwork is substituted. Manual-profile calculation and A/B comparison are implemented in O-05; optimization is implemented in O-06 and the fixed-speed timeline is implemented in O-07. See docs/FIGMA_HANDOFF.md for source frames/deviations and docs/VERIFICATION.md for executed checks.

## Decisions from the owner

| Topic | Accepted direction |
| --- | --- |
| Main inspiration | HSR character and relic screens: visual equipment, statistics beside the selected item |
| Information density | Balanced: relics stay visual and key numbers remain easy to compare |
| Artwork | Real character artwork and splash art may be a major part of the interface |
| Workspace | Top navigation, wide working area, details in a side panel |
| Motion | Short panel and selection transitions; numeric information remains stable |
| Themes | Fully working dark and light modes |
| Interface language | English, including accessibility labels and metadata; supersedes the Figma reference's Indonesian copy |
| Process | Antislop DURING, applied while planning and implementing |

The owner supplied [the Orbit Figma file](https://www.figma.com/design/pVMHEP3S3rp9vMRIlfoeUp/Untitled?node-id=2-2698) and authorized implementation with the review revisions. This supersedes the earlier palette/type proposals. Keep the Figma identity while reducing excess vertical space and completing interaction states; the Figma canvas itself was not edited.

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

## Figma palette and typography

| Role | Dark | Light | Purpose |
| --- | --- | --- | --- |
| Page | Midnight #10151E | Warm ivory #F1EDE4 | Frame equipment and artwork |
| Panel | Blue slate #181F2B | Near-white #FAF7F0 | Keep numerical content on opaque surfaces |
| Selected surface | Warm slate #29271F | Pale gold #EEE4CF | Distinguish selection and active controls |
| Primary text | Ivory #F0F2F5 | Ink #242A32 | Stable reading contrast |
| Secondary text | Pale gray #AAB5C5 | Gray #60656C | Readable labels; light token darkened from Figma #646970 for selected-surface contrast |
| Main accent | Muted gold #CFB47B | Dark gold #80612B | Primary action, equipment annotations, selected framing |
| Structural color | Ice blue #9CCBDD | Deep blue #285F75 | Slot context and timeline guides, used sparingly |

These tokens are not an accessibility certification. Scoped text-pair checks are recorded in VERIFICATION.md. Neutrals plus gold and one cool focus color form the palette. Timeline actors also need names/lane numbers rather than extra hues alone.

Avoid neon cyan, purple gradients, glowing background orbs, and starfield wallpaper. A quiet image fade may protect reading contrast, with a defined boundary and purpose. It must not turn every panel into glass.

Use the Figma families: Rajdhani Semibold for headings/main measurements, Inter for controls and prose, and IBM Plex Mono for aligned substat values. Latin WOFF2 subsets and SIL Open Font License notices are bundled locally; system fonts cover unsupported glyphs. The text wordmark follows the supplied ORBIT treatment.

No external font CDN at runtime. Record the source and license before bundling a font.

## Surfaces and interaction language

Mostly opaque panels, a restrained radius scale (controls 4px, item panels 6px, dialogs 10px), and shadows only for dialogs/drawers. Short corner brackets or cut-corner framing may identify a selected relic or active loadout. Do not outline every object with decorative geometry.

Use actual relic/set/character assets where relevant. Stat labels do not need an icon each. Level/rarity annotations may use gold because they communicate equipment information. Do not put decorative arrows on every action or add capsule badges above page titles.

## Desktop and responsive composition

Top bar: Orbit text name, implemented workspace destinations, theme control, import/backup actions. An inventory context row shows source, import time, actual counts, and precision because they affect the player's decisions.

At wide desktop widths, use a flexible work area and a 320-380px detail panel. At intermediate widths, detail becomes a drawer. At narrow widths, retain top navigation and a single-column equipment flow; the document itself never overflows horizontally.

O-03b uses a contained horizontal character banner above the collection, six compact equipment selectors, four relic columns at 1440px, and a 344px inspector. Mobile uses compact single-column cards with two-column substats and a full-height native detail dialog. The banner, slot controls, and filters must leave the first card visible at a 390x844 viewport. Full stat labels and four active substats remain present.

Equipment selectors choose the equipped example without changing filters or sort. Slot/status controls filter independently; sort supports equipped-first and both slot directions. If selection is outside a nonempty filtered list, show a clear-reset action. Inspector position follows the visible sorted results, or states Di luar hasil. Reset and exit-demo controls remain available. Source/precision text is progressively disclosed; credits belong in the footer.

The four requested destinations are Inventory, Perbandingan build, Optimizer, and Speed tuning. Add links only when their views work. Use links for navigation and buttons for actions.

## Inventory

Primary decision: which relic should the player inspect or try in a build?

The main area contains filters and a balanced relic grid. Each cell shows a real item/slot image, set, level, main stat, four active substats, and equipment/lock/discard state. Values remain visible without hover. Repetition is appropriate because cells represent equivalent equipment objects.

Selecting an item updates the right panel without moving the grid. The panel contains the complete stat breakdown, active versus preview/reroll stats, identity, current owner, and an action to use the relic in loadout B. Selection has a visible frame and accessible state text.

Show the actual result count. Supported filters include slot, set, main stat, level, rarity, equipped state, lock/discard, and text search. Use pagination or virtualization for thousands of items.

First run gives a real JSON import action and scanner instructions. A synthetic demo is explicitly labeled; it never resembles an invented personal account or UID.

O-09 adds a collapsed **Scan inventory from HSR** panel above the existing import toolbar. It reuses the opaque surface, 6px panel radius, Rajdhani/Inter hierarchy and gold primary action because scanning is an inventory acquisition action, not another destination. Its disclosure keeps preparation text away from relic inspection. Show one textual native-job state, real errors and a Review scan action; use no simulated percentages, decorative terminal, new artwork or recording pulse. Polling can continue while the panel is collapsed; explain that collapsing does not stop capture. Keep the existing ENERGY 2 / RHYTHM 2 / MOTION 2 dials and stable numeric content. Scan preview shares the existing explicit replacement controls.

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

Use English actions and familiar HSR stat names. The owner selected English as the primary product language after the Figma implementation. Preserve source character/set names, use English accessibility names/fallbacks/errors, and keep document metadata and lang consistent. Explain limitations next to affected results. Do not claim an optimal build unless the search establishes the stated guarantee.

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

Keep visual changes separate from importer/math tasks and use the current task branch recorded in SESSION_STATE.md. Source frames and deliberate Figma deviations belong in FIGMA_HANDOFF.md.

Before UI delivery, record a scoped antislop gate and control walkthrough linked from docs/VERIFICATION.md. Verify both themes, wide/narrow layouts, keyboard operation, image failure, and the implemented workflows. Import, comparison, cancellation, and timeline acceptance belong to their respective implementation tasks. Passing checks does not imply owner approval of the visual result.


O-05 follows the shared equipment palette and six-slot layout with a collapsible manual profile, reference/candidate columns, bounded candidate pages and an aligned numeric ledger. Acheron artwork is reused only when the user explicitly declares that manual profile; no unbundled character art is substituted. Mobile stacks A and B, keeps both navigation destinations visible, and confines very wide numeric rows to a keyboard-focusable ledger scroll area.

O-06 reuses the shared calculation-profile shell and declared-character artwork. A dedicated Optimizer navigation destination exposes search settings, explicit coverage/budget/provenance, bounded result lists with six visual slots, and transfer to B. Mobile navigation wraps rather than hiding destinations. Search errors, cancelled state, non-exhaustive no-result state and unavailable retained filters have distinct text. Results/settings are not silently saved.

O-07 uses a collapsible four-member editor above a data-driven AV chart with numbered/named lanes, turn markers and meaningful cycle boundaries. Numeric cycle counts and a paginated event ledger accompany the visual. The chart retains readable text via a 1000px internal width; mobile scrolling is contained in focusable regions rather than overflowing the document. Threshold precision/assumptions are visible beside results. No invented portraits or external visualization dependency is introduced.
