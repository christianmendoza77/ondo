# Responsiveness Audit (mobile / iPhone): handoff

Last updated: 12 Nov 2026. Status: **Home, USDY and OUSG done**. Next: the rest of the pages in the Products menu.

## Goal
Flag only the **critical** mobile responsiveness cases on ondo.finance that are worth handing to devs. This is not an exhaustive QA pass.

## Decisions made
- **Severity levels (2 only):**
  - **P1 · Broken** (red): the user can't read, understand or act. Examples: page-wide horizontal scroll, hidden CTA or nav, clipped content, broken menu.
  - **P2 · Friction** (orange): it works, but gets in the way or confuses. Examples: broken hierarchy, empty areas, small tap targets, overlays covering content.
  - P3 / Polish was dropped at the user's request. Don't report it.
- **Viewport:** **402 × 713**, the iPhone 17 / 17 Pro width. Those were the best-selling US iPhones in Q2 2026 (Counterpoint) and they're Ondo's main market. Spot checks at 375 (SE/mini, stress test) and 440 (17 Pro Max).
  - The 713 height comes from Ondo's analytics: the short Safari viewport.
  - Ondo also sent widths of 392 / 488 / 416. They don't match any iPhone model, so we're treating them with caution.
- **No desktop, no tablet:** mobile (iPhone) only. hellohello usually designs at 400 and 900.
- **Board language:** English.

## Where it lives (Figma)
- File **Ondo – Marketing II** (`q81BOc21aADU9ypHSAMM8A`), page **"↪ Resposiveness Audit"** (`17407:1521`).
- **Components (on this page, 13 Nov):**
  - `Audit/Section Header` (`17473:368`, at x72 y400): TEXT property **Title**, style Tablet/Heading/h3-gx (36).
  - `Audit/Note` set (`17474:452`, at x1712 y60): variant **Severity = P1 | P2**; TEXT properties **Badge, Title, What happens, Expected**. Gellix only (h6-gx title, bodyM-gx body; Expected in fg-secondary, prefixed "Expected: "). No location text next to the severity.
  - Editing their text via MCP: on the instance text node, set font to DM Sans Medium, set `characters`, then `setTextStyleIdAsync(<its original style>)`. This updates the property value.
- **Per-page layout:** everything sits loose on the canvas, with no wrapping frame. Each page is a 1296px-wide column with 200px between columns, laid out as:
  - an `Audit/Section Header` instance at y 853 (104 tall);
  - 176px below it, from y 1133, the page captured at 402 (rectangles with image fills, grouped as "<Page> · 402 × 713 (stitched capture)");
  - "Mark X" groups: an outline rectangle plus a numbered badge over the problem area;
  - `Audit/Note` instances named "Note X · …" at x = page + 522, width 774, aligned to the height of their mark.
- **Columns:** 1296 wide, **344px apart**: Home x72 · USDY x1712 · OUSG x3352 · next page x4992.

## Findings so far
Shared conventions in every page: badges **G** = tap targets (whole page) and **D** = legal disclaimer.

### Home (`ondo.finance/`)
- **1 · P2:** the hero ("Swipe to explore") takes over scrolling. Needs testing on a real iPhone; it's the case most likely to become P1.
- **2 · P2:** the legal disclaimer modal covers 51% of the screen at 402 (53% at 375) on first scroll.
- **3 · P2:** empty black areas of ~290px after "Contact Us" (Nexus) and after "Explore Our Partners" (Ecosystem). The ecosystem visual is hidden on mobile.
- **G · P2:** tap targets. Buttons are 36px, footer links 21–24px.

### USDY (`/usdy`, 17,701px tall)
- **2 · P1:** the Portfolio Overview holdings table is 738px wide in a 368px box. "Current Value" is cut mid-number ("$422,"). The only scroll cue is a thin bar.
- **1 · P2:** ~320px of empty navy after the last card in "Security, Utility & Liquidity".
- **3 · P2:** a "Show 0 More Positions" button with nothing to show. Probably on desktop too.
- **G · P2:** tap targets. Buttons 36px, chart toggles 28px, "Learn More" and attestation links 20px.
- **D · P2:** same disclaimer as Home.

### OUSG (`/ousg`, 14,912px tall)
- **1 · P1:** the holdings table is 848px wide in 368; only % and Position are visible.
- **G · P2:** tap targets. Same as USDY, plus ~24px "?" tooltip icons in "OUSG in Detail".
- **D · P2:** same disclaimer.

### Not reported (on purpose)
- OUSG hero numbers looking wrong on load: the counter animation runs very slowly in the built-in browser; the final values are correct.
- USDY TVL chart axis repeats "$2B": a format issue, not responsive.

## Pending
1. The rest of the **Products** menu: Ondo Stocks, Intelligent Portfolios, Private Markets, Flux (external), Nexus, Ondo Network, Converter (external)…
   - Then possibly the Resources, Ecosystem and About menus.
   - The order is the user's call; they're going in menu order.
2. Hero scroll-jacking (Home #1) needs checking on a **real iPhone**.

## Method (to repeat on each page)
1. **Built-in browser** (`mcp__Claude_Browser__*`): `resize_window` to 402×713 (the app resets it at the end of every turn, so set it again), then `navigate`.
2. **Automated JS checks:**
   - horizontal overflow (body has `overflow-x: clip`, so it can hide clipped content);
   - scroll containers with `scrollWidth > clientWidth` (this is how the tables were found);
   - tap targets under 44px;
   - text overflow;
   - h1–h3 with their y positions.
3. **Capture in viewport-height steps:** `scrollTo(k*713)`, wait ~1.3s, then a hide function (below), then `screenshot` at scale 0.75 (600×1064 per step). The last step goes at `H-713`.
   - The hide function hides the fixed elements (the cookie banner and the "have not been registered" disclaimer) and, from the second step on, the fixed header.
   - The disclaimer appears late: hide again before the screenshot.
   - On Home, the hero only releases the scroll with the wheel (`computer scroll`), not with `scrollTo`.
4. **Stitch with Pillow:**
   - scale factor `1064/713`;
   - cut into 2600px CSS chunks, because Figma caps images at 4096px.
   - Scratchpad folder: `.../scratchpad/stitch/`.
5. **Figma:**
   - create the rectangles (402 × chunk height);
   - `upload_assets` with `nodeIds`, then `curl` POST to each URL;
   - marks and notes are built with Nebula styles: `h6-gx`, `bodyS-gx`, `bodyM-az`;
   - placeholder fonts DM Sans / Source Serif 4 first, then `setTextStyleIdAsync`.

### Useful Nebula keys
- **Tokens:**
  - `bg-red-light` 4be56391…
  - `fg-red-default` 5a5b7d7a…
  - `bg-orange-light` dd34baa0…
  - `fg-orange-default` c545549b…
  - `bg-tertiary` 64e59712…
  - `fg-primary` 91167243…
  - `fg-secondary` f3d830db…
  - White c94ce698…
- **Text styles:**
  - h6-gx aa6e3536…
  - bodyS-gx 400d4473…
  - bodyM-az 54ee548b…
- **Gotcha:** opacity on a variable-bound paint is ignored (the fill comes out solid), so highlights are outline only.
