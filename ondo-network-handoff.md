# Ondo Network landing: project handoff

_Last updated: 2026-10-19_

## 1. Project summary

**What:** a new landing page for **Ondo Network**, Ondo's execution layer and an Ondo technology like Nexus. It replaces the deprecated **Ondo Chain** landing. Design is 1440 desktop first; responsive comes later. Deliverables: the Figma page, plus (since 2026-10-20) a coded prototype.

**Code prototype:** `ondo-network.html` (single file, inline CSS, same base as `nexus.html`; assets in `assets/network/`). Desktop 1440 static build of all 8 sections, checked against Figma. **Interactions and responsive are reviewed section by section with the user, not done in bulk.** Built since: hero load animation ("Hero B": axis shoots in, rings open from it, nodes pop, then a light pulse runs along the axis every 4.2s; it replaced the earlier version based on the Figma "animation frames" keyframes, so those frames are now out of date; the proposal file ondo-network-hero-b.html is kept for reference), Nexus-style scroll fade-ups, 100vh hero, full-width hero overlay, comparison rows animating one by one, How it works carousel (3 step visuals from Figma, 4s autoplay, one continuous progress line), Connect the Story diagram build. Not yet built: tablet/mobile. Known code ≠ Figma on purpose: the code hero title has no final period ("moving at a new speed"); Figma still has it, user said leave Figma for now. Preview: `.claude/launch.json` → `ondo-network` serves a copy in the session scratchpad (the sandbox can't serve from Documents), so re-copy the file after edits.

**Inputs**
- Copy: the client's Google Doc (sections Hero, Benefits, How it works, See it in action, Connect the Story, Closing CTA).
- Source content: blog post _Introducing the Ondo Network_ (https://ondo.finance/blog/introducing-the-ondo-network). It has 2 graphics: an architecture diagram and a comparison chart, "Built for Institutional-Grade Execution".
- Brand: https://ondo.finance/ and the Nebula design system.
- Reference landings in the same Figma page: Ondo Intelligent Portfolio (OIP), Ondo Nexus, Ondo Foundation, plus the old Ondo Chain landing.

**Figma**
- File: **Ondo – Marketing II** (`q81BOc21aADU9ypHSAMM8A`), page **"↪Ondo Network"** (`16563:353`).
- Design system: **Nebula Design System_Internal** (`5DiISz09hSpXa6UMICw1JW`), already linked as a library to Marketing II.

## 2. Key nodes (on page `16563:353`)

| What | Node ID |
|---|---|
| **Main landing: "Ondo Network — Desktop 1440"** | `16582:892` |
| Local Components frame | `16584:924` |
| How it works module, component set `HIW/Module (simplified)` (only Theme=Dark variants remain: Step=1/2/3) | `16603:1286` |
| Comparison table pieces, component set `Compare Alt/Table Cell` (Type = Column Head / Feature / Yes / No) | `16622:1209` |
| Comparison table wrapper on the page | `16602:1091` |
| Benefits section on the page (Variant B, header in grid) | `16601:1076` |
| See it in action section on the page | `16606:1547` |
| Connect the Story graph (auto-layout) | `16620:1210` |
| Custom icon `icon / gauge` (Speed card) | `16609:1519` |
| Hero on the page (V2 Concentric pulse) | `16591:1131` |
| Visual Territories (hero style source) | `16567:6105` |
| Ondo Perps product mockup source | `16580:21032` |

Alternative variants (See it in action B/C, Connect the Story B/C, Comparison alt, hero V1/V3) sit beside the main page. The user moves things around the canvas, so **search by name if an ID fails**.

## 3. Current page structure (top to bottom)

1. **Hero** (dark, Colors/Green/600 `#002B20`): V2 "Concentric pulse", linear style from Visual Territories. Copy: _Financial markets, moving at a new speed._ CTAs: Explore Ondo Perps / How it works.
2. **Benefits** (light): Variant B, the eyebrow and headline sit in the first grid cell, then 5 cards in an equal 3-column grid (440px). Headline: _Verifiable without being fully visible._
3. **Comparison** (dark): table with separate cells (OIP style). 5 features × 6 columns (Ondo Network, CEXs, Standard Public Blockchains, App-Specific Chains, ZK Exchanges, Permissioned Networks). White outline around the Ondo Network column; 1px spacers on each side of that column. Values come from the blog chart.
4. **How it works** (dark): steps on the left plus a simple linear visual per step (green card). Headline: _Execute privately. Verify independently._
5. **See it in action** (dark): centered copy on top; the Perps UI below, fading in from black at its top edge. Green grid background with 48px divisions.
6. **Connect the Story / Building on Ondo Chain** (light): auto-layout graph, Execution · Ondo Network ↔ Settlement · Public blockchains.
7. **Closing CTA**: _What will you build next?_ Photo banner.
8. **Footer** (from Nexus).

## 4. Decisions taken

### Visual direction
- The hero uses the **linear style** from Visual Territories: deep green bg (Green/600), thin mint lines (Green/400), node squares (Green/300). The user chose **V2 Concentric pulse**. A photographic hero is planned for later.
- **Ondo logo only.** Ondo Network is an Ondo technology, so no separate logo.
- **Mixed light/dark by section, but avoid light↔dark ping-pong.** Dark sections should form one cohesive block of several sections, as on the OIP, Nexus and Foundation pages. A test version with a continuous dark block was made and later deleted by the user; the principle still applies.
- **No split layout right after another split section.** That's why See it in action changed to a stacked/centered layout.
- **No heavy cell divisions in tables with many columns.** The user explored a unified table (blog style) versus separate cells; the page currently uses separate cells with the outlined Ondo column.
- **No tooltips** in the comparison table.
- No decorative node squares on box/card corners. They're only allowed where lines end or meet, and they were removed from How it works and Connect the Story.
- See it in action uses **one background only**. The Foundation dot pattern was removed from the Perps mockup.

### Section decisions
- **Benefits:** the 5 value props in an equal grid; no card with an illustration. All descriptions are **2 lines and similar length** (320px text width). Copy:
  - Speed: "Execute at speeds approaching centralized exchanges, matching in milliseconds."
  - Privacy: "Keep sensitive positions and order flow off public ledgers and out of view."
  - Verifiability: "Let approved third parties check that execution followed the rules, step by step."
  - Control: "No single operator can move user funds alone. Assets remain yours to control."
  - Decentralized Security: "Multiple attestors already running; more can join as Network activity grows." (shortened, approved by user)
- **Speed icon:** the custom `icon / gauge` follows the Nebula icon rules: 24×24 grid scaled to 20×20, 1.5px stroke, straight caps, miter joins, 45° angles, outlined and flattened as a layer named "Icon". It still needs adding to the Nebula icon sheet (library), which wasn't done.
- **How it works:** 3 steps from the doc's subhead sentences. Short titles **Execute / Verify / Settle**; subtitles are 2 lines with balanced wrap (fixed widths, because the Figma API has no balance setting):
  - 01: "Secure hardware runs applications privately, isolated in verified enclaves." (the added words come from the blog)
  - 02: "Independent attestors verify approved code and collectively provision keys." (doc, verbatim)
  - 03: "Asset transfers settle on public blockchains, confirmed by attestors." (the added words come from the blog)
  - **Inactive steps use opacity 40%** on the whole item; all texts keep the active colors (better for code: `opacity: .4` + transition). Click-to-step prototype with Smart Animate.
  - Step 3 visual: the first public-blockchain block shows a **check** (icon / check, Green/300) instead of a fill. The user made the "Secure hardware" box a solid green fill; keep that.
- **Connect the Story:** block titles are **Execution** (kicker: Ondo Network) and **Settlement** (kicker: Public blockchains). Chips: Secure hardware, Attestor quorum, Signed log | Asset transfers, Onchain events, Durable settlement. Connectors: "Asset transfers settle" (solid), "Onchain events confirmed" (dashed, a simplification because attestors do the confirming). **Built fully with auto-layout** for responsive work later.
- **Closing CTA:** the CTA is still TBD; the placeholder is "Talk to our team".

### Copy rules
- **Don't invent copy or diagrams beyond the Google Doc without flagging it.** The user asked where content came from several times. Anything derived from the blog must be labeled as such.
- Copy from the blog that's still in use and needs client confirmation: the Benefits description extensions, the HIW subtitle extensions for 01/03, and the Connect the Story chips and connectors.

### Design system rules
- Colors, text styles and components come from **Nebula**. Bind variables; no loose hex values.
- **Label/* text styles are ONLY for CTAs** (buttons, nav). Eyebrows, chips and labels use the Body gx/az equivalents (Label M → Body M gx, and so on).
- Everything new should use auto-layout, so it's ready for responsive.
- Fonts: Gellix (headings/UI, `-gx`) and ABC Arizona Text (body, `-az`).

## 5. Technical notes for the Figma MCP (important)
- The MCP server **can't load Gellix or ABC Arizona**. Workaround:
  1. To create or edit text, set the font to a placeholder (DM Sans Medium for Gellix, Source Serif 4 Regular for Arizona) and set fontSize to the style's size.
  2. Set all text props (characters, fills, width, align, autoResize) **before** applying the style.
  3. Apply the Nebula text style with `setTextStyleIdAsync`. This works without loading Gellix.
  4. After a Gellix style is applied, changing any property fails, so swap back to the placeholder font first ("swap dance").
- The server **can't reflow Gellix text**, so set explicit widths. Screenshots may show stale or overlapping text even when the data is right.
- **Nebula button labels can't be edited via MCP** (component font). The user relabels them by hand. Instances are named `Button → "label"`.
- Large `get_metadata` / `use_figma` responses get cut off around 20KB. Keep returns small.
- `vectorPaths` doesn't support SVG arcs; use `createNodeFromSvg`. Boolean groups can't take constraints, so flatten them. Paint opacity on bound variables is unreliable; spread `{...paint, opacity}`.

## 6. Pending / next steps
- [ ] Hero labels: the page hero (`16611:30644`) has no labels and no longer collides with the headline. Proposal "Labels A" (`16655:1671`, hero only, to the right of the page): Secure hardware / Attestors / Public blockchains (inner → outer ring, blog-derived terms), with vertical leaders from existing bottom nodes to a node square, Green/200, bodyS-gx. Awaiting the user's choice.
- [ ] Photographic hero exploration (planned).
- [ ] Re-check the overall light/dark grouping on the main page (one cohesive dark block).
- [ ] Get client confirmation of the blog-derived copy (see Copy rules).
- [ ] Closing CTA copy (TBD).
- [ ] Add `icon / gauge` to the Nebula icon sheet (library edit, needs OK).
- [ ] Optional: snap the comparison outline to whole pixels (currently 4.5px offsets).
- [ ] Tablet and mobile layouts.
- [ ] The user retypes the Nebula button labels manually where needed.
