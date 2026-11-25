/* FireArt — original, code-drawn artwork for the fire company template.
   Every drawing takes the site config, so the town name, station number and
   livery colors are lettered onto the rigs, the firehouse and the gear.
   Nothing here is a photo: swap in real photography through data/site.js. */
(function () {
  'use strict';

  var uid = 0;
  function id(p) { uid += 1; return p + uid; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function up(s) { return String(s || '').toUpperCase(); }

  var LETTER = "'Bitter','Rockwell','Georgia',serif";
  var BLOCK = "'Archivo Black','Arial Black',Impact,sans-serif";

  function lum(hex) { var n = parseInt(String(hex).slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }
  function liv(cfg) {
    var l = (cfg && cfg.livery) || {};
    var o = { body: l.body || '#C4161C', upper: l.upper || '#F5F3EC', stripe: l.stripe || '#E9B949', letter: l.letter || '#E9B949' };
    o.accent = (cfg && cfg.accent) || o.body;
    o.light = lum(o.body) > 0.72;
    o.onUpper = lum(o.upper) > 0.6 ? (o.light ? o.stripe : o.body) : o.letter;   // lettering on the upper band
    o.onBody2 = o.light ? o.letter : '#FFFFFF';                                    // second-line lettering on the body
    o.sign = lum(o.letter) < 0.5 ? '#F5F3EC' : o.letter;                           // lettering on dark signs and plates
    o.brass = '#E9B949';                                                           // uniform brass stays gold
    return o;
  }

  /* Painted lettering with a drop shade. Squeezes long names to fit `max`. */
  function letter(str, x, y, o) {
    o = o || {};
    var size = o.size || 14, ls = o.ls == null ? 0.06 : o.ls, anchor = o.anchor || 'middle';
    var fam = o.family || LETTER, weight = o.weight || 900;
    var ratio = o.ratio || (fam === BLOCK ? 0.74 : 0.69);
    var est = str.length * size * (ratio + ls);
    var fit = o.max && est > o.max ? ' textLength="' + o.max + '" lengthAdjust="spacingAndGlyphs"' : '';
    var base = ' x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" font-family="' + fam + '" font-weight="' + weight + '" font-size="' + size + '" letter-spacing="' + (ls * size).toFixed(2) + '"' + fit;
    var sh = o.shade === false ? '' : '<text' + base + ' fill="' + (o.shadeColor || '#1A0A07') + '" transform="translate(' + (o.dx || size * 0.07).toFixed(2) + ' ' + (o.dy || size * 0.07).toFixed(2) + ')" aria-hidden="true">' + esc(str) + '</text>';
    return sh + '<text' + base + ' fill="' + (o.fill || '#E9B949') + '">' + esc(str) + '</text>';
  }

  /* ---------------------------------------------------------------- emblem */
  /* Roundel crest: mill wheel, flame and crossed axes. Chosen with emblemStyle: "wheel". */
  function crest(cfg) {
    var L = liv(cfg), a = id('cr'), top = up(cfg.town), bottom = up(cfg.emblemBottom || 'Fire Department'), gold = '#E3B54A', cream = '#F8E9BD';
    var axe = '<rect x="-4.5" y="-106" width="9" height="212" rx="3" fill="#5A3A1E"/><path d="M4 -103 C24 -110 38 -98 42 -80 C32 -86 18 -86 4 -78 Z" fill="#DADDE2" stroke="#5d626b" stroke-width="1.5"/><path d="M-4 -100 L-15 -93 L-4 -84 Z" fill="#9AA0A9"/>';
    var spokes = ''; for (var i = 0; i < 8; i++) spokes += '<path transform="rotate(' + i * 45 + ')" d="M0 0 V-25" stroke="#6B3F1D" stroke-width="4"/>';
    return '<svg class="art art-emblem" viewBox="0 0 220 220" role="img" aria-label="' + esc(cfg.company) + ' crest">' +
      '<defs><path id="' + a + 't" d="M-65 0 A65 65 0 0 1 65 0"/><path id="' + a + 'b" d="M-78 0 A78 78 0 0 0 78 0"/><clipPath id="' + a + 'c"><circle r="52"/></clipPath></defs>' +
      '<g transform="translate(110 110)"><g transform="rotate(42)">' + axe + '</g><g transform="rotate(-42) scale(-1 1)">' + axe + '</g>' +
      '<circle r="93" fill="' + gold + '"/><circle r="89" fill="' + L.accent + '"/><circle r="56" fill="' + gold + '"/><circle r="52" fill="#F2EEE4"/>' +
      '<g clip-path="url(#' + a + 'c)"><path d="M-46 40 L-38 -26 L-10 -34 L-6 40 Z" fill="#A4A9B1"/><path d="M-60 34 H60 V60 H-60 Z" fill="#C9CDD3"/>' +
      '<path d="M26 34 C6 20 18 0 28 -12 C27 0 38 2 37 -20 C54 -4 56 20 42 34 Z" fill="#E2552B"/><path d="M30 34 C20 24 27 12 34 5 C34 14 43 17 39 34 Z" fill="#F7C544"/>' +
      '<g transform="translate(-4 6)"><circle r="26" fill="#F2EEE4" stroke="#6B3F1D" stroke-width="6"/>' + spokes + '<circle r="6" fill="#6B3F1D"/></g></g>' +
      '<text font-family="' + LETTER + '" font-weight="900" font-size="18" letter-spacing="1.8" fill="' + cream + '"><textPath href="#' + a + 't" startOffset="50%" text-anchor="middle"' + (top.length > 13 ? ' textLength="186" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(top) + '</textPath></text>' +
      '<text font-family="' + LETTER + '" font-weight="900" font-size="14.5" letter-spacing="1.3" fill="' + cream + '"><textPath href="#' + a + 'b" startOffset="50%" text-anchor="middle"' + (bottom.length > 16 ? ' textLength="220" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(bottom) + '</textPath></text>' +
      '</g></svg>';
  }

  function emblem(cfg, o) {
    o = o || {};
    if (cfg.emblemStyle === 'wheel') return crest(cfg);
    var L = liv(cfg), a = id('em');
    var arm = '<path d="M-15 -34 L-40 -90 Q0 -103 40 -90 L15 -34 Z"/>';
    var arms = [0, 90, 180, 270].map(function (r) { return '<g transform="rotate(' + r + ')">' + arm + '</g>'; }).join('');
    var top = up(cfg.town), bottom = up(cfg.emblemBottom || 'Fire Company');
    return '<svg class="art art-emblem" viewBox="0 0 220 220" role="img" aria-label="' + esc(cfg.company) + ' emblem">' +
      '<defs><path id="' + a + 't" d="M-56 0 A56 56 0 0 1 56 0"/><path id="' + a + 'b" d="M-67 0 A67 67 0 0 0 67 0"/></defs>' +
      '<g transform="translate(110 110)">' +
      '<g fill="' + L.letter + '" stroke="' + L.letter + '" stroke-width="9" stroke-linejoin="round">' + arms + '</g>' +
      '<g fill="' + L.body + '" stroke="' + L.body + '" stroke-width="2" stroke-linejoin="round">' + arms + '</g>' +
      '<circle r="74" fill="' + L.letter + '"/><circle r="70" fill="' + (o.core || '#0F1B33') + '"/>' +
      '<circle r="42" fill="none" stroke="' + L.sign + '" stroke-width="2"/>' +
      '<text font-family="' + LETTER + '" font-weight="900" font-size="15" letter-spacing="1.6" fill="' + L.sign + '"><textPath href="#' + a + 't" startOffset="50%" text-anchor="middle"' + (top.length > 13 ? ' textLength="164" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(top) + '</textPath></text>' +
      '<text font-family="' + LETTER + '" font-weight="900" font-size="12.5" letter-spacing="1.4" fill="' + L.sign + '"><textPath href="#' + a + 'b" startOffset="50%" text-anchor="middle"' + (bottom.length > 14 ? ' textLength="190" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(bottom) + '</textPath></text>' +
      '<text y="15" text-anchor="middle" font-family="' + BLOCK + '" font-size="' + (String(cfg.station).length > 2 ? 34 : 44) + '" fill="#fff">' + esc(cfg.station) + '</text>' +
      '</g></svg>';
  }

  /* ------------------------------------------------------------ rig parts */
  function wheel(cx, cy, r) {
    var lugs = '';
    for (var i = 0; i < 8; i++) { var t = i * Math.PI / 4; lugs += '<circle cx="' + (cx + Math.cos(t) * r * 0.36).toFixed(1) + '" cy="' + (cy + Math.sin(t) * r * 0.36).toFixed(1) + '" r="' + (r * 0.06).toFixed(1) + '" fill="#6d727b"/>'; }
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#15171b"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.84) + '" fill="none" stroke="#2b2e35" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.6) + '" fill="#cfd3d9"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.5) + '" fill="#9da3ac"/>' + lugs +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.2) + '" fill="#e8eaed"/>';
  }
  function well(cx, base, r) { return '<path d="M' + (cx - r) + ' ' + base + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + base + ' Z" fill="#15171b"/>'; }
  function slatDoor(x, y, w, h, pid) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.5" fill="url(#' + pid + ')" stroke="#3a3e46" stroke-width="1.6"/>' +
      '<rect x="' + (x + 4) + '" y="' + (y + h - 6) + '" width="' + (w - 8) + '" height="2.4" rx="1.2" fill="#4a4f58"/>';
  }
  function defsFor(L, p) {
    return '<defs>' +
      '<pattern id="' + p + 's" width="6" height="4.5" patternUnits="userSpaceOnUse"><rect width="6" height="4.5" fill="#bfc4cb"/><rect y="3.6" width="6" height="0.9" fill="#8e949d"/><rect width="6" height="0.8" fill="#dfe2e6"/></pattern>' +
      '<linearGradient id="' + p + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b5068"/><stop offset="1" stop-color="#16202e"/></linearGradient>' +
      '<linearGradient id="' + p + 'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f5f7"/><stop offset=".5" stop-color="#b9bec6"/><stop offset="1" stop-color="#7f858f"/></linearGradient>' +
      '<linearGradient id="' + p + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '</defs>';
  }
  /* Custom cab, nose at x0. Front axle sits under the front door. */
  function cab(x0, L, p, cfg, o) {
    o = o || {};
    var x = function (n) { return x0 + n; };
    var shape = 'M' + x(28) + ' 178 L' + x(28) + ' 120 L' + x(38) + ' 92 Q' + x(41) + ' 84 ' + x(50) + ' 84 L' + x(186) + ' 84 L' + x(186) + ' 178 Z';
    var c = id('cb');
    var s = '<clipPath id="' + c + '"><path d="' + shape + '"/></clipPath>';
    s += '<rect x="' + x(0) + '" y="160" width="30" height="18" rx="3" fill="url(#' + p + 'c)" stroke="#5d626b" stroke-width="1"/>';
    s += '<circle cx="' + x(13) + '" cy="169" r="5.5" fill="#eef0f2" stroke="#6d727b" stroke-width="1.2"/>';
    s += '<path d="' + shape + '" fill="' + L.body + '"/>';
    s += '<g clip-path="url(#' + c + ')"><rect x="' + x(20) + '" y="80" width="170" height="38" fill="' + L.upper + '"/></g>';
    s += '<path d="M' + x(31) + ' 116 L' + x(39.5) + ' 93 L' + x(50) + ' 93 L' + x(50) + ' 116 Z" fill="url(#' + p + 'g)"/>';
    s += '<rect x="' + x(57) + '" y="92" width="55" height="24" rx="2.5" fill="url(#' + p + 'g)"/><rect x="' + x(123) + '" y="92" width="55" height="24" rx="2.5" fill="url(#' + p + 'g)"/>';
    s += '<path d="M' + x(54) + ' 88 V178 M' + x(118) + ' 88 V178" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/>';
    s += '<rect x="' + x(104) + '" y="123" width="9" height="2.6" rx="1.3" fill="#e9ebee"/><rect x="' + x(170) + '" y="123" width="9" height="2.6" rx="1.3" fill="#e9ebee"/>';
    s += '<rect x="' + x(58) + '" y="75" width="52" height="9" rx="3" fill="#2a2d33"/><rect x="' + x(61) + '" y="76.5" width="14" height="6" rx="2" fill="#ff3b3b"/><rect x="' + x(77) + '" y="76.5" width="14" height="6" rx="2" fill="#f4f6f9"/><rect x="' + x(93) + '" y="76.5" width="14" height="6" rx="2" fill="#ff3b3b"/>';
    s += '<rect x="' + x(20) + '" y="100" width="9" height="16" rx="2" fill="#2a2d33"/>';
    return { svg: s, wheel: x(84), end: x(186) };
  }
  function stripe(pts, L) {
    return '<path d="' + pts + '" fill="' + L.stripe + '" stroke="#1a0a07" stroke-opacity=".55" stroke-width=".8" stroke-linejoin="round"/>';
  }
  function ground(cx, rx) { return '<ellipse cx="' + cx + '" cy="215" rx="' + rx + '" ry="7" fill="#000" opacity=".16"/>'; }

  var RIGS = {};

  RIGS.engine = function (cfg, L, p, unit) {
    var c = cab(96, L, p, cfg), s = ground(372, 290) + c.svg;
    // pump panel
    s += '<rect x="282" y="96" width="56" height="82" fill="#d2d6db" stroke="#5d626b" stroke-width="1"/>';
    s += '<rect x="282" y="96" width="56" height="17" fill="#22252b"/><path d="M286 101 H334 M286 105 H334 M286 109 H334" stroke="#e7c84a" stroke-width="2.2"/><path d="M286 103 H334" stroke="#c94a3b" stroke-width="1.2"/>';
    [[294, 124, 6], [310, 124, 6], [326, 124, 6], [294, 140, 4.5], [306, 140, 4.5], [318, 140, 4.5], [330, 140, 4.5]].forEach(function (g) { s += '<circle cx="' + g[0] + '" cy="' + g[1] + '" r="' + g[2] + '" fill="#f7f8f9" stroke="#3a3e46" stroke-width="1.3"/><path d="M' + g[0] + ' ' + g[1] + ' l' + (g[2] * 0.6) + ' ' + (-g[2] * 0.5) + '" stroke="#c0271f" stroke-width="1"/>'; });
    s += '<circle cx="298" cy="162" r="9" fill="url(#' + p + 'c)" stroke="#4a4f58" stroke-width="1.4"/><circle cx="322" cy="158" r="5" fill="' + L.body + '" stroke="#4a4f58"/><circle cx="322" cy="171" r="5" fill="' + L.body + '" stroke="#4a4f58"/>';
    // body
    s += '<rect x="338" y="96" width="290" height="82" fill="' + L.body + '"/>';
    s += '<rect x="338" y="90" width="290" height="6" fill="#22252b"/>';
    s += '<path d="M392 80 H622 M392 87 H622" stroke="#c9cdd3" stroke-width="2.2"/>'; for (var i = 0; i < 16; i++) s += '<path d="M' + (400 + i * 14.4) + ' 80 V87" stroke="#c9cdd3" stroke-width="1.6"/>';
    s += '<path d="M318 96 L326 78 L346 74 L348 80 L332 84 L330 96 Z" fill="url(#' + p + 'c)" stroke="#5d626b" stroke-width=".8"/>';
    s += slatDoor(344, 122, 78, 52, p + 's') + slatDoor(428, 122, 104, 28, p + 's') + slatDoor(538, 122, 84, 52, p + 's');
    s += well(478, 178, 34) + well(c.wheel, 178, 34);
    s += stripe('M124 126 L262 126 L276 150 L628 150 L628 157 L272 157 L258 133 L124 133 Z', L);
    s += '<rect x="628" y="164" width="12" height="14" fill="url(#' + p + 'c)"/><path d="M632 100 V164" stroke="#c9cdd3" stroke-width="2"/>';
    s += '<rect x="124" y="176" width="504" height="3" fill="#15171b"/>';
    s += letter(up(cfg.short || cfg.company), 483, 113, { size: 13, max: 272, fill: L.letter });
    s += letter(String(cfg.station), 247, 160, { size: 21, fill: L.letter, family: BLOCK, ls: 0.02 });
    s += letter(up(cfg.town), 181, 146, { size: 6.2, max: 56, fill: L.letter, ls: 0.04 });
    s += wheel(c.wheel, 188, 26) + wheel(478, 188, 26);
    return s;
  };

  RIGS.tower = function (cfg, L, p) {
    var c = cab(40, L, p, cfg), s = ground(360, 330) + c.svg;
    s += '<rect x="226" y="104" width="444" height="74" fill="' + L.body + '"/><rect x="226" y="98" width="444" height="6" fill="#22252b"/>';
    s += slatDoor(232, 128, 70, 46, p + 's') + slatDoor(308, 128, 70, 46, p + 's') + slatDoor(384, 128, 62, 46, p + 's') + slatDoor(452, 128, 150, 22, p + 's') + slatDoor(608, 128, 56, 46, p + 's');
    s += well(498, 178, 30) + well(556, 178, 30) + well(c.wheel, 178, 34);
    s += '<rect x="322" y="170" width="20" height="12" rx="2" fill="#2a2d33"/><rect x="316" y="182" width="32" height="5" rx="1" fill="#d9a400"/>';
    s += stripe('M68 126 L206 126 L220 152 L670 152 L670 159 L216 159 L202 133 L68 133 Z', L);
    // turntable and boom
    s += '<rect x="574" y="80" width="46" height="18" rx="2" fill="#2a2d33"/><circle cx="597" cy="80" r="11" fill="url(#' + p + 'c)" stroke="#4a4f58"/>';
    s += '<path d="M600 68 L96 50 L96 62 L600 86 Z" fill="#eceef1" stroke="#7f858f" stroke-width="1.2"/>';
    var z = 'M600 70'; for (var i = 0; i < 21; i++) { var bx = 600 - (i + 1) * 24, top = i % 2 === 0; z += ' L' + bx + ' ' + (top ? (86 - (i + 1) * 24 * 0.0476 + 0).toFixed(1) : (68 - (i + 1) * 24 * 0.0357).toFixed(1)); }
    s += '<path d="' + z + '" fill="none" stroke="#8a9099" stroke-width="1.3"/>';
    s += '<rect x="44" y="34" width="56" height="32" rx="3" fill="' + L.upper + '" stroke="#7f858f" stroke-width="1.2"/><rect x="44" y="50" width="56" height="8" fill="' + L.body + '"/><path d="M48 34 V24 H96 V34 M60 24 V34 M72 24 V34 M84 24 V34" fill="none" stroke="#7f858f" stroke-width="1.6"/><rect x="36" y="58" width="10" height="5" rx="2" fill="#4a4f58"/>';
    s += '<rect x="670" y="164" width="10" height="14" fill="url(#' + p + 'c)"/><rect x="68" y="176" width="602" height="3" fill="#15171b"/>';
    s += letter(up(cfg.short || cfg.company), 448, 121, { size: 12.5, max: 400, fill: L.letter });
    s += letter(String(cfg.station), 191, 162, { size: 21, fill: L.letter, family: BLOCK, ls: 0.02 });
    s += letter(up(cfg.town), 125, 146, { size: 6.2, max: 56, fill: L.letter, ls: 0.04 });
    s += wheel(c.wheel, 188, 26) + wheel(498, 188, 24) + wheel(556, 188, 24);
    return s;
  };

  RIGS.rescue = function (cfg, L, p) {
    var c = cab(96, L, p, cfg), s = ground(372, 290) + c.svg;
    s += '<rect x="282" y="78" width="352" height="100" fill="' + L.body + '"/><rect x="282" y="78" width="352" height="24" fill="' + L.upper + '"/>';
    s += '<rect x="300" y="68" width="60" height="10" rx="2" fill="#2a2d33"/><rect x="520" y="66" width="80" height="12" rx="2" fill="#c9cdd3" stroke="#7f858f"/><rect x="606" y="70" width="14" height="8" rx="2" fill="#ff3b3b"/>';
    s += slatDoor(290, 108, 70, 30, p + 's') + slatDoor(366, 108, 70, 30, p + 's') + slatDoor(442, 108, 112, 30, p + 's') + slatDoor(560, 108, 68, 30, p + 's');
    s += slatDoor(290, 144, 70, 30, p + 's') + slatDoor(366, 144, 70, 30, p + 's') + slatDoor(560, 144, 68, 30, p + 's');
    s += well(498, 178, 34) + well(c.wheel, 178, 34);
    s += stripe('M124 126 L262 126 L270 139 L634 139 L634 143 L268 143 L258 133 L124 133 Z', L);
    s += '<rect x="634" y="164" width="10" height="14" fill="url(#' + p + 'c)"/><rect x="124" y="176" width="510" height="3" fill="#15171b"/>';
    s += letter(up(cfg.short || cfg.company), 458, 96, { size: 14, max: 330, fill: L.onUpper, shadeColor: '#00000033' });
    s += letter(String(cfg.station), 247, 160, { size: 21, fill: L.letter, family: BLOCK, ls: 0.02 });
    s += letter(up(cfg.town), 181, 146, { size: 6.2, max: 56, fill: L.letter, ls: 0.04 });
    s += wheel(c.wheel, 188, 26) + wheel(498, 188, 26);
    return s;
  };

  RIGS.tanker = function (cfg, L, p) {
    var s = ground(372, 290);
    // conventional cab with a hood
    s += '<rect x="92" y="160" width="24" height="18" rx="3" fill="url(#' + p + 'c)" stroke="#5d626b"/>';
    s += '<path d="M108 178 L108 140 Q110 128 124 126 L196 118 L196 178 Z" fill="' + L.body + '"/>';
    s += '<rect x="104" y="134" width="8" height="36" rx="2" fill="url(#' + p + 'c)" stroke="#5d626b" stroke-width=".8"/>';
    s += '<path d="M196 178 L196 118 L214 88 Q217 84 224 84 L286 84 L286 178 Z" fill="' + L.body + '"/>';
    s += '<path d="M200 116 L215 92 L224 92 L224 116 Z" fill="url(#' + p + 'g)"/><rect x="230" y="92" width="48" height="24" rx="2.5" fill="url(#' + p + 'g)"/><path d="M227 88 V178" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/>';
    s += '<rect x="226" y="75" width="44" height="9" rx="3" fill="#2a2d33"/><rect x="229" y="76.5" width="12" height="6" rx="2" fill="#ff3b3b"/><rect x="243" y="76.5" width="12" height="6" rx="2" fill="#f4f6f9"/><rect x="257" y="76.5" width="10" height="6" rx="2" fill="#ff3b3b"/>';
    s += '<rect x="286" y="104" width="34" height="74" fill="#d2d6db" stroke="#5d626b"/><circle cx="303" cy="124" r="6" fill="#f7f8f9" stroke="#3a3e46" stroke-width="1.3"/><circle cx="303" cy="160" r="8" fill="url(#' + p + 'c)" stroke="#4a4f58" stroke-width="1.4"/>';
    s += '<rect x="320" y="92" width="312" height="80" rx="38" fill="' + L.body + '"/><rect x="320" y="92" width="312" height="80" rx="38" fill="url(#' + p + 'b)"/>';
    s += '<rect x="320" y="150" width="312" height="28" fill="#22252b"/><rect x="326" y="154" width="120" height="20" rx="1.5" fill="url(#' + p + 's)" stroke="#3a3e46" stroke-width="1.4"/>';
    s += '<rect x="440" y="86" width="60" height="8" rx="3" fill="#2a2d33"/><rect x="632" y="140" width="16" height="12" rx="2" fill="url(#' + p + 'c)" stroke="#5d626b"/><path d="M626 96 V150 M618 108 H632 M618 120 H632 M618 132 H632" stroke="#c9cdd3" stroke-width="2"/>';
    s += well(152, 178, 32) + well(516, 178, 30) + well(574, 178, 30);
    s += stripe('M112 142 L196 133 L286 133 L286 139 L196 139 L112 148 Z', L);
    s += '<rect x="108" y="176" width="524" height="3" fill="#15171b"/>';
    s += letter(up(cfg.town), 476, 127, { size: 22, max: 262, fill: L.letter, ls: 0.08 });
    s += letter(up('Fire Co.') + '  ' + up('Tanker') + ' ' + cfg.station, 476, 144, { size: 9, max: 230, fill: L.onBody2, shade: false, ls: 0.14, weight: 700 });
    s += letter(String(cfg.station), 256, 162, { size: 19, fill: L.letter, family: BLOCK, ls: 0.02 });
    s += wheel(152, 188, 26) + wheel(516, 188, 24) + wheel(574, 188, 24);
    return s;
  };

  RIGS.brush = function (cfg, L, p) {
    var s = ground(372, 210);
    s += '<rect x="184" y="158" width="22" height="16" rx="3" fill="#2a2d33"/><rect x="178" y="162" width="10" height="8" rx="2" fill="url(#' + p + 'c)"/>';
    s += '<path d="M200 176 L200 144 Q202 134 214 132 L282 126 L282 176 Z" fill="' + L.body + '"/>';
    s += '<path d="M282 176 L282 126 L302 96 Q305 92 312 92 L416 92 L416 176 Z" fill="' + L.body + '"/>';
    s += '<path d="M287 124 L303 100 L312 100 L312 124 Z" fill="url(#' + p + 'g)"/><rect x="318" y="100" width="42" height="24" rx="2.5" fill="url(#' + p + 'g)"/><rect x="366" y="100" width="42" height="24" rx="2.5" fill="url(#' + p + 'g)"/>';
    s += '<path d="M315 96 V176 M363 96 V176" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/>';
    s += '<rect x="322" y="83" width="50" height="9" rx="3" fill="#2a2d33"/><rect x="325" y="84.5" width="14" height="6" rx="2" fill="#ff3b3b"/><rect x="341" y="84.5" width="12" height="6" rx="2" fill="#f4f6f9"/><rect x="355" y="84.5" width="14" height="6" rx="2" fill="#ff3b3b"/>';
    s += '<rect x="416" y="132" width="146" height="44" fill="' + L.body + '"/><rect x="416" y="128" width="146" height="5" fill="#22252b"/>';
    s += '<rect x="424" y="98" width="70" height="30" rx="4" fill="#eceef1" stroke="#7f858f" stroke-width="1.2"/><path d="M436 98 V128 M482 98 V128" stroke="#b9bec6" stroke-width="1.2"/><rect x="448" y="92" width="22" height="6" rx="2" fill="#2a2d33"/>';
    s += '<circle cx="528" cy="110" r="17" fill="#2a2d33"/><circle cx="528" cy="110" r="13" fill="none" stroke="' + L.body + '" stroke-width="5"/><circle cx="528" cy="110" r="7" fill="none" stroke="#a4161a" stroke-width="3"/><circle cx="528" cy="110" r="3" fill="#c9cdd3"/>';
    s += well(244, 176, 31) + well(506, 176, 31);
    s += stripe('M204 146 L282 140 L562 140 L562 146 L282 146 L204 152 Z', L);
    s += '<rect x="200" y="174" width="362" height="3" fill="#15171b"/><rect x="562" y="160" width="10" height="12" fill="url(#' + p + 'c)"/>';
    s += letter(up(cfg.town), 365, 136.5, { size: 7.4, max: 92, fill: L.letter, ls: 0.05 });
    s += letter(up('Brush') + ' ' + cfg.station, 365, 165, { size: 12.5, max: 94, fill: L.letter });
    s += wheel(244, 189, 25) + wheel(506, 189, 25);
    return s;
  };

  function rig(type, cfg, o) {
    o = o || {};
    var L = liv(cfg), p = id('rg');
    var draw = RIGS[type] || RIGS.engine;
    return '<svg class="art art-rig art-rig--' + type + '" viewBox="0 0 720 230" role="img" aria-label="' + esc(o.label || (type + ' ' + cfg.station)) + ', side view, lettered ' + esc(cfg.town) + '">' + defsFor(L, p) + draw(cfg, L, p) + '</svg>';
  }

  /* Cab face, used inside the firehouse bays. Returns a <g>, 200 x 216. */
  function rigFront(cfg, o) {
    o = o || {};
    var L = liv(cfg), p = o.p, s = '<g class="rigfront">';
    if (o.bucket) s += '<rect x="26" y="-22" width="148" height="34" rx="4" fill="' + L.upper + '" stroke="#7f858f" stroke-width="1.5"/><rect x="26" y="-6" width="148" height="9" fill="' + L.body + '"/><path d="M34 -22 V-34 H166 V-22 M66 -34 V-22 M100 -34 V-22 M134 -34 V-22" fill="none" stroke="#9aa0a9" stroke-width="2"/>';
    s += '<rect x="28" y="184" width="34" height="26" rx="4" fill="#111318"/><rect x="138" y="184" width="34" height="26" rx="4" fill="#111318"/>';
    s += '<path d="M18 186 V40 Q18 22 36 22 H164 Q182 22 182 40 V186 Z" fill="' + L.body + '"/>';
    s += '<path d="M18 104 V40 Q18 22 36 22 H164 Q182 22 182 40 V104 Z" fill="' + L.upper + '"/>';
    s += '<rect x="26" y="34" width="148" height="9" rx="3" fill="#22252b"/>';
    s += '<path d="M28 48 H97 V96 H30 Q28 96 28 94 Z" fill="url(#' + p + 'g)"/><path d="M103 48 H172 V94 Q172 96 170 96 H103 Z" fill="url(#' + p + 'g)"/>';
    s += '<path d="M36 52 L60 52 L42 92 L30 92 Z" fill="#fff" opacity=".1"/>';
    s += '<rect x="2" y="60" width="12" height="30" rx="3" fill="#22252b"/><rect x="186" y="60" width="12" height="30" rx="3" fill="#22252b"/><path d="M14 74 H20 M180 74 H186" stroke="#22252b" stroke-width="3"/>';
    s += '<rect x="44" y="8" width="112" height="15" rx="5" fill="#22252b"/>';
    s += '<g class="beacon beacon--a"><rect x="48" y="10.5" width="30" height="10" rx="3" fill="#ff3b3b"/><rect x="122" y="10.5" width="30" height="10" rx="3" fill="#ff3b3b"/></g><rect class="beacon beacon--b" x="82" y="10.5" width="36" height="10" rx="3" fill="#f4f6f9"/>';
    s += '<rect x="70" y="112" width="60" height="50" rx="4" fill="url(#' + p + 'c)" stroke="#5d626b" stroke-width="1.2"/>';
    for (var i = 0; i < 6; i++) s += '<rect x="75" y="' + (118 + i * 7) + '" width="50" height="3" rx="1.5" fill="#3a3e46"/>';
    s += '<rect x="26" y="118" width="36" height="34" rx="5" fill="url(#' + p + 'c)" stroke="#5d626b"/><rect x="138" y="118" width="36" height="34" rx="5" fill="url(#' + p + 'c)" stroke="#5d626b"/>';
    s += '<g class="headlamp"><circle cx="38" cy="135" r="8" fill="#fff8dc"/><circle cx="54" cy="135" r="5.5" fill="#fff8dc"/><circle cx="162" cy="135" r="8" fill="#fff8dc"/><circle cx="146" cy="135" r="5.5" fill="#fff8dc"/></g>';
    s += '<g class="beacon beacon--b"><rect x="28" y="108" width="30" height="6" rx="2" fill="#ff3b3b"/><rect x="142" y="108" width="30" height="6" rx="2" fill="#ff3b3b"/></g>';
    s += '<rect x="8" y="164" width="184" height="24" rx="5" fill="url(#' + p + 'c)" stroke="#5d626b" stroke-width="1.2"/>';
    s += '<rect x="76" y="168" width="48" height="16" rx="2" fill="' + L.body + '"/>' + letter(o.label || ((o.code || 'E') + cfg.station), 100, 180.5, { size: 12, fill: L.letter, family: BLOCK, ls: 0.02, shade: false });
    s += letter(up(cfg.town), 100, 41.6, { size: 6.6, max: 132, fill: L.sign, shade: false, ls: 0.16 });
    return s + '</g>';
  }

  /* --------------------------------------------------------- firehouse */
  function station(cfg, o) {
    o = o || {};
    var L = liv(cfg), p = id('st'), s = '';
    var bays = [{ x: 395, code: 'T', bucket: true }, { x: 685, code: 'E' }, { x: 975, code: 'R' }];
    /* cfg.bays can relabel the three bays: [{ code: 'E', label: 'E51' }, ...] */
    if (cfg.bays) bays.forEach(function (b, i) { var o = cfg.bays[i] || {}; b.code = o.code || 'E'; b.bucket = !!o.bucket; b.label = o.label; });
    var sign = (cfg.signLines || ['Volunteers needed', 'Drill Tuesdays 7 PM']).slice(0, 2);
    s += '<svg class="art art-station" viewBox="0 120 1600 600" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Illustration of the ' + esc(cfg.company) + ' firehouse at dusk, bay doors open, three rigs inside">';
    s += '<defs>' +
      '<linearGradient id="' + p + 'sky" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="530"><stop offset="0" stop-color="#0B1428"/><stop offset=".45" stop-color="#16264A"/><stop offset=".72" stop-color="#34396A"/><stop offset=".9" stop-color="#8E5670"/><stop offset="1" stop-color="#E39A62"/></linearGradient>' +
      '<linearGradient id="' + p + 'bay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3A6"/><stop offset=".7" stop-color="#F3B866"/><stop offset="1" stop-color="#B8763A"/></linearGradient>' +
      '<linearGradient id="' + p + 'spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD58A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="' + p + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b6480"/><stop offset="1" stop-color="#1b2838"/></linearGradient>' +
      '<linearGradient id="' + p + 'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f5f7"/><stop offset=".5" stop-color="#b9bec6"/><stop offset="1" stop-color="#7f858f"/></linearGradient>' +
      '<pattern id="' + p + 'brick" width="36" height="18" patternUnits="userSpaceOnUse"><rect width="36" height="18" fill="#6A2A22"/><path d="M0 0 H36 M0 9 H36 M0 0 V9 M18 9 V18" stroke="#3E1813" stroke-width="1.4"/><rect x="1" y="1" width="16" height="7" fill="#7A332A" opacity=".5"/><rect x="19" y="10" width="16" height="7" fill="#5C231C" opacity=".6"/></pattern>' +
      '<radialGradient id="' + p + 'glow"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7B0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + p + 'red"><stop offset="0" stop-color="#ff4b4b" stop-opacity=".75"/><stop offset="1" stop-color="#ff4b4b" stop-opacity="0"/></radialGradient>';
    bays.forEach(function (b, i) { s += '<clipPath id="' + p + 'cl' + i + '"><rect x="' + b.x + '" y="356" width="230" height="244"/></clipPath>'; });
    s += '</defs>';
    s += '<rect x="-3000" y="-3000" width="7600" height="3620" fill="url(#' + p + 'sky)"/>';
    for (var k = 0; k < 90; k++) { var sx = -700 + (k * 397) % 3000, sy = -430 + (k * 211) % 800; s += '<circle class="star" cx="' + sx + '" cy="' + sy + '" r="' + (0.8 + (k % 4) * 0.25) + '" fill="#fff" opacity="' + (0.35 + (k % 5) * 0.12).toFixed(2) + '"/>'; }
    // far hills, water tower lettered with the town, tree line
    s += '<path d="M-1600 500 C-1100 462 -500 508 0 520 C200 470 360 500 560 480 C800 455 1000 500 1240 470 C1400 452 1520 480 1600 468 C2100 436 2600 504 3200 466 V620 H-1600 Z" fill="#141F3C"/>';
    s += '<g transform="translate(1392 372)"><path d="M-30 130 L-16 52 M30 130 L16 52 M0 130 V60 M-24 96 H24" stroke="#0F1830" stroke-width="5" fill="none"/><ellipse cx="0" cy="34" rx="58" ry="30" fill="#1D2B4F"/><rect x="-58" y="20" width="116" height="16" fill="#1D2B4F"/><ellipse cx="0" cy="20" rx="58" ry="16" fill="#27376262"/>' + letter(up(cfg.town), 0, 42, { size: 11, max: 98, fill: '#8FA0C8', shade: false, ls: 0.1, weight: 800 }) + '</g>';
    s += '<path d="M-1600 546 C-1300 516 -1000 552 -700 532 C-450 516 -200 548 0 560 C40 520 70 548 110 530 C150 500 190 540 230 524 C270 506 300 540 340 548 V620 H-1600 Z M1250 552 C1290 520 1330 544 1370 528 C1420 508 1460 540 1500 526 C1540 512 1570 536 1600 530 C1900 506 2300 550 2700 528 C2900 518 3100 540 3200 532 V620 H1250 Z" fill="#0C1528"/>';
    // side wing
    s += '<rect x="170" y="430" width="200" height="170" fill="url(#' + p + 'brick)"/><rect x="170" y="430" width="200" height="170" fill="#0B1428" opacity=".32"/><rect x="160" y="418" width="220" height="14" fill="#C9C2B4"/>';
    s += '<rect x="218" y="470" width="52" height="64" fill="#FFD98F"/><path d="M244 470 V534 M218 502 H270" stroke="#6A2A22" stroke-width="3"/><rect x="292" y="486" width="46" height="114" fill="#3A1712"/><rect x="298" y="492" width="34" height="46" fill="#FFD98F"/><circle cx="330" cy="548" r="3" fill="' + L.letter + '"/>';
    // main block
    s += '<rect x="350" y="250" width="900" height="350" fill="url(#' + p + 'brick)"/><rect x="350" y="250" width="900" height="350" fill="#0B1428" opacity=".28"/>';
    s += '<rect x="336" y="236" width="928" height="18" fill="#D8D1C2"/><rect x="350" y="254" width="900" height="6" fill="#00000040"/>';
    s += '<path d="M660 236 L800 176 L940 236 Z" fill="url(#' + p + 'brick)"/><path d="M660 236 L800 176 L940 236 Z" fill="#0B1428" opacity=".28"/><path d="M650 238 L800 168 L950 238 L934 238 L800 182 L666 238 Z" fill="#D8D1C2"/>';
    s += '<circle cx="800" cy="216" r="15" fill="#0F1B33" stroke="' + L.sign + '" stroke-width="2.5"/>' + letter(String(cfg.station), 800, 221.5, { size: 13, fill: '#fff', family: BLOCK, shade: false, ls: 0 });
    // sign frieze
    s += '<rect x="380" y="276" width="840" height="50" fill="#0F1B33"/><rect x="380" y="276" width="840" height="50" fill="none" stroke="' + L.sign + '" stroke-width="2"/>';
    s += letter(up(cfg.company), 800, 311, { size: 29, max: 800, fill: L.sign, ls: 0.1 });
    // bays
    bays.forEach(function (b, i) {
      s += '<rect x="' + (b.x - 10) + '" y="338" width="250" height="18" fill="#D8D1C2"/>';
      s += '<rect x="' + b.x + '" y="356" width="230" height="244" fill="url(#' + p + 'bay)"/>';
      s += '<rect x="' + b.x + '" y="356" width="230" height="60" fill="#8a5a2a" opacity=".35"/><path d="M' + b.x + ' 560 H' + (b.x + 230) + '" stroke="#8a5a2a" stroke-width="2" opacity=".6"/>';
      s += '<g clip-path="url(#' + p + 'cl' + i + ')"><g transform="translate(' + (b.x + 22) + ' 396) scale(.93)">' + rigFront(cfg, { p: p, code: b.code, bucket: b.bucket, label: b.label }) + '</g>';
      s += '<circle class="redglow" cx="' + (b.x + 115) + '" cy="412" r="92" fill="url(#' + p + 'red)"/>';
      // sectional door
      var d = '<g class="baydoor" style="--i:' + [1, 0, 2][i] + '"><rect x="' + b.x + '" y="356" width="230" height="244" fill="' + L.body + '"/>';
      for (var r = 0; r < 5; r++) for (var c = 0; c < 4; c++) d += '<rect x="' + (b.x + 9 + c * 54.5) + '" y="' + (364 + r * 47.5) + '" width="48" height="' + (r === 1 || r === 2 ? 40 : 40) + '" rx="2" fill="' + (r === 1 || r === 2 ? '#22355a' : L.body) + '" stroke="#00000055" stroke-width="1.5"/>';
      d += '<rect x="' + b.x + '" y="592" width="230" height="8" fill="#22252b"/></g>';
      s += d + '</g>';
      s += '<rect x="' + (b.x + 95) + '" y="341" width="40" height="13" rx="2" fill="#0F1B33"/>' + letter(b.label || (b.code + cfg.station), b.x + 115, 351.4, { size: 9.5, fill: L.sign, family: BLOCK, shade: false, ls: 0.02 });
    });
    [370, 648, 938, 1228].forEach(function (x) { s += '<circle cx="' + x + '" cy="420" r="46" fill="url(#' + p + 'glow)" opacity=".7"/><rect x="' + (x - 5) + '" y="410" width="10" height="16" rx="3" fill="#FFF1C8"/>'; });
    // flag pole and lawn sign
    s += '<path d="M1312 600 V300" stroke="#C9CDD3" stroke-width="5"/><circle cx="1312" cy="298" r="5" fill="' + L.letter + '"/>';
    s += '<g class="flag"><path d="M1315 306 C1345 298 1365 316 1398 308 V356 C1365 364 1345 346 1315 354 Z" fill="#B3272D"/><path d="M1315 313 C1345 305 1365 323 1398 315 M1315 327 C1345 319 1365 337 1398 329 M1315 341 C1345 333 1365 351 1398 343" stroke="#F4F1EA" stroke-width="5" fill="none"/><path d="M1315 306 C1330 302 1340 305 1350 308 V334 C1340 331 1330 328 1315 332 Z" fill="#1D2B4F"/></g>';
    s += '<g transform="translate(34 512)"><rect x="-4" y="76" width="8" height="34" fill="#3A1712"/><rect x="148" y="76" width="8" height="34" fill="#3A1712"/><rect x="-18" y="-8" width="188" height="92" rx="6" fill="#6A2A22"/><rect x="-18" y="-8" width="188" height="92" rx="6" fill="#0B1428" opacity=".25"/><rect x="-8" y="18" width="168" height="56" fill="#F6F2E6"/><path d="M-8 46 H160" stroke="#C9C2B4" stroke-width="1.5"/>' +
      letter(up(cfg.short || cfg.company), 76, 11, { size: 9.5, max: 170, fill: L.sign, shade: false, ls: 0.08 }) +
      letter(up(sign[0] || ''), 76, 38.5, { size: 12, max: 156, fill: '#14161B', shade: false, family: BLOCK, ls: 0.04 }) +
      letter(up(sign[1] || ''), 76, 66.5, { size: 12, max: 156, fill: '#14161B', shade: false, family: BLOCK, ls: 0.04 }) + '</g>';
    // apron
    s += '<rect x="-3000" y="600" width="7600" height="140" fill="#2B3040"/><path d="M350 600 H1250 L1420 720 H180 Z" fill="#3A4052"/>';
    bays.forEach(function (b) { s += '<path class="spill" d="M' + b.x + ' 600 H' + (b.x + 230) + ' L' + (b.x + 300) + ' 720 H' + (b.x - 70) + ' Z" fill="url(#' + p + 'spill)"/>'; });
    s += '<path d="M655 600 L630 720 M945 600 L970 720" stroke="#E8C24A" stroke-width="4" opacity=".75"/><rect x="-3000" y="600" width="7600" height="4" fill="#00000040"/>';
    return s + '</svg>';
  }

  /* --------------------------------------------------------- portraits */
  var SKIN = ['#F3CDAE', '#E6B58F', '#CF9668', '#AE744C', '#855536', '#5E3B26'];
  var HAIR = { black: '#1F1B1A', brown: '#4A2F20', blond: '#B98C4D', gray: '#9B9C9E', white: '#E4E2DD', red: '#8E3D1E' };
  function shadeOf(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r * f); g = Math.round(g * f); b = Math.round(b * f);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function portrait(person, cfg) {
    var L = liv(cfg), q = person.look || {}, p = id('pt');
    var skin = SKIN[q.skin == null ? 1 : q.skin], sk2 = shadeOf(skin, 0.86), hair = HAIR[q.hair] || HAIR.brown;
    var uni = q.uniform || 'classA', cap = q.cap, s = '';
    var bg = q.bg === 'red' ? L.body : (q.bg === 'light' ? '#FFFFFF' : '#16264A');
    s += '<svg class="art art-portrait" viewBox="0 0 300 340" role="img" aria-label="Illustrated portrait of ' + esc(person.name) + '">';
    s += '<defs><clipPath id="' + p + 'f"><rect width="300" height="340"/></clipPath><clipPath id="' + p + 'h"><path d="M105 142 C105 92 195 92 195 142 C195 180 179 213 150 216 C121 213 105 180 105 142 Z"/></clipPath></defs>';
    s += '<g clip-path="url(#' + p + 'f)"><rect width="300" height="340" fill="' + bg + '"/>';
    s += '<g opacity=".1" transform="translate(150 150) scale(1.5)" fill="#fff">' + [0, 90, 180, 270].map(function (r) { return '<path transform="rotate(' + r + ')" d="M-15 -34 L-40 -90 Q0 -103 40 -90 L15 -34 Z"/>'; }).join('') + '<circle r="46"/></g>';
    if (q.style === 'long') s += '<path d="M96 150 C88 74 212 74 204 150 C208 196 214 236 222 262 L78 262 C86 236 92 196 96 150 Z" fill="' + hair + '"/>';
    if (q.style === 'bob') s += '<path d="M96 150 C88 76 212 76 204 150 C206 178 208 202 204 220 L96 220 C92 202 94 178 96 150 Z" fill="' + hair + '"/>';
    if (q.style === 'bun') s += '<circle cx="150" cy="84" r="22" fill="' + hair + '"/>';
    if (q.style === 'fringe') s += '<ellipse cx="150" cy="150" rx="52" ry="30" fill="' + hair + '"/>';
    // shoulders
    var coat = uni === 'classA' ? '#1B2440' : (uni === 'polo' ? L.accent : (uni === 'white' ? '#F4F4F0' : '#1F2A44'));
    s += '<path d="M14 340 C18 276 62 250 112 238 L150 268 L188 238 C238 250 282 276 286 340 Z" fill="' + coat + '"/>';
    s += '<path d="M126 196 H174 L178 246 L150 270 L122 246 Z" fill="' + sk2 + '"/>';
    if (uni === 'classA' || uni === 'white') {
      var shirt = q.shirt || '#FFFFFF';
      s += '<path d="M112 238 L150 292 L188 238 L176 226 L150 252 L124 226 Z" fill="' + shirt + '"/><path d="M124 226 L150 252 L136 266 L112 238 Z M176 226 L150 252 L164 266 L188 238 Z" fill="' + shadeOf(shirt === '#FFFFFF' ? '#F1F1EE' : shirt, 0.93) + '"/>';
      s += '<path d="M143 252 H157 L161 300 L150 314 L139 300 Z" fill="#111521"/><path d="M143 252 H157 L154 262 H146 Z" fill="#000"/>';
      s += '<path d="M112 238 L92 254 L134 326 L150 292 Z M188 238 L208 254 L166 326 L150 292 Z" fill="' + shadeOf(coat, uni === 'white' ? 0.9 : 0.78) + '"/>';
      s += '<circle cx="104" cy="264" r="5" fill="' + L.brass + '"/><circle cx="196" cy="264" r="5" fill="' + L.brass + '"/>';
      s += '<path d="M206 292 h22 l-2 16 q-9 10 -9 10 q0 0 -9 -10 Z" fill="' + L.brass + '"/><circle cx="217" cy="303" r="4" fill="' + shadeOf('#E9B949', 0.7) + '"/>';
      s += '<rect x="66" y="298" width="34" height="9" rx="1.5" fill="' + L.brass + '"/>';
    } else {
      s += '<path d="M118 240 L150 276 L182 240 L172 228 L150 250 L128 228 Z" fill="' + shadeOf(coat, 0.8) + '"/><path d="M150 250 V300" stroke="' + shadeOf(coat, 0.7) + '" stroke-width="2"/><circle cx="150" cy="268" r="2" fill="#fff" opacity=".7"/><circle cx="150" cy="284" r="2" fill="#fff" opacity=".7"/>';
      s += '<g transform="translate(206 296) scale(.1)">' + [0, 90, 180, 270].map(function (r) { return '<path transform="rotate(' + r + ')" d="M-15 -34 L-40 -90 Q0 -103 40 -90 L15 -34 Z" fill="' + (uni === 'polo' ? '#fff' : L.brass) + '"/>'; }).join('') + '<circle r="50" fill="' + (uni === 'polo' ? '#fff' : L.brass) + '"/></g>';
    }
    // head
    s += '<ellipse cx="104" cy="154" rx="8" ry="13" fill="' + sk2 + '"/><ellipse cx="196" cy="154" rx="8" ry="13" fill="' + sk2 + '"/>';
    s += '<path d="M105 142 C105 92 195 92 195 142 C195 180 179 213 150 216 C121 213 105 180 105 142 Z" fill="' + skin + '"/>';
    s += '<g clip-path="url(#' + p + 'h)"><path d="M150 90 H200 V220 H150 Z" fill="#000" opacity=".06"/>';
    if (q.beard) s += '<path d="M106 160 C112 176 118 182 128 180 C140 174 160 174 172 180 C182 182 188 176 194 160 C196 196 178 218 150 218 C122 218 104 196 106 160 Z" fill="' + hair + '"/>';
    s += '</g>';
    s += '<ellipse cx="150" cy="222" rx="24" ry="7" fill="#000" opacity=".14"/>';
    // features
    s += '<ellipse cx="132" cy="152" rx="3.6" ry="4.2" fill="#1D1D22"/><ellipse cx="168" cy="152" rx="3.6" ry="4.2" fill="#1D1D22"/>';
    var brow = q.hair === 'white' || q.hair === 'gray' ? '#8C8D90' : shadeOf(hair, 0.9);
    s += '<path d="M122 140 Q132 134 141 139 M159 139 Q168 134 178 140" stroke="' + brow + '" stroke-width="3.6" stroke-linecap="round" fill="none"/>';
    s += '<path d="M150 154 L146 173 Q150 177 155 174" stroke="#000" stroke-opacity=".22" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    s += q.beard ? '<path d="M139 191 Q150 197 161 191" stroke="' + shadeOf(skin, 0.6) + '" stroke-width="3" stroke-linecap="round" fill="none"/>' : '<path d="M137 190 Q150 199 163 190" stroke="#8A4238" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
    if (q.mustache) s += '<path d="M130 184 Q140 172 150 178 Q160 172 170 184 Q160 181 150 185 Q140 181 130 184 Z" fill="' + hair + '"/>';
    if (q.glasses) s += '<g fill="none" stroke="#22252B" stroke-width="3"><rect x="118" y="142" width="27" height="21" rx="7"/><rect x="155" y="142" width="27" height="21" rx="7"/><path d="M145 150 H155 M118 150 L106 147 M182 150 L194 147"/></g>';
    // hair on top
    if (!cap) {
      if (q.style === 'crop') s += '<path d="M103 146 C96 86 204 86 197 146 C192 124 178 113 150 113 C122 113 108 124 103 146 Z" fill="' + hair + '"/>';
      else if (q.style === 'part') s += '<path d="M103 146 C94 84 206 82 197 146 C194 126 188 116 176 110 C160 122 132 124 116 116 C108 124 105 134 103 146 Z" fill="' + hair + '"/>';
      else if (q.style === 'curly') { s += '<g fill="' + hair + '">'; [[112, 118, 17], [128, 102, 18], [150, 96, 19], [172, 102, 18], [188, 118, 17], [104, 136, 12], [196, 136, 12], [140, 112, 14], [162, 112, 14]].forEach(function (c) { s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; }); s += '</g>'; }
      else if (q.style === 'long' || q.style === 'bob' || q.style === 'bun') s += '<path d="M103 150 C94 84 206 84 197 150 C194 128 184 112 160 108 C150 120 124 128 108 126 C105 134 104 142 103 150 Z" fill="' + hair + '"/>';
    } else {
      var crown = cap === 'white' ? '#F6F5F0' : '#1B2440';
      if (q.style !== 'fringe' && q.style !== 'bald') s += '<path d="M103 150 C101 138 102 130 104 124 H112 C111 134 111 142 110 150 Z M197 150 C199 138 198 130 196 124 H188 C189 134 189 142 190 150 Z" fill="' + hair + '"/>';
      s += '<path d="M90 114 C88 62 212 62 210 114 L206 126 H94 Z" fill="' + crown + '"/><path d="M150 66 C186 66 208 84 210 114 L206 126 H150 Z" fill="#000" opacity=".06"/>';
      s += '<rect x="95" y="112" width="110" height="15" fill="#10162B"/><path d="M95 119.5 H205" stroke="' + L.brass + '" stroke-width="2.4"/>';
      s += '<path d="M96 126 Q150 148 204 126 Q150 136 96 126 Z" fill="#0B0E18"/><path d="M96 126 Q150 136 204 126" stroke="' + L.brass + '" stroke-width="1.6" fill="none"/>';
      s += '<g transform="translate(150 96) scale(.15)">' + [0, 90, 180, 270].map(function (r) { return '<path transform="rotate(' + r + ')" d="M-15 -34 L-40 -90 Q0 -103 40 -90 L15 -34 Z" fill="' + L.brass + '"/>'; }).join('') + '<circle r="52" fill="' + L.brass + '"/><circle r="36" fill="' + L.body + '"/></g>';
    }
    return s + '</g></svg>';
  }

  /* ------------------------------------------------- turnout coat (back) */
  /* A shaded drawing, not a photo, so the town name, the crest and the typed
     surname stay live. cfg.coatShell sets the outer-shell colour. */
  function mix(a, b, t) {
    var x = parseInt(String(a).slice(1), 16), y = parseInt(String(b).slice(1), 16), o = '#';
    [16, 8, 0].forEach(function (s) { var v = Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t); o += (v < 16 ? '0' : '') + v.toString(16); });
    return o;
  }
  var COAT_NAME_FIT = 150;
  function coatLabel(cfg, name) { return 'Turnout coat with the ' + cfg.company + ' crest on the back and ' + name + ' on the tail'; }

  function coat(cfg, name) {
    var L = liv(cfg), p = id('ct'), u = function (k) { return 'url(#' + p + k + ')'; };
    var shell = cfg.coatShell || '#B8975A';
    var hi = mix(shell, '#FFF1CC', 0.34), lo = mix(shell, '#22160A', 0.34), deep = mix(shell, '#140C04', 0.58);
    var lime = '#DCE548', limeLo = '#B4BE2C', hide = '#26272B', W = 500, H = 496;
    var BODY = 'M198 84 C176 88 142 98 118 112 C120 140 122 170 124 198 C122 280 116 360 112 420 Q250 440 388 420 C384 360 378 280 376 198 C378 170 380 140 382 112 C358 98 324 88 302 84 C268 75 232 75 198 84 Z';
    var SLEEVE = 'M150 96 C128 100 108 108 96 128 C84 150 78 190 70 240 C62 300 52 350 44 400 L100 408 C106 356 116 300 124 250 C128 226 130 210 132 196 Z';
    var COLLAR = 'M196 89 C192 73 196 60 208 56 C234 47 266 47 292 56 C304 60 308 73 304 89 C268 79 232 79 196 89 Z';
    var MIRROR = 'translate(' + W + ' 0) scale(-1 1)';
    var blur = function (k, d) { return '<filter id="' + p + k + '" filterUnits="userSpaceOnUse" x="-20" y="-20" width="' + (W + 40) + '" height="' + (H + 40) + '"><feGaussianBlur stdDeviation="' + d + '"/></filter>'; };
    var stitch = function (d, c, o) { return '<path d="' + d + '" fill="none" stroke="' + (c || deep) + '" stroke-width=".8" stroke-dasharray="2.8 1.9" opacity="' + (o || 0.6) + '"/>'; };

    /* Reflective triple trim on the body: a band that sags with the cloth. */
    var edge = function (yy, sag) { return 'M96 ' + yy + ' Q250 ' + (yy + 2 * sag) + ' 404 ' + yy; };
    var box = function (a, b, sag) { return edge(a, sag) + ' L404 ' + b + ' Q250 ' + (b + 2 * sag) + ' 96 ' + b + ' Z'; };
    var BANDS = [[214, 3.5], [380, 10]], SBANDS = [[100, 222], [79, 356]];
    function band(y, sag) {
      var h = 24;
      return '<path d="' + edge(y + h + 2.5, sag) + '" fill="none" stroke="#120B03" stroke-opacity=".5" stroke-width="5" filter="' + u('b2') + '"/>' +
        '<path d="' + box(y, y + h, sag) + '" fill="' + u('lime') + '"/>' +
        '<path d="' + box(y + 7.6, y + 16.4, sag) + '" fill="' + u('silver') + '"/>' +
        '<path d="' + box(y, y + h, sag) + '" fill="' + u('prism') + '"/>' +
        '<path d="' + edge(y + 0.6, sag) + '" fill="none" stroke="#F6FB9A" stroke-opacity=".7" stroke-width="1"/>' +
        stitch(edge(y + 2.4, sag), '#6C7418', 0.75) + stitch(edge(y + h - 2.4, sag), '#6C7418', 0.75);
    }
    /* The same trim on a sleeve, square to the sleeve. */
    function sband(cx, cy) {
      var h = 22, x = cx - 62, y = cy - h / 2, w = 124;
      return '<g transform="rotate(7.8 ' + cx + ' ' + cy + ')">' +
        '<rect x="' + x + '" y="' + (y + h - 1) + '" width="' + w + '" height="5" fill="#120B03" opacity=".5" filter="' + u('b2') + '"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + u('lime') + '"/>' +
        '<rect x="' + x + '" y="' + (y + 7) + '" width="' + w + '" height="8" fill="' + u('silverS') + '"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + u('prism') + '"/>' +
        stitch('M' + x + ' ' + (y + 2.2) + ' H' + (x + w), '#6C7418', 0.75) + stitch('M' + x + ' ' + (y + h - 2.2) + ' H' + (x + w), '#6C7418', 0.75) + '</g>';
    }
    function sleeve() {
      return '<path d="M48 398 L98 405 L96 420 L50 412 Z" fill="#141518"/><path d="M57 401 l-1 12 M66 402 l-1 13 M75 403 l-1 13 M84 404 l-1 14 M92 405 l-1 14" stroke="#34363C" stroke-width="1.2"/>' +
        '<path d="' + SLEEVE + '" fill="' + u('sl') + '"/>' +
        '<g clip-path="' + u('cs') + '">' +
        '<g transform="rotate(7.8 89 296)"><rect x="70" y="266" width="40" height="60" rx="13" fill="#120B03" opacity=".45" filter="' + u('b2') + '"/><rect x="70" y="264" width="40" height="60" rx="13" fill="' + hide + '"/><rect x="73.5" y="267.5" width="33" height="53" rx="10" fill="none" stroke="#5B5D64" stroke-width=".8" stroke-dasharray="2.6 1.8"/><rect x="76" y="270" width="12" height="46" rx="6" fill="#fff" opacity=".05"/></g>' +
        SBANDS.map(function (b) { return sband(b[0], b[1]); }).join('') +
        '<g transform="rotate(7.8 72 404)"><rect x="10" y="388" width="126" height="22" fill="' + hide + '"/><path d="M10 388 H136" stroke="#5B5D64" stroke-width=".8" stroke-dasharray="2.6 1.8" transform="translate(0 3)"/></g>' +
        /* folds, the cast shadow of the body, and the roll of the cloth */
        '<g filter="' + u('b5') + '" fill="none" stroke-linecap="round">' +
        '<path d="' + SLEEVE + '" stroke="#120B03" stroke-opacity=".5" stroke-width="13"/>' +
        '<path d="M124 108 C126 150 128 180 130 204 C128 250 122 310 116 350" stroke="#120B03" stroke-opacity=".55" stroke-width="20"/>' +
        '<path d="M58 258 C78 270 98 268 124 254" stroke="#120B03" stroke-opacity=".42" stroke-width="6"/><path d="M60 270 C80 281 100 279 122 266" stroke="#FFF1CC" stroke-opacity=".3" stroke-width="5"/>' +
        '<path d="M52 322 C72 336 94 334 114 322" stroke="#120B03" stroke-opacity=".4" stroke-width="6"/><path d="M52 334 C72 347 92 345 112 334" stroke="#FFF1CC" stroke-opacity=".26" stroke-width="5"/>' +
        '<path d="M48 376 C66 386 86 386 104 380" stroke="#120B03" stroke-opacity=".4" stroke-width="5"/>' +
        '<path d="M112 116 C98 138 92 168 88 204" stroke="#FFF1CC" stroke-opacity=".32" stroke-width="12"/>' +
        '</g></g>' +
        '<path d="' + SLEEVE + '" fill="none" stroke="' + deep + '" stroke-opacity=".7" stroke-width="1"/>';
    }

    var town = up(cfg.coatTown || cfg.town), line = up(cfg.coatLine || 'Fire Co.'), nm = up(name);
    var fit = function (str, size, max, ratio) { return str.length * size * ratio > max ? ' textLength="' + max + '" lengthAdjust="spacingAndGlyphs"' : ''; };
    var sewn = function (str, y, size, max, ls) {
      var a = ' x="250" y="' + y + '" text-anchor="middle" font-family="' + BLOCK + '" font-size="' + size + '" letter-spacing="' + ls + '"' + fit(str, size, max, 0.8);
      return '<text' + a + ' fill="#150D04" opacity=".6" transform="translate(1.1 1.7)" filter="' + u('b1') + '">' + esc(str) + '</text>' +
        '<text' + a + ' fill="' + u('lime') + '" stroke="#565C12" stroke-width="1.5" paint-order="stroke" stroke-linejoin="round">' + esc(str) + '</text>';
    };
    var mark = emblem(cfg).replace(/^<svg[^>]*>/, '<svg x="194" y="259" width="112" height="112" viewBox="0 0 220 220" aria-hidden="true">');

    var s = '<svg class="art art-coat" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(coatLabel(cfg, name)) + '">';
    s += '<defs>' +
      '<linearGradient id="' + p + 'bd" gradientUnits="userSpaceOnUse" x1="108" y1="0" x2="392" y2="0"><stop offset="0" stop-color="' + lo + '"/><stop offset=".14" stop-color="' + shell + '"/><stop offset=".4" stop-color="' + hi + '"/><stop offset=".62" stop-color="' + shell + '"/><stop offset=".88" stop-color="' + mix(shell, lo, 0.5) + '"/><stop offset="1" stop-color="' + deep + '"/></linearGradient>' +
      '<linearGradient id="' + p + 'sl" gradientUnits="userSpaceOnUse" x1="50" y1="296" x2="124" y2="306"><stop offset="0" stop-color="' + lo + '"/><stop offset=".3" stop-color="' + mix(shell, hi, 0.6) + '"/><stop offset=".6" stop-color="' + shell + '"/><stop offset="1" stop-color="' + deep + '"/></linearGradient>' +
      '<linearGradient id="' + p + 'cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + hi + '"/><stop offset=".5" stop-color="' + shell + '"/><stop offset="1" stop-color="' + lo + '"/></linearGradient>' +
      '<linearGradient id="' + p + 'lime" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDF465"/><stop offset=".55" stop-color="' + lime + '"/><stop offset="1" stop-color="' + limeLo + '"/></linearGradient>' +
      '<linearGradient id="' + p + 'silver" gradientUnits="userSpaceOnUse" x1="100" y1="0" x2="400" y2="0"><stop offset="0" stop-color="#B9BEC5"/><stop offset=".2" stop-color="#FFFFFF"/><stop offset=".36" stop-color="#CFD4DA"/><stop offset=".6" stop-color="#F8F9FA"/><stop offset=".82" stop-color="#B4BAC1"/><stop offset="1" stop-color="#8E949C"/></linearGradient>' +
      '<linearGradient id="' + p + 'silverS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#AEB4BB"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#D3D8DD"/><stop offset="1" stop-color="#979DA5"/></linearGradient>' +
      '<linearGradient id="' + p + 'steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9CED5"/><stop offset=".45" stop-color="#8A9099"/><stop offset="1" stop-color="#4C5159"/></linearGradient>' +
      '<linearGradient id="' + p + 'light" gradientUnits="userSpaceOnUse" x1="90" y1="50" x2="420" y2="470"><stop offset="0" stop-color="#FFF6DC" stop-opacity=".2"/><stop offset=".45" stop-color="#FFF6DC" stop-opacity="0"/><stop offset="1" stop-color="#0A0602" stop-opacity=".3"/></linearGradient>' +
      '<linearGradient id="' + p + 'glint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset=".7" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<pattern id="' + p + 'prism" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 .4H3" stroke="#fff" stroke-width=".6" opacity=".3"/><path d="M.4 0V3" stroke="#58600E" stroke-width=".5" opacity=".2"/></pattern>' +
      '<pattern id="' + p + 'weave" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(34)"><rect width="2.6" height=".9" fill="#1E1305" opacity=".2"/><rect width=".9" height="2.6" fill="#FFF1CC" opacity=".12"/></pattern>' +
      '<pattern id="' + p + 'thread" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><rect width="2" height=".8" fill="#fff" opacity=".1"/></pattern>' +
      '<filter id="' + p + 'grain" filterUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .08  0 0 0 0 .05  0 0 0 0 .02  .7 .7 .7 0 -.72"/></filter>' +
      '<filter id="' + p + 'wear" filterUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".014 .034" numOctaves="3" seed="23"/><feColorMatrix type="matrix" values="0 0 0 0 .08  0 0 0 0 .05  0 0 0 0 .02  1.7 0 0 0 -.62"/></filter>' +
      blur('b1', 1) + blur('b2', 1.8) + blur('b5', 5) + blur('b8', 8) +
      '<clipPath id="' + p + 'cb"><path d="' + BODY + '"/></clipPath><clipPath id="' + p + 'cs"><path d="' + SLEEVE + '"/></clipPath>' +
      '<clipPath id="' + p + 'all"><path d="' + BODY + '"/><path d="' + SLEEVE + '"/><path d="' + SLEEVE + '" transform="' + MIRROR + '"/><path d="' + COLLAR + '"/></clipPath>' +
      '<clipPath id="' + p + 'tb">' + BANDS.map(function (b) { return '<path d="' + box(b[0], b[0] + 24, b[1]) + '"/>'; }).join('') + '</clipPath>' +
      '<clipPath id="' + p + 'ts">' + SBANDS.map(function (b) { return '<rect x="' + (b[0] - 62) + '" y="' + (b[1] - 11) + '" width="124" height="22" transform="rotate(7.8 ' + b[0] + ' ' + b[1] + ')"/>'; }).join('') + '</clipPath>' +
      '<clipPath id="' + p + 'tail"><rect x="158" y="408" width="184" height="74" rx="4"/></clipPath>' +
      '</defs>';

    /* gear rail, station plate and hook */
    s += '<rect x="54" y="13" width="392" height="9" rx="4.5" fill="' + u('steel') + '"/><rect x="54" y="13.6" width="392" height="1.6" rx=".8" fill="#fff" opacity=".45"/>';
    s += '<path d="M250 20 V46" fill="none" stroke="#3E434B" stroke-width="5.6" stroke-linecap="round"/><path d="M250 20 V46" fill="none" stroke="#A9AFB8" stroke-width="3" stroke-linecap="round"/>';
    s += '<rect x="226" y="3" width="48" height="20" rx="3" fill="#0B1428" stroke="' + L.brass + '" stroke-width="1.2"/>' + letter(String(cfg.station), 250, 18, { size: 13, fill: L.sign, family: BLOCK, shade: false, ls: 0 });

    /* name panel hanging from the tail */
    s += '<rect x="160" y="412" width="184" height="72" rx="4" fill="#0A0602" opacity=".45" filter="' + u('b5') + '"/>';
    s += '<rect x="158" y="408" width="184" height="74" rx="4" fill="#17181C"/><g clip-path="' + u('tail') + '"><rect x="158" y="408" width="184" height="74" fill="' + u('weave') + '" opacity=".7"/><path d="M112 424 Q250 444 388 424" fill="none" stroke="#000" stroke-opacity=".8" stroke-width="16" filter="' + u('b5') + '"/></g>';
    s += '<rect x="164.5" y="439.5" width="171" height="36" rx="2.5" fill="none" stroke="' + lime + '" stroke-width="1.5" stroke-dasharray="4.4 2.4"/>';
    s += '<text class="coat-name" x="250" y="466.5" text-anchor="middle" font-family="' + BLOCK + '" font-size="23" letter-spacing="1.6" fill="' + u('lime') + '"' + fit(nm, 23, COAT_NAME_FIT, 0.74) + '>' + esc(nm) + '</text>';

    /* sleeves, then the back panel over them */
    s += '<g>' + sleeve() + '</g><g transform="' + MIRROR + '">' + sleeve() + '</g>';
    s += '<path d="' + BODY + '" fill="' + u('bd') + '"/>';
    s += '<g clip-path="' + u('cb') + '">';
    /* seams: shoulder yoke and the two action pleats */
    s += '<path d="M118 128 Q250 150 382 128" fill="none" stroke="#120B03" stroke-opacity=".5" stroke-width="5" filter="' + u('b2') + '" transform="translate(0 2)"/><path d="M118 128 Q250 150 382 128" fill="none" stroke="' + deep + '" stroke-opacity=".75" stroke-width="1"/>' + stitch('M119 131.5 Q250 153.5 381 131.5') + stitch('M119 124.6 Q250 146.6 381 124.6', hi, 0.5);
    s += '<path d="M143 133 C139 160 141 185 141 213" fill="none" stroke="' + deep + '" stroke-opacity=".6" stroke-width="1"/><path d="M357 133 C361 160 359 185 359 213" fill="none" stroke="' + deep + '" stroke-opacity=".6" stroke-width="1"/>' + stitch('M146 134 C142 160 144 185 144 213') + stitch('M354 134 C358 160 356 185 356 213');
    /* drag rescue device flap under the collar */
    s += '<rect x="221" y="96" width="58" height="21" rx="2.5" fill="#120B03" opacity=".5" filter="' + u('b2') + '"/><rect x="221" y="94" width="58" height="21" rx="2.5" fill="' + mix(shell, lo, 0.35) + '" stroke="' + deep + '" stroke-opacity=".7" stroke-width=".8"/><rect x="223.6" y="96.6" width="52.8" height="15.8" rx="1.5" fill="none" stroke="' + deep + '" stroke-width=".7" stroke-dasharray="2.4 1.7" opacity=".7"/><rect x="243" y="111" width="14" height="9" rx="1.5" fill="' + lime + '"/><text x="250" y="108.4" text-anchor="middle" font-family="' + BLOCK + '" font-size="7.5" letter-spacing=".8" fill="' + deep + '" opacity=".85">DRD</text>';
    /* department lettering, sewn on */
    s += sewn(town, 181, 29, 196, 1) + sewn(line, 201.5, 13.5, 150, 2.2);
    s += BANDS.map(function (b) { return band(b[0], b[1]); }).join('');
    /* the department crest, as a twill patch */
    s += '<circle cx="250" cy="318" r="63" fill="#0A0602" opacity=".6" filter="' + u('b2') + '"/><circle cx="250" cy="315" r="62" fill="#17181C"/><circle cx="250" cy="315" r="59" fill="none" stroke="#D2A237" stroke-width="5"/><circle cx="250" cy="315" r="59" fill="none" stroke="#7E5C12" stroke-width="5" stroke-dasharray="1.1 2.1" opacity=".6"/>' + mark + '<circle cx="250" cy="315" r="56.5" fill="' + u('thread') + '"/><circle cx="250" cy="315" r="56.5" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="3" filter="' + u('b1') + '"/>';
    /* folds and the roll of the cloth, over everything sewn to it */
    s += '<g fill="none" stroke-linecap="round">' +
      '<path d="' + BODY + '" stroke="#120B03" stroke-opacity=".5" stroke-width="20" filter="' + u('b8') + '"/>' +
      '<g filter="' + u('b5') + '"><path d="M166 150 C158 232 172 312 156 418" stroke="#120B03" stroke-opacity=".34" stroke-width="12"/><path d="M336 150 C344 232 328 312 346 418" stroke="#120B03" stroke-opacity=".38" stroke-width="13"/>' +
      '<path d="M124 204 C152 216 168 244 160 286" stroke="#120B03" stroke-opacity=".3" stroke-width="10"/><path d="M376 204 C348 216 332 244 340 286" stroke="#120B03" stroke-opacity=".32" stroke-width="10"/>' +
      '<path d="M192 146 C186 230 196 322 188 414" stroke="#FFF1CC" stroke-opacity=".26" stroke-width="12"/><path d="M308 150 C314 232 304 322 314 412" stroke="#FFF1CC" stroke-opacity=".14" stroke-width="10"/>' +
      '<path d="M196 96 C230 106 270 106 304 96" stroke="#120B03" stroke-opacity=".55" stroke-width="9"/></g></g>';
    s += '</g>';
    s += '<path d="' + BODY + '" fill="none" stroke="' + deep + '" stroke-opacity=".75" stroke-width="1"/>';

    /* collar and hanging loop */
    s += '<path d="' + COLLAR + '" fill="' + u('cl') + '" stroke="' + deep + '" stroke-opacity=".75" stroke-width="1"/>' + stitch('M200 82 C232 72.5 268 72.5 300 82') + stitch('M199 74 C203 62 208 60.5 214 58.6 C238 51.6 262 51.6 286 58.6 C292 60.5 297 62 301 74') +
      '<path d="M209 56.6 C234 48 266 48 291 56.6" fill="none" stroke="#FFF6DC" stroke-opacity=".55" stroke-width="1.2"/>';
    s += '<path d="M241 59 V50 a9 9 0 0 1 18 0 V59" fill="none" stroke="#141518" stroke-width="4.6"/><path d="M241 59 V50 a9 9 0 0 1 18 0 V59" fill="none" stroke="#44474E" stroke-width="1" stroke-dasharray="2 1.6"/>';

    /* cloth: weave, grain and wear over the whole shell, then the light */
    s += '<g clip-path="' + u('all') + '"><rect width="' + W + '" height="' + H + '" fill="' + u('weave') + '" opacity=".55"/><rect width="' + W + '" height="' + H + '" filter="' + u('grain') + '" opacity=".5"/><rect width="' + W + '" height="' + H + '" filter="' + u('wear') + '" opacity=".3"/><rect width="' + W + '" height="' + H + '" fill="' + u('light') + '"/></g>';

    /* A slow glint across the reflective trim. It sits in its own layer above the
       coat, so the moving light never makes the browser redraw the cloth. */
    var glint = '<g transform="skewX(-16)"><rect class="coat-glint" x="-150" y="0" width="96" height="' + H + '" fill="' + u('glint') + '"/></g>';
    var fx = '<svg class="art-coat-fx" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false"><g clip-path="' + u('cb') + '"><g clip-path="' + u('tb') + '">' + glint + '</g></g>' +
      '<g clip-path="' + u('cs') + '"><g clip-path="' + u('ts') + '">' + glint + '</g></g>' +
      '<g transform="' + MIRROR + '"><g clip-path="' + u('cs') + '"><g clip-path="' + u('ts') + '"><g transform="' + MIRROR + '">' + glint + '</g></g></g></g></svg>';
    return '<div class="coat-fig">' + s + '</svg>' + fx + '</div>';
  }

  /* Change only the lettering on the tail, so typing a name does not redraw the coat. */
  function coatName(root, cfg, name) {
    var svg = root && root.querySelector('.art-coat'), t = up(name);
    if (!svg) return false;
    Array.prototype.forEach.call(svg.querySelectorAll('.coat-name'), function (el) {
      el.textContent = t;
      if (t.length * 23 * 0.74 > COAT_NAME_FIT) { el.setAttribute('textLength', COAT_NAME_FIT); el.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
      else { el.removeAttribute('textLength'); el.removeAttribute('lengthAdjust'); }
    });
    svg.setAttribute('aria-label', coatLabel(cfg, name));
    return true;
  }

  /* --------------------------------------------- helmet front piece */
  function shield(cfg, label, color) {
    var L = liv(cfg), p = id('sh'), c = color || L.body, light = color === '#F4F4F0' || color === '#E9B949';
    var mark = String(cfg.shieldMark || cfg.station);
    var ink = light ? '#14161B' : '#fff';
    return '<svg class="art art-shield" viewBox="0 0 120 150" aria-hidden="true">' +
      '<defs><path id="' + p + '" d="M22 44 Q60 22 98 44"/></defs>' +
      '<path d="M60 5 C94 5 113 22 113 22 L105 96 C101 124 77 139 60 146 C43 139 19 124 15 96 L7 22 C7 22 26 5 60 5 Z" fill="' + c + '" stroke="#14161B" stroke-width="3"/>' +
      '<path d="M60 13 C88 13 104 26 104 26 L97 95 C93 117 74 130 60 137 C46 130 27 117 23 95 L16 26 C16 26 32 13 60 13 Z" fill="none" stroke="' + ink + '" stroke-opacity=".55" stroke-width="1.4" stroke-dasharray="3 3"/>' +
      '<text font-family="' + LETTER + '" font-weight="900" font-size="9.5" letter-spacing="1" fill="' + ink + '"><textPath href="#' + p + '" startOffset="50%" text-anchor="middle"' + (cfg.town.length > 10 ? ' textLength="76" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(up(cfg.town)) + '</textPath></text>' +
      '<text x="60" y="' + (mark.length > 3 ? 88 : 92) + '" text-anchor="middle" font-family="' + BLOCK + '" font-size="' + (mark.length > 3 ? 22 : (mark.length > 2 ? 30 : 40)) + '" fill="' + ink + '">' + esc(mark) + '</text>' +
      '<text x="60" y="116" text-anchor="middle" font-family="' + LETTER + '" font-weight="900" font-size="10" letter-spacing="1.2" fill="' + ink + '"' + (label.length > 8 ? ' textLength="62" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(up(label)) + '</text></svg>';
  }

  /* ------------------------------------------------ district map */
  function map(cfg) {
    var L = liv(cfg), st = cfg.mapStreets || ['Foundry Rd', 'Quarry St', 'Route 9', 'Mill Race'];
    var lab = function (t, x, y, r) { return '<text x="' + x + '" y="' + y + '"' + (r ? ' transform="rotate(' + r + ' ' + x + ' ' + y + ')"' : '') + ' font-family="\'Source Sans 3\',system-ui,sans-serif" font-weight="600" font-size="13" fill="#5E6672">' + esc(t) + '</text>'; };
    return '<svg class="art art-map" viewBox="0 0 640 440" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map sketch showing the station on ' + esc(st[0]) + '">' +
      '<rect width="640" height="440" fill="#E4E8E6"/>' +
      '<path d="M-10 330 C120 300 180 380 300 350 C420 320 470 400 650 360 V450 H-10 Z" fill="#BFD4E4"/>' +
      '<path d="M420 40 h150 v120 h-150 Z" fill="#CFE0C4"/><path d="M30 30 h120 v80 h-120 Z" fill="#CFE0C4"/>' +
      '<g stroke="#fff" stroke-linecap="round" fill="none"><path d="M-10 210 H650" stroke-width="22"/><path d="M250 -10 V330" stroke-width="16"/><path d="M-10 90 L650 150" stroke-width="12"/><path d="M470 -10 L400 340" stroke-width="10"/><path d="M90 -10 V320" stroke-width="8"/><path d="M-10 280 H400" stroke-width="8"/><path d="M560 150 V350" stroke-width="8"/></g>' +
      '<path d="M-10 210 H650" stroke="#E8C24A" stroke-width="2" stroke-dasharray="14 12"/>' +
      lab(st[2], 500, 204) + lab(st[0], 264, 60, 90) + lab(st[1], 30, 84, 5) + lab(st[3], 470, 396, -6) + lab(cfg.parkName || 'Mill Race Park', 440, 104) +
      '<g transform="translate(250 210)"><circle r="38" fill="' + L.accent + '" opacity=".16"/><circle r="22" fill="' + L.accent + '" stroke="#fff" stroke-width="4"/>' +
      '<text y="' + (String(cfg.mapPin || cfg.station).length > 1 ? 5.5 : 7) + '" text-anchor="middle" font-family="' + BLOCK + '" font-size="' + (String(cfg.mapPin || cfg.station).length > 1 ? 14 : 18) + '" fill="#fff">' + esc(cfg.mapPin || cfg.station) + '</text></g></svg>';
  }

  /* --------------------------------------------------------- icons */
  var IC = {
    zoomin: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.6-4.6M11 8v6M8 11h6"/>',
    zoomout: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.6-4.6M8 11h6"/>',
    phone: '<path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"/>',
    alarm: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>',
    burn: '<path d="M4 20h16M7 20l10-7M17 20 7 13"/><path d="M12 3c2 3 4 4 4 7a4 4 0 0 1-8 0c0-1.500 1-2.500 2-3 0 1.500 1 2 1 2 0-2 0-4 1-6Z"/>',
    hall: '<path d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6"/>',
    report: '<path d="M7 3h8l4 4v14H7Z"/><path d="M15 3v4h4M10 12h6M10 16h6"/>',
    hydrant: '<path d="M8 21V10a4 4 0 0 1 8 0v11M6 21h12M7 10h10M5 14h3M16 14h3M10 6V4h4v2"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l2 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    heart: '<path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10Z"/>',
    pin: '<path d="M12 21s-6-5.500-6-11a6 6 0 0 1 12 0c0 5.500-6 11-6 11Z"/><circle cx="12" cy="10" r="2.200"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    play: '<path d="M8 5v14l11-7Z" fill="currentColor"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    out: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    co: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M11 10a2.500 2.500 0 1 0 0 4M17 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>',
    door: '<path d="M6 21V3h12v18M4 21h16M14 12h.01"/>',
    ladder: '<path d="M8 3v18M16 3v18M8 7h8M8 11h8M8 15h8M8 19h8"/>',
    tune: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'
  };
  function icon(name) { return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[name] || IC.check) + '</svg>'; }

  window.FireArt = { emblem: emblem, rig: rig, station: station, portrait: portrait, coat: coat, coatName: coatName, shield: shield, map: map, icon: icon, esc: esc };
})();
