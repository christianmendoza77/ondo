// OIP Slide Deck Creator — Figma Plugin
// Creates 14 product slides (7 detail + 7 performance) on the OIP Deck page

const main = async () => {

  // ─── PAGE CHECK ─────────────────────────────────────────────────────────
  if (!figma.currentPage.name.includes('OIP Deck')) {
    figma.closePlugin('⚠️ Please navigate to the "↪ OIP Deck 🚧" page first, then run again.');
    return;
  }

  // ─── FONTS ───────────────────────────────────────────────────────────────
  const tryLoad = async (family, style) => {
    try { await figma.loadFontAsync({ family, style }); return { family, style }; }
    catch (_) { return null; }
  };

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const R = (await tryLoad('Gellix', 'Regular'))  || { family: 'Inter', style: 'Regular' };
  const M = (await tryLoad('Gellix', 'Medium'))   || (await tryLoad('Gellix', 'SemiBold')) || R;
  const B = (await tryLoad('Gellix', 'Bold'))     || (await tryLoad('Gellix', 'SemiBold')) || { family: 'Inter', style: 'Bold' };

  // ─── COLORS ──────────────────────────────────────────────────────────────
  const rgb = (r, g, b) => ({ r: r/255, g: g/255, b: b/255 });
  const C = {
    white:     rgb(255, 255, 255),
    black:     rgb(0,   0,   0  ),
    navy:      rgb(14,  30,  56 ),   // #0e1e38
    darkGray:  rgb(51,  51,  51 ),   // #333
    midGray:   rgb(98,  98,  98 ),   // #626262
    lightGray: rgb(240, 240, 240),   // #f0f0f0
    sep:       rgb(220, 220, 220),   // separator line
    lightBlue: rgb(224, 236, 255),   // #e0ecff — callout bg
    chartFill: rgb(28,  57,  102),   // #1c3966
    // Category backgrounds & text
    thBg: rgb(185, 210, 250), thTx: rgb(28,  57,  102),  // Thematic
    inBg: rgb(213, 229, 207), inTx: rgb(0,   43,  32 ),  // Income
    alBg: rgb(255, 214, 191), alTx: rgb(62,  36,  21 ),  // Allocation
    // Asset breakout bar colors
    bar0: rgb(28,  57,  102),  // navy
    bar1: rgb(100, 140, 200),  // mid blue
    bar2: rgb(185, 210, 250),  // light blue
    bar3: rgb(213, 229, 207),  // green
  };
  const BAR_PALETTE = [C.bar0, C.bar1, C.bar2, C.bar3];

  function catStyle(category) {
    if (category === 'THEMATIC')   return { bg: C.thBg, tx: C.thTx };
    if (category === 'INCOME')     return { bg: C.inBg, tx: C.inTx };
    if (category === 'ALLOCATION') return { bg: C.alBg, tx: C.alTx };
    return { bg: C.lightGray, tx: C.navy };
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────
  const page = figma.currentPage;

  function mkFrame(parent, x, y, w, h, fillColor, name = '', clip = true) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.x = x; f.y = y;
    f.clipsContent = clip;
    f.fills = fillColor ? [{ type: 'SOLID', color: fillColor }] : [];
    (parent || page).appendChild(f);
    return f;
  }

  function mkRect(parent, x, y, w, h, color, name = '') {
    const r = figma.createRectangle();
    r.name = name;
    r.resize(Math.max(w, 1), Math.max(h, 1));
    r.x = x; r.y = y;
    r.fills = [{ type: 'SOLID', color }];
    parent.appendChild(r);
    return r;
  }

  function mkText(parent, x, y, w, content, size, color, font, opts = {}) {
    if (!content) return null;
    font = font || R;
    const t = figma.createText();
    t.fontName = font;
    t.fontSize = size;
    t.fills = [{ type: 'SOLID', color }];
    if (opts.ls)   t.letterSpacing = { value: opts.ls, unit: 'PIXELS' };
    if (opts.lh)   t.lineHeight    = { value: opts.lh, unit: 'PIXELS' };
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (w > 0) {
      t.textAutoResize = 'HEIGHT';
      t.resize(w, 40);
    } else {
      t.textAutoResize = 'WIDTH_AND_HEIGHT';
    }
    t.characters = String(content);
    t.x = x; t.y = y;
    parent.appendChild(t);
    return t;
  }

  function mkSep(parent, x, y, w) {
    const r = mkRect(parent, x, y, w, 1, C.sep);
    return r;
  }

  // ─── PORTFOLIO DATA ───────────────────────────────────────────────────────
  const portfolios = [
    {
      ticker: 'MAG7Xon',
      name: 'Ondo Magnificent 7 & Crypto Portfolio',
      category: 'THEMATIC',
      benchmark: 'SPY',
      description: 'The Ondo Magnificent 7 and Crypto Portfolio implements an aggressive growth strategy by pairing the mega-cap technology stocks known as the "Magnificent Seven" with leading crypto assets. The portfolio holds an 80% equal-weight allocation to Apple, Microsoft, Alphabet, Amazon, NVIDIA, Meta, and Tesla, with the remaining 20% split between Bitcoin (15%) and Ethereum (5%).',
      reasons: [
        { title: 'Single token access to big tech & crypto', body: 'Single token exposure to all Magnificent 7 names plus BTC and ETH.' },
        { title: 'Low cost, systematic structure', body: '0.09% service fee with quarterly rebalancing and no reconstitution, so weights stay disciplined.' },
        { title: 'On-chain access', body: 'Tokenized on Ethereum and BNB with a $5.00 starting value.' },
      ],
      stats: [
        ['Model Provider',       'Ondo'],
        ['Inception Date',       '8/12/2026'],
        ['# of Constituents',   '9'],
        ['Rebalance',           'Quarterly'],
        ['Reconstitution',      'Fixed'],
        ['Distribution',        'Reinvested into constituents'],
        ['Yield*',              '0.22%'],
        ['After Withholding**', '0.16%'],
        ['Supported Chains',    'Ethereum, BNB'],
        ['Service Fee',         '0.09%'],
        ['Fee Waiver',          '0.00% (first 30 days)'],
        ['Starting Value',      '$5.00'],
      ],
      assetBreakout: [
        { pct: 80, label: 'US Equity' },
        { pct: 20, label: 'ETFs' },
      ],
      afterWithholdingYield: '0.16%',
      constituents: [
        ['IBITon',  'iShares Bitcoin Trust ETF',  '15.00%'],
        ['NVDAon',  'NVIDIA',                      '11.43%'],
        ['MSFTon',  'Microsoft',                   '11.43%'],
        ['AAPLon',  'Apple',                       '11.43%'],
        ['GOOGLon', 'Alphabet',                    '11.43%'],
        ['AMZNon',  'Amazon',                      '11.43%'],
        ['METAon',  'Meta Platforms',              '11.43%'],
        ['TSLAon',  'Tesla',                       '11.43%'],
        ['ETHAon',  'iShares Ethereum Trust ETF',  '4.99%'],
      ],
      calPerf: [
        ['2025',                   '21.19%', '17.72%'],
        ['2026 (As of 8/24/2026)', '0.40%',  '12.55%'],
      ],
      annPerf: [
        ['1 Year',                 '4.04%', '19.72%'],
        ['2026 (As of 8/24/2026)', '0.40%', '12.55%'],
      ],
    },
    {
      ticker: 'BRAINon',
      name: 'Ondo AI Leaders Portfolio',
      category: 'THEMATIC',
      benchmark: 'SPY',
      description: 'The Ondo AI Leaders Portfolio provides modified market-cap exposure to the artificial intelligence value chain spanning semiconductors and compute, AI infrastructure, power and energy, and AI thematic ETFs. Roughly 85% is allocated to individual stocks and 15% to ETFs.',
      reasons: [
        { title: 'Single token broad AI exposure', body: 'Full-stack exposure to the AI buildout: semiconductors, data center hardware, and the power/utilities driving AI growth, in one token.' },
        { title: 'Low cost, systematic structure', body: '0.09% service fee with quarterly rebalancing and no reconstitution, so weights stay disciplined.' },
        { title: 'On-chain access', body: 'Tokenized on Ethereum and BNB with a $5.00 starting value.' },
      ],
      stats: [
        ['Model Provider',       'Ondo'],
        ['Inception Date',       'TBD'],
        ['# of Constituents',   '36'],
        ['Rebalance',           'Quarterly'],
        ['Reconstitution',      'Fixed'],
        ['Distribution',        'Reinvested into constituents'],
        ['Yield*',              '0.33%'],
        ['After Withholding**', '0.25%'],
        ['Supported Chains',    'Ethereum, BNB'],
        ['Service Fee',         '0.09%'],
        ['Fee Waiver',          '0.00% (first 30 days)'],
        ['Starting Value',      '$5.00'],
      ],
      assetBreakout: [
        { pct: 77, label: 'US Equity' },
        { pct: 8,  label: 'ADR' },
        { pct: 15, label: 'ETFs' },
      ],
      afterWithholdingYield: '0.25%',
      constituents: [
        ['CEGon',  'Constellation Energy',                    '5.05%'],
        ['GEVon',  'GE Vernova',                              '5.05%'],
        ['ETNon',  'Eaton',                                   '5.05%'],
        ['ANETon', 'Arista Networks',                         '4.68%'],
        ['VSTon',  'Vistra',                                  '3.03%'],
        ['DRAMon', 'Roundhill Memory ETF',                    '3.00%'],
        ['BOTZon', 'Global X Robotics & AI ETF',              '3.00%'],
        ['IGVon',  'iShares Expanded Tech-Software ETF',      '3.00%'],
        ['DTCRon', 'Global X Data Center & Digital Infra ETF','3.00%'],
        ['Other',  'Other constituents',                      '65.14%'],
      ],
      calPerf: [
        ['2025',                   '—',      '17.72%'],
        ['2026 (As of 8/24/2026)', '39.94%', '12.55%'],
      ],
      annPerf: [
        ['1 Year',                 '—',      '19.72%'],
        ['2026 (As of 8/24/2026)', '39.94%', '12.55%'],
      ],
    },
    {
      ticker: 'BLKHIon',
      name: 'Ondo (Built with BlackRock) High Income TR Portfolio',
      category: 'INCOME',
      benchmark: 'AGG',
      description: 'The Ondo BlackRock Monthly Income TR Portfolio delivers global fixed income exposure with a monthly distribution. The token offers access to a BlackRock-modeled portfolio of active and passive iShares fixed income ETFs spanning flexible and total-return income, securitized debt, investment-grade credit, floating-rate loans, and high yield.',
      reasons: [
        { title: 'Built with BlackRock', body: 'A BlackRock-modeled allocation, rebalanced quarterly for a 0.35% fee.' },
        { title: 'Diversified income', body: 'Eight iShares ETFs across credit, securitized debt, loans and high yield.' },
        { title: 'On-chain access', body: 'Tokenized on Ethereum and BNB with a $5.00 starting value.' },
      ],
      stats: [
        ['Model Provider',       'BlackRock'],
        ['Inception Date',       'TBD'],
        ['# of Constituents',   '8'],
        ['Rebalance',           'Quarterly'],
        ['Reconstitution',      'Fixed'],
        ['Distribution',        'Reinvested into constituents'],
        ['Yield*',              '5.48%'],
        ['After Withholding**', '4.94%'],
        ['Supported Chains',    'Ethereum, BNB'],
        ['Service Fee',         '0.35%'],
        ['Fee Waiver',          '0.00% (first 90 days)'],
        ['Starting Value',      '$5.00'],
      ],
      assetBreakout: [
        { pct: 100, label: 'ETFs' },
      ],
      afterWithholdingYield: '4.94%',
      constituents: [
        ['IGEBon', 'iShares Investment Grade Systematic Bond ETF',            '24%'],
        ['HYGon',  'iShares iBoxx $ High Yield Corporate Bond ETF',           '24%'],
        ['BINCon', 'iShares Flexible Income Active ETF',                      '15%'],
        ['BRTRon', 'iShares Total Return Active ETF',                         '12%'],
        ['SECUon', 'iShares Securitized Income Active ETF',                    '9%'],
        ['HYGWon', 'iShares High Yield Corporate Bond BuyWrite Strategy ETF',  '6%'],
        ['SYSBon', 'iShares Systematic Bond ETF',                              '5%'],
        ['BRLNon', 'iShares Floating Rate Loan Active ETF',                    '5%'],
      ],
      calPerf: [
        ['2025',                   '—',     '7.19%'],
        ['2026 (As of 8/24/2026)', '0.80%', '-0.03%'],
      ],
      annPerf: [
        ['1 Year',                 '—',     '2.11%'],
        ['2026 (As of 8/24/2026)', '0.80%', '-0.03%'],
      ],
    },
    {
      ticker: 'YLD5on',
      name: 'Ondo 5 Targeted Income TR Portfolio',
      category: 'INCOME',
      benchmark: 'AGG',
      description: 'The Ondo 5% Targeted Income TR Portfolio aims to generate a reliable monthly income stream from exposure to select high-yield preferred shares, covered-call equity income, corporate bonds, and Real Estate Investment Trusts (REITs). The portfolio is systematically calibrated to an approximate 5% yield.',
      reasons: [
        { title: 'Targeted 5% reliable monthly cash flow', body: "Systematically calibrated across 10 holdings so income isn't dependent on any single asset class." },
        { title: 'Diversified income', body: 'Diversified across high-yield preferreds, covered-call equity income, corporate bonds, and REITs.' },
        { title: 'On-chain access', body: 'Tokenized on Ethereum and BNB with a $5.00 starting value.' },
      ],
      stats: [
        ['Model Provider',       'Ondo'],
        ['Inception Date',       'TBD'],
        ['# of Constituents',   '10'],
        ['Rebalance',           'Quarterly'],
        ['Reconstitution',      'Fixed'],
        ['Distribution',        'Reinvested into constituents'],
        ['Yield*',              '6.54%'],
        ['After Withholding**', '5.58%'],
        ['Supported Chains',    'Ethereum, BNB'],
        ['Service Fee',         '0.09%'],
        ['Fee Waiver',          '0.00% (first 30 days)'],
        ['Starting Value',      '$5.00'],
      ],
      assetBreakout: [
        { pct: 90, label: 'ETFs' },
        { pct: 10, label: 'Preferred Stock' },
      ],
      afterWithholdingYield: '5.58%',
      constituents: [
        ['SGOVon', 'iShares 0-3 Month Treasury Bond ETF',    '17.70%'],
        ['AGGon',  'iShares Core US Aggregate Bond ETF',     '16.00%'],
        ['JAAAon', 'Janus Henderson AAA CLO',                '13.00%'],
        ['QLTAon', 'iShares Aaa-A Corp Bond',                '11.00%'],
        ['QYLDon', 'Global X Nasdaq-100 Covered Call',       '10.30%'],
        ['HYGon',  'iShares iBoxx High Yield Corp Bond ETF',  '9.00%'],
        ['XYLDon', 'Global X S&P 500 Covered Call',           '8.00%'],
        ['SATAon', 'Strive Var-Rate Preferred',               '5.00%'],
        ['STRCon', "Strategy 'Stretch' Preferred",            '5.00%'],
        ['VNQon',  'Vanguard Real Estate ETF',                '5.00%'],
      ],
      calPerf: [
        ['2025',                   '—',     '7.19%'],
        ['2026 (As of 8/24/2026)', '4.46%', '-0.03%'],
      ],
      annPerf: [
        ['1 Year',                 '—',     '2.11%'],
        ['2026 (As of 8/24/2026)', '4.46%', '-0.03%'],
      ],
    },
    {
      ticker: 'YLD8on',
      name: 'Ondo 8 Targeted Income TR Portfolio',
      category: 'INCOME',
      benchmark: 'AGG',
      description: 'The Ondo 8% Targeted Income TR Portfolio seeks to generate an elevated monthly income stream by providing exposure to reliable income-generating investments across high-yield preferred shares, covered-call equity income, corporate bonds, and REITs. The portfolio is calibrated to an approximate 8% yield.',
      reasons: [
        { title: 'Targeted 8% reliable monthly cash flow', body: 'Weighted toward high-yield covered-call and preferred income to systematically target an 8% annualized yield.' },
        { title: 'Diversified income', body: 'Diversified across preferreds, covered-call equity income, corporate bonds, and REITs.' },
        { title: 'On-chain access', body: 'Tokenized on Ethereum and BNB with a $5.00 starting value.' },
      ],
      stats: [
        ['Model Provider',       'Ondo'],
        ['Inception Date',       'TBD'],
        ['# of Constituents',   '10'],
        ['Rebalance',           'Quarterly'],
        ['Reconstitution',      'Fixed'],
        ['Distribution',        'Reinvested into constituents'],
        ['Yield*',              '9.94%'],
        ['After Withholding**', '8.41%'],
        ['Supported Chains',    'Ethereum, BNB'],
        ['Service Fee',         '0.09%'],
        ['Fee Waiver',          '0.00% (first 30 days)'],
        ['Starting Value',      '$5.00'],
      ],
      assetBreakout: [
        { pct: 71, label: 'ETFs' },
        { pct: 29, label: 'Preferred Stock' },
      ],
      afterWithholdingYield: '8.41%',
      constituents: [
        ['XYLDon', 'Global X S&P 500 Covered Call',               '22.00%'],
        ['QYLDon', 'Global X Nasdaq-100 Covered Call',            '20.00%'],
        ['SATAon', 'Strive Var-Rate Preferred',                   '17.00%'],
        ['STRCon', "Strategy 'Stretch' Preferred",                '12.00%'],
        ['HYGon',  'iShares iBoxx High Yield Corp Bond ETF',      '12.00%'],
        ['QLTAon', 'iShares Aaa-A Corp Bond',                      '5.00%'],
        ['JAAAon', 'Janus Henderson AAA CLO',                      '4.00%'],
        ['AGGon',  'iShares Core US Aggregate Bond ETF',           '3.00%'],
        ['SGOVon', 'iShares 0-3 Month Treasury Bond ETF',          '3.00%'],
        ['VNQon',  'Vanguard Real Estate ETF',                     '2.00%'],
      ],
      calPerf: [
        ['2025',                   '—',     '7.19%'],
        ['2026 (As of 8/24/2026)', '8.05%', '-0.03%'],
      ],
      annPerf: [
        ['1 Year',                 '—',     '2.11%'],
        ['2026 (As of 8/24/2026)', '8.05%', '-0.03%'],
      ],
    },
    {
      ticker: 'BLKDIGon',
      name: 'Ondo (Built with BlackRock) Diversified Growth Portfolio',
      category: 'ALLOCATION',
      benchmark: 'SPY',
      description: 'The Ondo (Built with BlackRock) Diversified Growth Portfolio seeks balanced, moderate-risk growth through a BlackRock-modeled allocation of roughly 70% equities and 30% fixed income and alternatives. The portfolio offers exposure to active iShares equity strategies across U.S. and international markets, active fixed income, and alternatives, including gold and Bitcoin.',
      reasons: [
        { title: 'Built with BlackRock', body: 'A BlackRock-modeled allocation, rebalanced quarterly for a 0.49% fee.' },
        { title: 'Diversified across asset classes', body: 'Equities, fixed income, credit, securitized debt, and alternatives like gold and Bitcoin in one allocation.' },
        { title: 'On-chain access', body: 'Tokenized on Ethereum and BNB with a $5.00 starting value.' },
      ],
      stats: [
        ['Model Provider',       'BlackRock'],
        ['Inception Date',       'TBD'],
        ['# of Constituents',   '8'],
        ['Rebalance',           'Quarterly'],
        ['Reconstitution',      'Fixed'],
        ['Distribution',        'Reinvested into constituents'],
        ['Yield*',              'TBD'],
        ['After Withholding**', 'TBD'],
        ['Supported Chains',    'Ethereum, BNB'],
        ['Service Fee',         '0.49%'],
        ['Fee Waiver',          '0.00% (first 90 days)'],
        ['Starting Value',      '$5.00'],
      ],
      assetBreakout: [
        { pct: 100, label: 'ETFs' },
      ],
      afterWithholdingYield: 'TBD',
      constituents: [
        ['DYNFon', 'iShares U.S. Equity Factor Rotation Active ETF',    '22.00%'],
        ['COROon', 'iShares Intl Country Rotation Active ETF',          '18.00%'],
        ['BRTRon', 'iShares Total Return Active ETF',                   '17.00%'],
        ['INROon', 'iShares U.S. Industry Rotation Active ETF',         '12.00%'],
        ['BLCRon', 'iShares Large Cap Core Active ETF',                 '10.00%'],
        ['IALTon', 'iShares Systematic Alternatives Active ETF',        '10.00%'],
        ['BAIon',  'iShares A.I. Innovation and Tech Active ETF',        '8.00%'],
        ['IBITon', 'iShares Bitcoin Trust ETF',                          '3.00%'],
      ],
      calPerf: [
        ['2025',                   '—',   '17.72%'],
        ['2026 (As of 8/24/2026)', 'TBD', '12.55%'],
      ],
      annPerf: [
        ['1 Year',                 '—',   '19.72%'],
        ['2026 (As of 8/24/2026)', 'TBD', '12.55%'],
      ],
    },
    {
      ticker: 'BLKGRWon',
      name: 'Ondo (Built with BlackRock) High Growth Portfolio',
      category: 'ALLOCATION',
      benchmark: 'SPY',
      description: 'The Ondo (Built with BlackRock) High Growth Portfolio targets significant long-term capital appreciation through a BlackRock-modeled, equity-led allocation of roughly 95% equities and 5% Bitcoin. The portfolio offers exposure to active iShares equity strategies across U.S. and international markets alongside a Bitcoin allocation.',
      reasons: [
        { title: 'Built with BlackRock', body: 'A BlackRock-modeled allocation, rebalanced quarterly for a 0.49% fee.' },
        { title: 'Diversified equity exposure', body: 'Six iShares ETFs spanning U.S. and international equities, plus a Bitcoin allocation.' },
        { title: 'On-chain access', body: 'Tokenized on Ethereum and BNB with a $5.00 starting value.' },
      ],
      stats: [
        ['Model Provider',       'BlackRock'],
        ['Inception Date',       'TBD'],
        ['# of Constituents',   '6'],
        ['Rebalance',           'Quarterly'],
        ['Reconstitution',      'Fixed'],
        ['Distribution',        'Reinvested into constituents'],
        ['Yield*',              'TBD'],
        ['After Withholding**', 'TBD'],
        ['Supported Chains',    'Ethereum, BNB'],
        ['Service Fee',         '0.49%'],
        ['Fee Waiver',          '0.00% (first 90 days)'],
        ['Starting Value',      '$5.00'],
      ],
      assetBreakout: [
        { pct: 100, label: 'ETFs' },
      ],
      afterWithholdingYield: 'TBD',
      constituents: [
        ['DYNFon', 'iShares U.S. Equity Factor Rotation Active ETF',    '28.00%'],
        ['COROon', 'iShares Intl Country Rotation Active ETF',          '25.00%'],
        ['BLCRon', 'iShares Large Cap Core Active ETF',                 '16.00%'],
        ['INROon', 'iShares U.S. Industry Rotation Active ETF',         '16.00%'],
        ['BAIon',  'iShares A.I. Innovation and Tech Active ETF',       '10.00%'],
        ['IBITon', 'iShares Bitcoin Trust ETF',                          '5.00%'],
      ],
      calPerf: [
        ['2025',                   'TBD', '17.72%'],
        ['2026 (As of 8/24/2026)', 'TBD', '12.55%'],
      ],
      annPerf: [
        ['1 Year',                 'TBD', '19.72%'],
        ['2026 (As of 8/24/2026)', 'TBD', '12.55%'],
      ],
    },
  ];

  // ─── SLIDE POSITIONS (exact positions of the placeholder rectangles) ──────
  const positions = [
    { x: 4234, y: 8601  }, // 0 — MAG7Xon  detail
    { x: 4234, y: 9841  }, // 1 — MAG7Xon  perf
    { x: 4234, y: 11081 }, // 2 — BRAINon   detail
    { x: 4234, y: 12321 }, // 3 — BRAINon   perf
    { x: 4234, y: 13561 }, // 4 — BLKHIon   detail
    { x: 4234, y: 14801 }, // 5 — BLKHIon   perf
    { x: 4234, y: 16041 }, // 6 — YLD5on    detail
    { x: 4234, y: 17281 }, // 7 — YLD5on    perf
    { x: 4234, y: 18521 }, // 8 — YLD8on    detail
    { x: 4234, y: 19761 }, // 9 — YLD8on    perf
    { x: 4234, y: 21001 }, // 10 — BLKDIGon detail
    { x: 4234, y: 22241 }, // 11 — BLKDIGon perf
    { x: 4234, y: 23481 }, // 12 — BLKGRWon detail
    { x: 4234, y: 24721 }, // 13 — BLKGRWon perf
  ];

  // ─── LAYOUT CONSTANTS ────────────────────────────────────────────────────
  const W = 1920, H = 1080;
  const PL = 48;           // left/right padding
  const PT = 40;           // top padding
  const CW = W - PL * 2;  // content width = 1824

  // ─── DETAIL SLIDE ────────────────────────────────────────────────────────
  function buildDetail(p, pos) {
    const cs = catStyle(p.category);
    const slide = mkFrame(null, pos.x, pos.y, W, H, C.white, `${p.ticker} — Detail`);

    // ── HEADER ──────────────────────────────────────────────────────────────
    // Category pill
    const pillW = 160, pillH = 36;
    const pillBg = mkRect(slide, W - PL - pillW, PT + 2, pillW, pillH, cs.bg, 'category-pill');
    pillBg.cornerRadius = 18;
    mkText(slide, W - PL - pillW, PT + 10, pillW, p.category, 13, cs.tx, M, { align: 'CENTER' });

    // Ticker + name
    mkText(slide, PL, PT,      CW - pillW - 24, p.ticker, 44, C.black, B);
    mkText(slide, PL, PT + 52, CW,              p.name,   21, C.midGray, R);

    mkSep(slide, PL, PT + 82, CW);

    // ── DESCRIPTION ──────────────────────────────────────────────────────────
    mkText(slide, PL, PT + 92, CW, p.description, 16, C.darkGray, R, { lh: 25 });

    // ── REASONS TO CONSIDER ───────────────────────────────────────────────────
    const rsY = PT + 180;
    mkText(slide, PL, rsY, 300, 'REASONS TO CONSIDER', 10, C.midGray, M, { ls: 1.5 });

    const cardY  = rsY + 24;
    const cardW  = Math.floor((CW - 24) / 3);
    const cardH  = 184;

    p.reasons.forEach((r, i) => {
      const cx = PL + i * (cardW + 12);
      const bg = mkRect(slide, cx, cardY, cardW, cardH, C.lightGray, `reason-${i}`);
      bg.cornerRadius = 8;
      mkText(slide, cx + 20, cardY + 18, cardW - 40, r.title, 17, C.black, M, { lh: 24 });
      mkText(slide, cx + 20, cardY + 64, cardW - 40, r.body,  15, C.midGray, R, { lh: 22 });
    });

    // ── BOTTOM SECTION ────────────────────────────────────────────────────────
    const botY = cardY + cardH + 20;
    mkSep(slide, PL, botY, CW);
    const secY = botY + 14;

    // Column layout: | Key Stats 360px | gap 28 | Asset 316px | gap 28 | Constituents ~1092px |
    const statsW   = 360;
    const assetX   = PL + statsW + 28;
    const assetW   = 316;
    const constX   = assetX + assetW + 28;
    const constW   = CW - statsW - assetW - 56;  // ~1092px

    // ── KEY STATS ─────────────────────────────────────────────────────────────
    mkText(slide, PL, secY, statsW, 'Key Stats', 15, C.black, M);

    p.stats.forEach(([label, value], i) => {
      const ry = secY + 24 + i * 40;
      if (i % 2 === 0) {
        const rowBg = mkRect(slide, PL, ry, statsW, 39, C.lightGray);
        rowBg.cornerRadius = 4;
      }
      mkText(slide, PL + 8,   ry + 10, 158, label, 12, C.midGray, R);
      mkText(slide, PL + 170, ry + 10, statsW - 178, value, 13, C.navy, M);
    });

    // ── ASSET TYPE BREAKOUT ───────────────────────────────────────────────────
    mkText(slide, assetX, secY, assetW, 'Asset Type Breakout', 15, C.black, M);

    // Stacked horizontal bar (clipping frame for rounded corners)
    const barY = secY + 28;
    const barH = 44;
    const barFrame = mkFrame(slide, assetX, barY, assetW, barH, C.lightGray, 'bar');
    barFrame.cornerRadius = 6;

    let cursor = 0;
    p.assetBreakout.forEach((seg, i) => {
      const sw = Math.max(1, Math.round(assetW * seg.pct / 100));
      mkRect(barFrame, cursor, 0, sw, barH, BAR_PALETTE[i] || BAR_PALETTE[0]);
      cursor += sw;
    });

    // Legend
    p.assetBreakout.forEach((seg, i) => {
      const ly = barY + barH + 10 + i * 22;
      mkRect(slide, assetX, ly + 4, 12, 12, BAR_PALETTE[i] || BAR_PALETTE[0]);
      mkText(slide, assetX + 18, ly, assetW - 18, `${seg.pct}%  ${seg.label}`, 14, C.darkGray, R);
    });

    // After-Withholding callout box
    const legBottom = barY + barH + 10 + p.assetBreakout.length * 22 + 12;
    const callBg = mkRect(slide, assetX, legBottom, assetW, 68, C.lightBlue, 'yield-callout');
    callBg.cornerRadius = 8;
    mkText(slide, assetX + 14, legBottom + 8,  assetW - 28, 'After Withholding Yield**', 11, C.navy, R);
    mkText(slide, assetX + 14, legBottom + 26, assetW - 28, p.afterWithholdingYield,      24, C.navy, B);

    // ── CONSTITUENTS TABLE ─────────────────────────────────────────────────────
    mkText(slide, constX, secY, constW, 'Constituents (Base Weights)', 15, C.black, M);

    const chY = secY + 24;
    mkText(slide, constX + 4,           chY, 108, 'Ticker', 11, C.midGray, M);
    mkText(slide, constX + 118,         chY, constW - 208, 'Name', 11, C.midGray, M);
    mkText(slide, constX + constW - 84, chY, 84,  'Weight', 11, C.midGray, M, { align: 'RIGHT' });
    mkSep(slide, constX, chY + 17, constW);

    p.constituents.forEach(([tick, name, pct], i) => {
      const ry = chY + 20 + i * 34;
      if (i % 2 === 0) mkRect(slide, constX, ry, constW, 33, C.lightGray);
      mkText(slide, constX + 4,           ry + 8, 108, tick, 12, C.navy, M);
      mkText(slide, constX + 118,         ry + 8, constW - 208, name, 12, C.darkGray, R);
      mkText(slide, constX + constW - 84, ry + 8, 84, pct, 12, C.black, M, { align: 'RIGHT' });
    });

    // ── FOOTNOTES ──────────────────────────────────────────────────────────────
    mkText(slide, PL, H - 96, CW,
      '*Yield: The aggregate rate of dividends paid on the underlying constituents, calculated on 8/21/2026. Subject to change.\n**After Withholding Yield: is the dividend rate after Qualified Interest Income is withheld.',
      10, C.midGray, R, { lh: 15 });

    // ── FOOTER ────────────────────────────────────────────────────────────────
    mkSep(slide, PL, H - 50, CW);
    mkText(slide, PL,              H - 36, 200, 'Ondo Finance', 12, C.black, R);
    mkText(slide, W - PL - 300, H - 36, 300, 'Private and Confidential   2026', 12, C.black, R, { align: 'RIGHT' });
  }

  // ─── PERFORMANCE SLIDE ────────────────────────────────────────────────────
  function buildPerf(p, pos) {
    const cs = catStyle(p.category);
    const slide = mkFrame(null, pos.x, pos.y, W, H, C.white, `${p.ticker} — Performance`);

    // ── HEADER (identical to detail) ─────────────────────────────────────────
    const pillW = 160, pillH = 36;
    const pillBg = mkRect(slide, W - PL - pillW, PT + 2, pillW, pillH, cs.bg);
    pillBg.cornerRadius = 18;
    mkText(slide, W - PL - pillW, PT + 10, pillW, p.category, 13, cs.tx, M, { align: 'CENTER' });
    mkText(slide, PL, PT,      CW - pillW - 24, p.ticker, 44, C.black, B);
    mkText(slide, PL, PT + 52, CW,              p.name,   21, C.midGray, R);
    mkSep(slide, PL, PT + 82, CW);

    // ── CHART PLACEHOLDER ────────────────────────────────────────────────────
    mkText(slide, PL, PT + 96, 600, 'Growth of Hypothetical $10,000', 18, C.black, M);

    const chartY = PT + 126;
    const chartH = 446;
    const chartBg = mkRect(slide, PL, chartY, CW, chartH, C.navy, 'chart-area');
    chartBg.cornerRadius = 10;

    // Grid lines (decorative)
    [0.25, 0.5, 0.75].forEach(frac => {
      const lineY = chartY + Math.round(chartH * frac);
      const lineR = mkRect(slide, PL + 40, lineY, CW - 80, 1, C.white, 'grid-line');
      lineR.opacity = 0.12;
    });

    // Placeholder label
    mkText(slide, PL, chartY + chartH / 2 - 18, CW,
      'Performance chart — replace with backtested data visualization', 16, C.white, R, { align: 'CENTER' });

    // ── PERFORMANCE TABLES ────────────────────────────────────────────────────
    const tblY  = chartY + chartH + 24;
    const halfW = Math.floor((CW - 32) / 2);

    function drawTable(title, rows, x, w) {
      mkText(slide, x, tblY, w, title, 15, C.black, M);

      // Header row
      const hY = tblY + 26;
      const hBg = mkRect(slide, x, hY, w, 32, C.navy);
      hBg.cornerRadius = 6;
      const col1 = Math.floor(w * 0.48);
      const col2 = Math.floor(w * 0.26);
      const col3 = w - col1 - col2;
      mkText(slide, x + 8,        hY + 8, col1 - 8, 'Period',  12, C.white, M);
      mkText(slide, x + col1,     hY + 8, col2,     p.ticker,  12, C.white, M, { align: 'CENTER' });
      mkText(slide, x + col1 + col2, hY + 8, col3 - 8, p.benchmark, 12, C.white, M, { align: 'CENTER' });

      rows.forEach(([period, fund, bench], i) => {
        const ry = hY + 32 + i * 36;
        if (i % 2 === 0) mkRect(slide, x, ry, w, 35, C.lightGray);
        mkText(slide, x + 8,           ry + 10, col1 - 8, period, 13, C.darkGray, R);
        mkText(slide, x + col1,        ry + 10, col2,     fund,   13, C.black, M, { align: 'CENTER' });
        mkText(slide, x + col1 + col2, ry + 10, col3 - 8, bench,  13, C.midGray, R, { align: 'CENTER' });
      });
    }

    drawTable('Calendar Year Performance', p.calPerf, PL,              halfW);
    drawTable('Annualized Performance',    p.annPerf, PL + halfW + 32, halfW);

    // Footnote
    const fnY = tblY + 26 + 32 + p.calPerf.length * 36 + 12;
    mkText(slide, PL, fnY, CW, 'Performance data prior to inception date is backtested.', 11, C.midGray, R);

    // ── FOOTER ────────────────────────────────────────────────────────────────
    mkSep(slide, PL, H - 50, CW);
    mkText(slide, PL,            H - 36, 200, 'Ondo Finance', 12, C.black, R);
    mkText(slide, W - PL - 300, H - 36, 300, 'Private and Confidential   2026', 12, C.black, R, { align: 'RIGHT' });
  }

  // ─── CREATE ALL 14 SLIDES ─────────────────────────────────────────────────
  portfolios.forEach((p, i) => {
    buildDetail(p, positions[i * 2]);
    buildPerf(p,   positions[i * 2 + 1]);
  });

  figma.closePlugin(`✅ Created ${portfolios.length * 2} OIP slides on "${figma.currentPage.name}".`);
};

main().catch(err => figma.closePlugin(`❌ Error: ${err.message}`));
