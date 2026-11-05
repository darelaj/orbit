# Figma implementation handoff

The owner supplied [this Orbit file](https://www.figma.com/design/pVMHEP3S3rp9vMRIlfoeUp/Untitled?node-id=2-2698), requested a review first, then authorized implementation with that review's revisions on 2026-11-06. The Figma canvas was not edited. This document describes the code translation, not changes to the design file.

The owner subsequently requested English as the primary application language in O-03c. English copy, accessibility names, and metadata supersede Indonesian labels in the reference; the layout and assets remain the same.

## Source frames

| Frame | Node | Role |
| --- | --- | --- |
| Desktop dark | 2:2698 | Primary composition, typography, colors, cards, inspector |
| Desktop light | 2:3063 | Light tokens and SVG icon variants |
| Mobile inventory | 2:3428 | Narrow-screen hierarchy and single-column collection |
| Mobile detail | 2:3743 | Full-height detail presentation |
| Empty inventory / guide | 2:3796 | Honest demo entry and scanner preparation |
| No results | 2:3852 | Useful recovery rather than an empty collection |
| Asset failure | 2:3928 | Missing imagery must preserve item identity/stats |
| Native components | 2:5417 | State reference; malformed fixed widths are not implementation constraints |

High-fidelity get_design_context responses and screenshots were read for the screen references. Existing React components, native controls, and CSS tokens were reused and adapted; no Tailwind, UI framework, state library, or icon package was installed. No Code Connect mapping was supplied by the contexts.

## Approved revisions and implementation decisions

| Review finding | Code behavior |
| --- | --- |
| Character/slot context pushes inventory below the fold | Horizontal banner reduced from 228px to 128px desktop / 88px mobile; compact selectors below it. At 1440x1000, cards start around 526px rather than the reference's 764px. |
| Mobile cards too tall | Single-column 227px cards with two-column active substats, compared with the reference's 354px cards. At 390x844 the first card starts around 589px and ends around 816px; the complete eight-item page is about 2578px instead of 3933px. |
| Reset/exit/menu behavior incomplete | Visible Reset filters and Exit demo, native slot/status/sort selects, both empty-state entry actions, no-results recovery, and selected-hidden recovery. |
| Equipment and filter roles ambiguous | Equipment selectors choose the equipped example without changing query/filter/sort. A hidden selection is explicitly labeled; Show selected relic resets filters. Position in the inspector follows visible sorted results, otherwise Outside results. |
| Repeated explanations occupy the inspector | One collection demo label; source/precision is a native disclosure in detail, credits are in the footer. No score/DPS/future feature navigation is invented. |
| Component sizing copied at 1720px | Responsive CSS grid/minmax and content sizing, no fixed 1720px slot or inspector widths. Actual Figma component definitions are unchanged. |
| Light selected-surface text | Secondary text darkened from #646970 to #60656C; original pairing measured about 4.38:1 and corrected pairing about 4.65:1. Main gold pairing remains about 4.54:1. |

These are deliberate owner-authorized deviations from the reference image. The remaining visual target is the Figma palette, Rajdhani/Inter/IBM Plex Mono typography, contained Acheron crop, slot order, four-column desktop card rhythm, and persistent inspector. The eight numeric fixtures follow the Figma example, remain synthetic, and are not calculation inputs.

## Component and asset mapping

| Figma element | Implementation |
| --- | --- |
| Navigation / wordmark / theme | App.tsx header, original theme preference key, theme-specific 18px Figma SVG |
| Character context and equipment | Workspace.tsx CharacterEquipment; existing 1308.png and six relic images |
| Search/filter/sort | Workspace.tsx InventoryFilters; native search/select/button controls |
| Relic card | Equipment.tsx RelicCard; stable demo IDs and fixed stat ordering |
| Selected relic / mobile detail | Equipment.tsx RelicDetails; desktop inspector and one native dialog with one return action |
| Source/precision | Native details/summary, collapsed by default |
| Empty inventory and preparation | Reused GameImage and ScannerGuide; import remains clearly pending |

Every game-image reference exported from desktop Figma matched its existing local PNG SHA-256 exactly, so those files were reused without duplication. All ten light/dark SVG exports are kept verbatim under public/assets/figma. Their 13px, 16px, and 18px root geometry is preserved at callsites. Game images remain square and data-driven; revised card/context sizes do not distort them. Font files, notices, and provenance are recorded in ASSETS.md.

The implementation does not add JSON import, account storage, stat calculation, comparison, optimization, or timeline features. See [the executed verification](FIGMA_VERIFICATION.md) for the current evidence and limitations.
