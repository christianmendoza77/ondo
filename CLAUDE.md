# Ondo — working notes for Claude

Agency: hellohello, working for the client **Ondo Finance**. This folder holds Ondo marketing work: coded landing pages (`*.html`), handoff packages, and notes for Figma projects. Project-specific context (node IDs, decisions, pending items) belongs in a per-project `<project>-handoff.md` file, not here. When continuing a project, ask which one applies or look for its handoff file. Keep this file to rules that apply across Ondo projects.

## Working style
- Ask before designing when the brief is ambiguous; otherwise make sensible defaults and say which ones you picked.
- **Never invent copy, data or diagrams without flagging it.** The client's Google Doc is the source of truth. Anything taken from elsewhere (blog posts, ondo.finance) must be labeled with its source, and anything you wrote yourself must be called out as a proposal. The user regularly asks "where did this come from?", so be ready to answer precisely.
- When asked for variants, place them **to the right of the main design, aligned to the section they replace**. Don't overwrite the original.
- When the user edits something by hand in Figma, keep their change. Don't revert it.
- Reply in the user's language (Spanish or English).

## Ondo brand and layout principles
- **Logo:** Ondo technologies (Nexus, Network, etc.) use the **Ondo logo only**, no product logos.
- **Fonts:** Gellix for headings/UI (`-gx` styles) and ABC Arizona Text for body copy (`-az` styles).
- **Two-tone headlines:** first line white/black, second line muted (fg-tertiary).
- **Light/dark rhythm:** group dark sections into **one cohesive dark block spanning several sections**, as on the OIP, Nexus and Foundation pages. Avoid ping-ponging between light and dark.
- **Avoid two split (text | visual) layouts in a row.** Alternate with stacked/centered sections.
- **Tables with many columns:** avoid heavy per-cell divisions; highlight the Ondo column (outline, or a raised green column). No tooltips in tables.
- **One background per visual:** don't stack a green panel and a dot pattern.
- **Linear illustration style** (from the "Visual Territories" in Marketing II): deep green bg Colors/Green/600 (#002B20), 1–1.5px lines in Green/400, node squares and labels in Green/300. Put node squares only where lines **end or meet**, never decoratively on box corners.
- **Card grids:** equal column widths across rows, descriptions of equal length (e.g. all 2 lines), and no single odd card (such as the only card with an illustration).
- **Steps/tabs:** inactive items use **opacity 40%** on the whole item, keeping the same colors as the active one (easy to build: `opacity: .4` + transition). Use short titles plus a one-sentence subtitle, with balanced wrap (`text-wrap: balance`).
- **Build everything with auto-layout** so it translates to responsive later (1440 desktop first, then tablet/mobile).

## Nebula Design System (Figma)
- Library: **Nebula Design System_Internal** (`5DiISz09hSpXa6UMICw1JW`), linked to Ondo – Marketing II (`q81BOc21aADU9ypHSAMM8A`).
- Always bind colors to Nebula variables and use Nebula text styles and components. No loose hex values.
- **Label/* text styles are ONLY for CTAs** (buttons, nav items). Eyebrows, chips, table labels and so on use Body styles (Label M → Desktop/Body/bodyM-gx, etc.).
- Some useful variable keys: Green/600 `d6418a2624b483cc5b4c5acb0e5df04eb9f0a736`, Green/500 `62a6e622be32396d1abdb0396ec3548a48d95d1d`, Green/400 `78773ec67c8e568f3851f5c098f8394ceb46f38d`, Green/300 `9cdd7e55365696cb161c82d0a370d26e57b9c882`, Green/50 `9ad3aa49e38a537d43f37c9e76cf3bbb67a3e61a`, White `c94ce6988472b9942c7a6340d36610964feb2b67`, Black `08eab964636a4fc488c6a0c28a4a7afec3a15d08`, fg-primary `9116724373ddf625296cce1471cb07321dfbc30a`, fg-tertiary `46191af6c903ec9dcc892dbf0d07ecb5b89f989b`.
- **Icon rules** (for new icons): drawn on a 24×24 grid and scaled to 20×20 in the library; 1.5px stroke (1.25 at 20); straight line ends (no round caps); miter joins (bevel on acute angles); no corner radius; geometric shapes at 90°/45°; minimum detail. Outline and union the strokes, name the layer "Icon", and name the icon by its look (e.g. `icon / gauge`). New icons should be added to the Nebula icon sheet, but only with the user's OK, since that edits the library.

## Figma MCP: gotchas and workarounds
- **The MCP server cannot load Gellix or ABC Arizona.** To create or edit text:
  1. Set the font to a placeholder (DM Sans Medium for Gellix, Source Serif 4 Regular for Arizona) and set `fontSize` to the target style's size.
  2. Set characters, fills, width, alignment and autoResize **before** applying the style.
  3. Apply the Nebula style with `setTextStyleIdAsync`. This works without loading Gellix.
  4. Once a Gellix/Arizona style is applied, any further property change fails. To edit again, swap to the placeholder font, change it, then reapply the style ("swap dance"). This also applies to text inside instances.
- The server **can't reflow Gellix text**: set explicit widths, and expect screenshots to show stale or overlapping text even when the data is right (verify by reading `characters`).
- **Nebula button/nav labels can't be changed via MCP** (component font). Name the instance `Button → "label"` and tell the user to retype it.
- Merging components that share a text property name can reset one instance's override, so re-check labels after `combineAsVariants`.
- `get_metadata` / `use_figma` responses over ~20KB get cut off. Keep returns small and inspect level by level.
- `vectorPaths` doesn't support SVG arcs; use `createNodeFromSvg`. Boolean groups can't take constraints, so flatten them first. Paint opacity on a variable-bound paint is unreliable; use `{...boundPaint, opacity}`.
- The user moves and deletes frames on the canvas: **find nodes by name if an ID fails**, and check the current state before editing.
