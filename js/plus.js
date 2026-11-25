/* FirePlus — the sections and tools that sit on top of the basic site.

   feed        posts from the department's social pages
   year        the year added up, and what the volunteer hours are worth
   neighbors   members and their day jobs
   lake        ice and water safety, a status sign, live weather alerts
   santa       a map that follows the engine on Santa night
   give        monthly giving and a scan-to-give code on the fund drive
   signs       reflective house-number signs, with a live preview
   apply       the "tell us you're interested" form
   report      the monthly report each partner business gets
   calendar    "Add to calendar" on events
   tour        a guided tour of all of the above, for showing the site to a department

   Every block is switched on by its entry in data/site.js. Leave the entry out and the block
   does not appear. js/site.js decides where each one goes on the page. */
(function () {
  'use strict';
  var A = window.FireArt, esc = A.esc, I = A.icon;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var S = null, root = null, io = null, beat = 0;
  var WARN = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4.6M12 17.4v.2"/></svg>';

  function still() { return reduce.matches || document.documentElement.classList.contains('is-still'); }
  function num(n) { return Number(n).toLocaleString('en-US'); }
  function money(n) { return '$' + num(Math.round(n)); }
  function pageUrl(hash) { return window.location.href.split(/[?#]/)[0] + (hash || ''); }
  function initials(name) { var p = String(name).trim().split(/\s+/); return ((p[0] || '').charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : '')).toUpperCase(); }
  function head(id, title, text) { return '<div class="head"><h2 id="' + id + '">' + esc(title) + '</h2>' + (text ? '<p class="lede">' + esc(text) + '</p>' : '') + '</div>'; }

  /* ---------- QR codes: made in the browser, so they always point at wherever the site is hosted ---------- */
  function qrMatrix(text) {
    var bytes = [], i, j, k, v;
    var utf = unescape(encodeURIComponent(String(text)));
    for (i = 0; i < utf.length; i++) bytes.push(utf.charCodeAt(i));
    /* error-correction level M, versions 1 to 10: [check bytes per block, [blocks, data bytes each, ...]] */
    var V = [null, [10, [1, 16]], [16, [1, 28]], [26, [1, 44]], [18, [2, 32]], [24, [2, 43]], [16, [4, 27]], [18, [4, 31]], [22, [2, 38, 2, 39]], [22, [3, 36, 2, 37]], [26, [4, 43, 1, 44]]];
    var ver, blocks, total;
    for (ver = 1; ver <= 10; ver++) {
      blocks = [];
      for (i = 0; i < V[ver][1].length; i += 2) for (j = 0; j < V[ver][1][i]; j++) blocks.push(V[ver][1][i + 1]);
      total = blocks.reduce(function (a, b) { return a + b; }, 0);
      if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= total * 8) break;
    }
    if (ver > 10) return null;
    var ecLen = V[ver][0], bits = [];
    function put(val, len) { for (var q = len - 1; q >= 0; q--) bits.push((val >>> q) & 1); }
    put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(function (b) { put(b, 8); });
    put(0, Math.min(4, total * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    var data = [];
    for (i = 0; i < bits.length; i += 8) { v = 0; for (j = 0; j < 8; j++) v = (v << 1) | bits[i + j]; data.push(v); }
    for (var pad = 0xEC; data.length < total; pad ^= 0xEC ^ 0x11) data.push(pad);

    /* Reed-Solomon check bytes over GF(256) */
    function mul(x, y) { var z = 0; for (var q = 7; q >= 0; q--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> q) & 1) * x; } return z; }
    var div = [], rootv = 1;
    for (i = 0; i < ecLen - 1; i++) div.push(0);
    div.push(1);
    for (i = 0; i < ecLen; i++) { for (j = 0; j < div.length; j++) { div[j] = mul(div[j], rootv); if (j + 1 < div.length) div[j] ^= div[j + 1]; } rootv = mul(rootv, 2); }
    function rem(d) { var r = div.map(function () { return 0; }); d.forEach(function (b) { var f = b ^ r.shift(); r.push(0); div.forEach(function (c, q) { r[q] ^= mul(c, f); }); }); return r; }
    var dB = [], eB = [], off = 0, out = [];
    blocks.forEach(function (len) { var d = data.slice(off, off + len); off += len; dB.push(d); eB.push(rem(d)); });
    for (i = 0; i < Math.max.apply(null, blocks); i++) dB.forEach(function (d) { if (i < d.length) out.push(d[i]); });
    for (i = 0; i < ecLen; i++) eB.forEach(function (e) { out.push(e[i]); });

    var n = ver * 4 + 17, m = [], fn = [];
    for (i = 0; i < n; i++) { m.push([]); fn.push([]); for (j = 0; j < n; j++) { m[i].push(false); fn[i].push(false); } }
    function set(x, y, dark) { m[y][x] = !!dark; fn[y][x] = true; }
    for (i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    function finder(cx, cy) { for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy; if (x >= 0 && x < n && y >= 0 && y < n) set(x, y, d !== 2 && d !== 4); } }
    finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
    var last = n - 7, pos = ver === 1 ? [] : (ver < 7 ? [6, last] : [6, (6 + last) / 2, last]);
    pos.forEach(function (py, a) { pos.forEach(function (px, b) {
      if ((a === 0 && b === 0) || (a === 0 && b === pos.length - 1) || (a === pos.length - 1 && b === 0)) return;
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) set(px + dx, py + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }); });
    function format(mask) {
      var r = mask, q;
      for (q = 0; q < 10; q++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      var b = ((mask << 10) | r) ^ 0x5412;
      function g(p) { return ((b >>> p) & 1) === 1; }
      for (q = 0; q <= 5; q++) set(8, q, g(q));
      set(8, 7, g(6)); set(8, 8, g(7)); set(7, 8, g(8));
      for (q = 9; q < 15; q++) set(14 - q, 8, g(q));
      for (q = 0; q < 8; q++) set(n - 1 - q, 8, g(q));
      for (q = 8; q < 15; q++) set(8, n - 15 + q, g(q));
      set(8, n - 8, true);
    }
    if (ver >= 7) {
      var vr = ver;
      for (k = 0; k < 12; k++) vr = (vr << 1) ^ ((vr >>> 11) * 0x1F25);
      var vb = (ver << 12) | vr;
      for (k = 0; k < 18; k++) { var bit = ((vb >>> k) & 1) === 1, a = n - 11 + k % 3, b = Math.floor(k / 3); set(a, b, bit); set(b, a, bit); }
    }
    format(0);
    var idx = 0, nbits = out.length * 8;
    for (var right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < n; vert++) for (j = 0; j < 2; j++) {
        var x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
        if (!fn[y][x] && idx < nbits) { m[y][x] = ((out[idx >>> 3] >>> (7 - (idx & 7))) & 1) === 1; idx++; }
      }
    }
    var MASK = [
      function (x, y) { return (x + y) % 2 === 0; }, function (x, y) { return y % 2 === 0; }, function (x) { return x % 3 === 0; }, function (x, y) { return (x + y) % 3 === 0; },
      function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; }, function (x, y) { return x * y % 2 + x * y % 3 === 0; },
      function (x, y) { return (x * y % 2 + x * y % 3) % 2 === 0; }, function (x, y) { return ((x + y) % 2 + x * y % 3) % 2 === 0; }];
    function flip(q) { for (var yy = 0; yy < n; yy++) for (var xx = 0; xx < n; xx++) if (!fn[yy][xx] && MASK[q](xx, yy)) m[yy][xx] = !m[yy][xx]; }
    function penalty() {
      var p = 0, dark = 0, xx, yy, run, c;
      for (yy = 0; yy < n; yy++) {
        for (c = 0; c < 2; c++) {           /* long runs of one color, along rows then columns */
          run = 1;
          for (xx = 1; xx < n; xx++) {
            var cur = c ? m[xx][yy] : m[yy][xx], prev = c ? m[xx - 1][yy] : m[yy][xx - 1];
            if (cur === prev) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1;
          }
        }
        for (xx = 0; xx < n; xx++) {
          if (m[yy][xx]) dark++;
          if (xx < n - 1 && yy < n - 1 && m[yy][xx] === m[yy][xx + 1] && m[yy][xx] === m[yy + 1][xx] && m[yy][xx] === m[yy + 1][xx + 1]) p += 3;
        }
      }
      return p + Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
    }
    var best = 0, bestP = Infinity;
    for (k = 0; k < 8; k++) { flip(k); format(k); var pp = penalty(); if (pp < bestP) { bestP = pp; best = k; } flip(k); }
    flip(best); format(best);
    return m;
  }
  function qr(text) {
    var m = qrMatrix(text); if (!m) return '';
    var n = m.length, q = 4, d = '', x, y;
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) if (m[y][x]) d += 'M' + (x + q) + ' ' + (y + q) + 'h1v1h-1z';
    return '<svg viewBox="0 0 ' + (n + q * 2) + ' ' + (n + q * 2) + '" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#14161B"/></svg>';
  }

  /* ---------- posts from the department's social pages ---------- */
  function feed(s) {
    var f = s.feed; if (!f || !f.items || !f.items.length) return '';
    return '<section class="band band--concrete" id="feed" aria-labelledby="feed-h"><div class="wrap">' + head('feed-h', f.title, f.text) + '<ul class="feed">' +
      f.items.map(function (x) {
        return '<li class="post">' + (x.photo ? '<img src="' + esc(x.photo) + '" alt="' + esc(x.alt || '') + '" loading="lazy"' + (x.pos ? ' style="object-position:' + esc(x.pos) + '"' : '') + '>' : '') +
          '<div class="post-body"><p class="post-meta"><span class="plate">' + esc(x.from) + '</span><time>' + esc(x.when) + '</time></p><p>' + esc(x.text) + '</p></div></li>';
      }).join('') + '</ul>' + (f.more ? '<p class="feed-more"><a class="link" href="' + esc(f.more.href) + '">' + esc(f.more.label) + '</a></p>' : '') + '</div></section>';
  }

  /* ---------- the year, added up ---------- */
  function year(s) {
    var y = s.year; if (!y) return '';
    var w = y.worth, worth = w ? w.hours * w.rate : 0;
    return '<section class="band band--concrete" id="year" aria-labelledby="year-h"><div class="wrap">' + head('year-h', y.title, y.text) + '<ul class="stats">' +
      y.stats.map(function (x) { return '<li><b' + (typeof x.n === 'number' ? ' data-count="' + x.n + '"' : '') + '>' + (typeof x.n === 'number' ? num(x.n) : esc(x.n)) + '</b><span>' + esc(x.label) + '</span></li>'; }).join('') + '</ul>' +
      (w ? '<p class="worth"><b data-count="' + worth + '" data-money>' + money(worth) + '</b><span>' + esc(w.text.replace('{hours}', num(w.hours)).replace('{rate}', money(w.rate))) + '</span></p>' : '') + '</div></section>';
  }

  /* ---------- members and their day jobs ---------- */
  function neighbors(s) {
    var n = s.neighbors; if (!n || !n.items || !n.items.length) return '';
    return '<section class="band band--concrete" id="neighbors" aria-labelledby="nb-h"><div class="wrap">' + head('nb-h', n.title, n.text) + '<ul class="nbs">' +
      n.items.map(function (x) {
        return '<li class="nb">' + (x.photo ? '<img class="nb-tile" src="' + esc(x.photo) + '" alt="" loading="lazy">' : '<span class="nb-tile" aria-hidden="true">' + esc(initials(x.name)) + '</span>') +
          '<h3>' + esc(x.job) + '</h3><p>' + esc(x.name) + ', ' + esc(x.role) + (x.since ? ' since ' + esc(x.since) : '') + '</p></li>';
      }).join('') + '</ul>' + (n.cta ? '<p class="nbs-foot"><a class="btn" href="' + esc(n.cta.href) + '">' + esc(n.cta.label) + '</a></p>' : '') + '</div></section>';
  }

  /* ---------- ice and water ---------- */
  function lake(s, fx) {
    var l = s.lake; if (!l) return '';
    var st = l.status;
    function steps(title, items) { return items && items.length ? '<div><h3>' + esc(title) + '</h3><ol>' + items.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ol></div>' : ''; }
    return '<section class="band band--dusk" id="lake" aria-labelledby="lake-h">' + (fx || '') + '<div class="wrap">' + head('lake-h', l.title, l.text) + '<div class="lake-grid">' +
      (st ? '<div class="lake-status lake-status--' + esc(st.level || 'off') + '"><p class="lake-status-k">' + esc(st.kicker) + '</p><p class="lake-status-v">' + esc(st.label) + '</p><p>' + esc(st.text) + '</p>' +
        (st.updated ? '<p class="lake-status-u">' + esc(st.updated) + '</p>' : '') + (s.weather ? '<p class="lake-wx" data-wx-line>Checking the National Weather Service for alerts.</p>' : '') + '</div>' : '') +
      (l.guide ? '<div class="ice-guide"><h3>' + esc(l.guideTitle) + '</h3><ul>' + l.guide.map(function (g) {
        return '<li' + (g[3] ? ' class="is-off"' : '') + '><i style="--t:' + (+g[0]) + '" aria-hidden="true"></i><b>' + esc(g[1]) + '</b><span>' + esc(g[2]) + '</span></li>';
      }).join('') + '</ul>' + (l.guideNote ? '<p class="ice-note">' + esc(l.guideNote) + '</p>' : '') + '</div>' : '') + '</div>' +
      '<div class="lake-lists">' + steps(l.seeTitle, l.see) + steps(l.selfTitle, l.self) + '</div></div></section>';
  }

  /* ---------- live weather alerts, from the National Weather Service's public feed ---------- */
  var wx = { at: 0, list: null, failed: false, busy: false, demo: false };
  function alertSlot(s) { return s.weather ? '<div class="alert alert--wx" id="wx" role="status" hidden></div>' : ''; }
  function until(p) {
    var d = new Date(p.ends || p.expires || ''); if (isNaN(d)) return '';
    var day = d.toDateString() === new Date().toDateString() ? '' : d.toLocaleDateString('en-US', { weekday: 'long' }) + ' ';
    return ' until ' + day + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(':00', '');
  }
  function demoEnd() { var d = new Date(Date.now() + 86400000); d.setHours(10, 0, 0, 0); return d.toISOString(); }      /* tomorrow at 10 */
  function wxShow() {
    if (!S || !S.weather) return;
    var w = S.weather, list = wx.list || [], bar = document.getElementById('wx'), line = root && root.querySelector('[data-wx-line]');
    var link = 'https://forecast.weather.gov/MapClick.php?lat=' + encodeURIComponent(w.lat) + '&lon=' + encodeURIComponent(w.lon);
    var shown = list.length ? list : (wx.demo ? [{ event: w.demoEvent || 'Winter Weather Advisory', ends: demoEnd(), demo: true }] : []);
    if (bar) {
      if (shown.length) {
        var p = shown[0];
        bar.innerHTML = '<div class="wrap">' + WARN + '<p><b>' + esc(p.event) + '</b> for ' + esc(w.place) + esc(until(p)) + '.' + (shown.length > 1 ? ' ' + (shown.length - 1) + ' more in effect.' : '') +
          ' <a href="' + link + '" target="_blank" rel="noopener">National Weather Service details</a>' + (p.demo ? ' <span class="alert-demo">Sample alert</span>' : '') + '</p></div>';
        bar.hidden = false;
      } else { bar.hidden = true; bar.innerHTML = ''; }
    }
    if (line) {
      line.textContent = wx.list === null ? 'Checking the National Weather Service for alerts.' :
        (wx.failed ? 'The National Weather Service feed did not answer just now.' :
          'Weather alerts for ' + w.place + ' right now: ' + (list.length ? list.map(function (x) { return x.event; }).join(', ') : 'none') + '. Live from the National Weather Service.');
    }
  }
  function wxLoad() {
    if (!S.weather) return;
    wxShow();
    if (wx.busy || (wx.list && Date.now() - wx.at < (wx.failed ? 60000 : 600000))) return;
    wx.busy = true;
    function done(list, failed) { wx.busy = false; wx.list = list; wx.failed = !!failed; wx.at = Date.now(); wxShow(); }
    if (!window.fetch) return done([], true);
    var rank = { Extreme: 4, Severe: 3, Moderate: 2, Minor: 1 };
    window.fetch('https://api.weather.gov/alerts/active?point=' + encodeURIComponent(S.weather.lat + ',' + S.weather.lon), { headers: { Accept: 'application/geo+json' } })
      .then(function (r) { if (!r.ok) throw new Error('feed'); return r.json(); })
      .then(function (j) {
        done((j.features || []).map(function (f) { return f.properties || {}; })
          .filter(function (p) { return p.event && (!p.status || p.status === 'Actual') && p.messageType !== 'Cancel'; })
          .sort(function (a, b) { return (rank[b.severity] || 0) - (rank[a.severity] || 0); }), false);
      }).catch(function () { done([], true); });
  }

  /* ---------- Santa night: the map follows the engine ---------- */
  var ROUTE = 'M112 338 C74 258 96 128 204 82 C314 36 474 58 536 132 C594 202 570 304 488 350 C402 398 252 396 190 374 C156 362 126 356 112 338 Z';
  var WATER = 'M222 156 C256 104 358 98 424 130 C490 162 494 238 444 276 C396 312 302 320 244 294 C182 266 186 208 222 156 Z';
  function minutes(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function santa(s, fx) {
    var x = s.santa; if (!x || !x.stops || x.stops.length < 2) return '';
    var houses = '', seed = 7, i;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (i = 0; i < 90; i++) {        /* lit windows around the lake */
      var a = rnd() * 6.283, r = 0.9 + rnd() * 0.42, hx = 320 + Math.cos(a) * 250 * r, hy = 214 + Math.sin(a) * 170 * r;
      if (hx < 14 || hx > 626 || hy < 12 || hy > 418) continue;
      houses += '<rect x="' + hx.toFixed(0) + '" y="' + hy.toFixed(0) + '" width="7" height="6" rx="1" fill="#F4D58D" opacity="' + (0.16 + rnd() * 0.5).toFixed(2) + '"/>';
    }
    var dots = '';
    for (i = 0; i < x.stops.length - 1; i++) dots += '<g data-santa-dot><circle r="11" fill="#0B1428" stroke="#E9B949" stroke-width="2.5"/><text y="4.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Arial, sans-serif">' + (i + 1) + '</text></g>';
    return '<section class="band band--dusk" id="santa" aria-labelledby="santa-h">' + (fx || '') + '<div class="wrap" data-santa><div class="head">' +
      '<h2 id="santa-h">' + esc(x.title) + '</h2><p class="lede">' + esc(x.text) + '</p><p class="santa-when">' + I('calendar') + '<span>' + esc(x.when) + '</span></p></div>' +
      '<div class="santa-grid"><div><p class="santa-now"><b>' + esc(x.nowLabel || 'Right now') + '</b> <span data-santa-now>' + esc(x.stops[0].name) + '</span></p>' +
      '<ol class="santa-stops">' + x.stops.map(function (st, k) { return '<li data-santa-stop><i>' + (k < x.stops.length - 1 ? k + 1 : I('check')) + '</i><span>' + esc(st.name) + '</span><time>' + esc(st.time) + '</time></li>'; }).join('') + '</ol>' +
      (x.sponsor ? '<p class="santa-sponsor">' + esc(x.sponsorLabel || 'Santa night is sponsored by') + ' <b>' + esc(x.sponsor) + '</b></p>' : '') + '</div>' +
      '<figure class="santa-map"><svg viewBox="0 0 640 430" role="img" aria-label="' + esc(x.mapAlt || 'Map of the route around the lake') + '">' +
      '<defs><radialGradient id="santa-glow"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset=".45" stop-color="#E9B949" stop-opacity=".35"/><stop offset="1" stop-color="#E9B949" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="santa-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27507F"/><stop offset="1" stop-color="#17355A"/></linearGradient></defs>' +
      '<rect width="640" height="430" fill="#0A1326"/>' + houses +
      '<path d="' + WATER + '" fill="url(#santa-water)" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/>' +
      (x.water ? '<text x="334" y="214" text-anchor="middle" font-size="17" font-style="italic" fill="rgba(255,255,255,.72)" font-family="Georgia, serif">' + esc(x.water) + '</text>' : '') +
      '<path d="' + ROUTE + '" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="13" stroke-linejoin="round"/>' +
      '<path data-santa-route d="' + ROUTE + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/>' +
      '<path data-santa-trail d="' + ROUTE + '" fill="none" stroke="#E9B949" stroke-width="4" stroke-linecap="round"/>' + dots +
      '<g data-santa-truck><circle r="30" fill="url(#santa-glow)"/><g transform="translate(-15 -11)"><rect x="0" y="5" width="30" height="12" rx="2" fill="#C4161C"/><rect x="19" y="0" width="11" height="10" rx="2" fill="#C4161C"/><rect x="21.5" y="2" width="6.5" height="5" rx="1" fill="#CFE4FF"/><rect x="0" y="11" width="30" height="2" fill="#E9B949"/><rect x="2" y="2.4" width="14" height="1.8" rx=".9" fill="#D9DDE4"/><circle cx="7" cy="18" r="3.4" fill="#14161B"/><circle cx="23" cy="18" r="3.4" fill="#14161B"/><circle cx="7" cy="18" r="1.2" fill="#9AA0A8"/><circle cx="23" cy="18" r="1.2" fill="#9AA0A8"/></g></g>' +
      '</svg>' + (x.note ? '<figcaption>' + esc(x.note) + '</figcaption>' : '') + '</figure></div></div></section>';
  }
  var run = { p: 0, t0: null, raf: 0, seen: false, last: '' };
  function santaDraw(p) {
    var box = root && root.querySelector('[data-santa]'); if (!box) return;
    var path = box.querySelector('[data-santa-route]'), L = path.getTotalLength(), pt = path.getPointAtLength(L * p), stops = S.santa.stops, n = stops.length;
    box.querySelector('[data-santa-truck]').setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
    var trail = box.querySelector('[data-santa-trail]'); trail.style.strokeDasharray = L; trail.style.strokeDashoffset = L * (1 - p);
    var pos = p * (n - 1), seg = Math.min(n - 2, Math.floor(pos)), f = pos - seg, at = p >= 1 ? n - 1 : (f < 0.1 ? seg : -1);
    var eta = Math.max(1, Math.ceil((1 - f) * (minutes(stops[seg + 1].time) - minutes(stops[seg].time))));
    var text = at >= 0 ? 'At ' + stops[at].name + '.' : 'On the way to ' + stops[seg + 1].name + ', about ' + eta + ' minute' + (eta === 1 ? '' : 's') + ' out.';
    if (text !== run.last) {
      run.last = text; box.querySelector('[data-santa-now]').textContent = text;
      var hi = at >= 0 ? at : seg + 1;      /* the stop the engine is at, or heading for */
      box.querySelectorAll('[data-santa-stop]').forEach(function (li, k) { li.classList.toggle('is-done', k < hi); li.classList.toggle('is-next', k === hi); });
    }
  }
  function santaTick(ts) {
    run.raf = 0;
    if (!root || !root.querySelector('[data-santa]') || !run.seen || still()) return;
    var DUR = ((S.santa.loopSeconds || 52) * 1000), HOLD = 3500;
    if (run.t0 === null) run.t0 = ts - run.p * DUR;
    var e = (ts - run.t0) % (DUR + HOLD);
    run.p = Math.min(1, e / DUR); santaDraw(run.p);
    run.raf = window.requestAnimationFrame(santaTick);
  }
  function santaMount() {
    var box = root.querySelector('[data-santa]'); if (!box) return;
    var path = box.querySelector('[data-santa-route]'), L = path.getTotalLength(), n = S.santa.stops.length;
    box.querySelectorAll('[data-santa-dot]').forEach(function (g, k) { var pt = path.getPointAtLength(L * k / (n - 1)); g.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')'); });
    run.last = ''; run.t0 = null;
    if (still() && !run.p) run.p = 0.43;
    santaDraw(run.p);
  }

  /* ---------- the fund drive: monthly giving and a code for the mailed letter ---------- */
  function freq(s) {
    return s.support && s.support.monthly ? '<div class="freq" role="group" aria-label="How often"><button type="button" data-freq="once" aria-pressed="true">One time</button><button type="button" data-freq="monthly" aria-pressed="false">Every month</button></div>' : '';
  }
  function giveQr(s) {
    var q = s.support && s.support.qr; if (!q) return '';
    return '<div class="give-qr"><div class="qr" data-qr="#support"></div><p><b>' + esc(q.label) + '</b><span>' + esc(q.text) + '</span></p></div>';
  }
  function donateLabel() {
    var b = root && root.querySelector('[data-donate] span'), on = root && root.querySelector('[data-freq="monthly"][aria-pressed="true"]');
    if (b) b.textContent = b.textContent.replace(/ a month$/, '') + (on && /\$/.test(b.textContent) ? ' a month' : '');
  }

  /* ---------- reflective house-number signs ---------- */
  function signs(s) {
    var g = s.support && s.support.signs; if (!g) return '';
    return '<div class="card signs"><h3>' + esc(g.title) + '</h3><p>' + esc(g.text) + '</p><div class="sign-try"><label for="sign-no">' + esc(g.label || 'Your house number') +
      '<input id="sign-no" inputmode="numeric" maxlength="5" autocomplete="off" value="' + esc(g.sample || '27') + '"></label><div class="sign" aria-hidden="true"><span data-sign>' + esc(g.sample || '27') + '</span></div></div>' +
      '<button class="btn btn--dusk" type="button" data-sign-order>' + esc(g.cta) + '</button><p class="demo-note" data-sign-note hidden>' + esc(g.done) + '</p></div>';
  }

  /* ---------- "tell us you're interested" ---------- */
  function applyButton(s) {
    var a = s.join && s.join.apply;
    return a ? '<button class="btn btn--gold" type="button" data-open="apply">' + esc(a.button) + '</button>' : '';
  }
  function applyDialog(s) {
    var a = s.join && s.join.apply; if (!a) return '';
    return '<dialog id="apply" class="dlg-wide" aria-labelledby="apply-h"><div class="dlg"><button class="dlg-x" type="button" data-close aria-label="Close">' + I('close') + '</button><h2 id="apply-h">' + esc(a.title) + '</h2><p class="dlg-lede">' + esc(a.text) + '</p>' +
      '<form class="form" data-apply novalidate><label>Name<input name="name" autocomplete="name" required></label><label>Mobile phone<input name="phone" type="tel" autocomplete="tel" required></label>' +
      '<label class="full">Email (optional)<input name="email" type="email" autocomplete="email"></label>' +
      (a.interests && a.interests.length ? '<fieldset class="full checks"><legend>What interests you?</legend>' + a.interests.map(function (x) { return '<label><input type="checkbox" name="interest" value="' + esc(x) + '">' + esc(x) + '</label>'; }).join('') + '</fieldset>' : '') +
      (a.visits && a.visits.options ? '<label class="full">' + esc(a.visits.label) + '<select name="visit"><option value="">' + esc(a.visits.none || 'Not yet, call me first') + '</option>' + a.visits.options.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') + '</select></label>' : '') +
      '<button class="btn full" type="submit">' + esc(a.submit || 'Send it') + '</button><p class="demo-note full" data-apply-note hidden></p></form></div></dialog>';
  }

  /* ---------- the report each partner business gets ---------- */
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }
  function reportRows(s) {
    var base = s.partners.report.views || {};
    return s.partners.wall.filter(function (w) { return !w.open; }).map(function (w) {
      var v = Math.round((base[w.tier] || 800) * (0.86 + 0.3 * hash(w.name)) / 10) * 10, c = Math.max(4, Math.round(v * (0.016 + 0.02 * hash(w.name + '!'))));
      return { name: w.name, tier: w.tier, logo: w.logo, views: v, clicks: c };
    });
  }
  function reportButton(s) {
    var r = s.partners && s.partners.report;
    return r ? '<button class="link" type="button" data-open="report">' + esc(r.button || 'See a sample partner report') + '</button>' : '';
  }
  function reportDialog(s) {
    var r = s.partners && s.partners.report; if (!r) return '';
    var rows = reportRows(s), top = rows[0], max = Math.max.apply(null, rows.map(function (x) { return x.views; }));
    return '<dialog id="report" class="dlg-wide dlg-report" aria-labelledby="rep-h"><div class="dlg"><button class="dlg-x" type="button" data-close aria-label="Close">' + I('close') + '</button>' +
      '<p class="rep-k">' + esc(r.kicker || 'Partner report') + ', ' + esc(r.month) + '</p><h2 id="rep-h">' + esc(top.name) + '</h2>' + (r.note ? '<p class="sample-tag"><b>Sample</b> ' + esc(r.note) + '</p>' : '') +
      '<ul class="rep-lead"><li><b>' + num(top.views) + '</b><span>times your banner or logo was seen</span></li><li><b>' + num(top.clicks) + '</b><span>visitors sent to your website</span></li><li><b>' + esc(r.events || '2') + '</b><span>company events with your sign up</span></li></ul>' +
      '<table class="rep-table"><caption>' + esc(r.allTitle || 'Every partner this month') + '</caption><thead><tr><th scope="col">Partner</th><th scope="col">Level</th><th scope="col">Seen</th><th scope="col">Clicks</th></tr></thead><tbody>' +
      rows.map(function (x) { return '<tr><th scope="row">' + esc(x.name) + '</th><td>' + esc(x.tier) + '</td><td><i class="rep-bar" style="width:' + Math.round(x.views / max * 90) + 'px"></i>' + num(x.views) + '</td><td>' + num(x.clicks) + '</td></tr>'; }).join('') +
      '</tbody></table><p class="rep-foot">' + esc(r.foot || '') + '</p></div></dialog>';
  }

  /* ---------- "Add to calendar" ---------- */
  function calendarButton(s, i) {
    var ev = s.events.items[i];
    return ev && ev.date ? '<button class="event-cal" type="button" data-ics="' + i + '">' + I('calendar') + '<span>Add to calendar</span></button>' : '';
  }
  function ics(ev) {
    var d = new Date(ev.date); if (isNaN(d)) return null;
    function z(n) { return (n < 10 ? '0' : '') + n; }
    function loc(x) { return x.getFullYear() + z(x.getMonth() + 1) + z(x.getDate()) + 'T' + z(x.getHours()) + z(x.getMinutes()) + '00'; }
    function txt(v) { return String(v).replace(/([,;\\])/g, '\\$1').replace(/\r?\n/g, '\\n'); }
    var end = new Date(d.getTime() + (ev.hours || 2) * 3600000), slug = String(ev.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//' + txt(S.company) + '//Events//EN', 'BEGIN:VEVENT', 'UID:' + loc(d) + '-' + slug + '@' + (window.location.hostname || 'firehouse'),
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART:' + loc(d), 'DTEND:' + loc(end), 'SUMMARY:' + txt(ev.title + ' (' + S.company + ')'),
      'LOCATION:' + txt(ev.place || (S.contact.address + ', ' + S.contact.cityLine)), 'DESCRIPTION:' + txt((S.concept ? 'Sample event from a website concept. ' : '') + (ev.meta || '')), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }

  /* ---------- the guided tour ---------- */
  var tour = { el: null, i: 0, left: 0, held: false, paused: false, tick: 0 };
  function tourButton(s) { return s.tour ? '<button class="tour-go" type="button" data-tour>' + I('play') + '<span>' + esc(s.tour.button || 'Take the tour') + '</span></button>' : ''; }
  function tourSteps() { return ((S.tour && S.tour.steps) || []).filter(function (st) { return st.end || document.getElementById(st.at); }); }
  function partnerTotal() {
    var sum = 0, count = 0;
    (S.partners.wall || []).forEach(function (w) {
      if (w.open) return;
      var t = (S.partners.tiers || []).filter(function (x) { return x.name.indexOf(w.tier) === 0; })[0];
      if (t) { sum += +String(t.price).replace(/[^0-9.]/g, '') || 0; count++; }
    });
    return { sum: sum, count: count };
  }
  function tourOffer() {
    var o = S.tour.offer || {}, t = partnerTotal();
    function fill(x) { return esc(x).replace('{count}', t.count).replace('{total}', money(t.sum)).replace('{price}', money(o.price || 0)).replace('{left}', money(t.sum - (o.price || 0))); }
    return '<ul class="tour-offer">' + (o.lines || []).map(function (x) { return '<li>' + I('check') + '<span>' + fill(x) + '</span></li>'; }).join('') + '</ul>' +
      (o.note ? '<p class="sample-tag"><b>Sample</b> ' + esc(o.note) + '</p>' : '') +
      '<div class="tour-end"><div class="qr" data-qr=""></div><p><b>' + esc(o.qrLabel || 'Open it on your own phone') + '</b><span>' + esc(o.qrText || 'Point the camera at the code.') + '</span>' +
      (o.contact ? '<span class="tour-contact">' + esc(o.contact) + '</span>' : '<span class="tour-contact is-blank">' + esc(o.contactBlank || 'Your name, phone and email go here.') + '</span>') + '</p></div>';
  }
  function tourDraw() {
    var steps = tourSteps(), st = steps[tour.i], lastStep = tour.i === steps.length - 1, act = '';
    if (st.action === 'welcome') act = '<button class="btn btn--gold btn--small" type="button" data-welcome>' + esc(st.actionLabel || 'Play the welcome') + '</button>';
    else if (st.action) act = '<button class="btn btn--gold btn--small" type="button" data-open="' + esc(st.action) + '">' + esc(st.actionLabel || 'Open') + '</button>';
    tour.el.className = 'tour' + (st.end ? ' tour--end' : '');
    tour.el.innerHTML = '<div class="tour-bar"><i></i></div><button class="tour-x" type="button" data-tour-close aria-label="End the tour">' + I('close') + '</button>' +
      '<p class="tour-count">' + (tour.i + 1) + ' of ' + steps.length + '</p><h2 id="tour-h" tabindex="-1">' + esc(st.title) + '</h2>' + (st.text ? '<p class="tour-text">' + esc(st.text) + '</p>' : '') +
      (st.end ? tourOffer() : '') + (act ? '<p class="tour-act">' + act + '</p>' : '') +
      '<div class="tour-nav">' + (tour.i ? '<button class="btn btn--ghost btn--small" type="button" data-tour-prev>Back</button>' : '') +
      (lastStep ? '<button class="btn btn--gold btn--small" type="button" data-tour-close>Finish</button>' : '<button class="btn btn--gold btn--small" type="button" data-tour-next>Next</button>') +
      (lastStep || reduce.matches ? '' : '<button class="tour-pause" type="button" data-tour-pause aria-pressed="' + tour.paused + '">' + I(tour.paused ? 'play' : 'pause') + '<span>' + (tour.paused ? 'Play' : 'Pause') + '</span></button>') + '</div>';
    tour.el.querySelectorAll('[data-qr]').forEach(fillQr);
  }
  function tourGo(i, focus) {
    var steps = tourSteps(); if (!tour.el || i < 0 || i >= steps.length) return;
    tour.i = i; tour.left = ((S.tour.seconds || 6) * 1000);
    var st = steps[i], sec = st.at && document.getElementById(st.at);
    document.querySelectorAll('.tour-focus').forEach(function (x) { x.classList.remove('tour-focus'); });
    if (sec && !st.end) { sec.classList.add('tour-focus'); sec.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' }); }
    if (st.alert && S.weather && !(wx.list && wx.list.length)) { wx.demo = true; wxShow(); }
    tourDraw();
    if (focus) { var h = tour.el.querySelector('#tour-h'); if (h) h.focus({ preventScroll: true }); }
  }
  function tourStop() {
    window.clearInterval(tour.tick); tour.tick = 0;
    document.querySelectorAll('.tour-focus').forEach(function (x) { x.classList.remove('tour-focus'); });
    if (tour.el && tour.el.parentNode) tour.el.parentNode.removeChild(tour.el);
    tour.el = null; document.documentElement.classList.remove('is-touring');
    if (wx.demo) { wx.demo = false; wxShow(); }
  }
  function tourStart() {
    if (!S || !S.tour || !tourSteps().length) return;
    tourStop();
    var el = document.createElement('aside'); el.className = 'tour'; el.id = 'tour'; el.setAttribute('aria-labelledby', 'tour-h');
    document.body.appendChild(el); tour.el = el; tour.paused = false; document.documentElement.classList.add('is-touring');
    el.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') tour.held = true; }); el.addEventListener('pointerleave', function () { tour.held = false; });
    tour.held = false; tourGo(0, true);
    /* moves on by itself; waits while the mouse is on the card, a dialog is open or the tab is hidden */
    tour.tick = window.setInterval(function () {
      if (!tour.el) return;
      var steps = tourSteps(), bar = tour.el.querySelector('.tour-bar i'), total = (S.tour.seconds || 6) * 1000, end = tour.i === steps.length - 1;
      if (!end && !tour.paused && !tour.held && !reduce.matches && !document.hidden && !document.querySelector('dialog[open]')) tour.left -= 100;
      if (bar) bar.style.width = (end || reduce.matches ? 100 : Math.max(0, Math.min(100, (1 - tour.left / total) * 100))) + '%';
      if (tour.left <= 0 && !end) tourGo(tour.i + 1);
    }, 100);
  }

  /* ---------- after each render ---------- */
  function fillQr(el) { el.innerHTML = qr(pageUrl(el.getAttribute('data-qr') || '')); }
  function count(el) {
    var to = +el.getAttribute('data-count'), cash = el.hasAttribute('data-money'), t0 = null;
    function show(v) { el.textContent = cash ? money(v) : num(Math.round(v)); }
    if (still()) return show(to);
    show(0);
    window.requestAnimationFrame(function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / 1300); show(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) window.requestAnimationFrame(step);
    });
  }
  function mount(el, s) {
    S = s; root = el;
    if (io) io.disconnect();
    window.clearInterval(beat); window.cancelAnimationFrame(run.raf); run.raf = 0; run.seen = false;
    root.querySelectorAll('[data-qr]').forEach(fillQr);
    santaMount();
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (list) {
        list.forEach(function (e) {
          if (e.target.hasAttribute('data-count')) { if (e.isIntersecting) { io.unobserve(e.target); count(e.target); } return; }
          run.seen = e.isIntersecting;
          if (run.seen && !run.raf && !still()) { run.t0 = null; run.raf = window.requestAnimationFrame(santaTick); }
        });
      }, { threshold: 0.25 });
      root.querySelectorAll('[data-count]').forEach(function (n) { io.observe(n); });
      var sm = root.querySelector('.santa-map'); if (sm) io.observe(sm);
    }
    /* "Pause motion" can be pressed at any time: pick the map back up when it is released */
    beat = window.setInterval(function () { if (run.seen && !run.raf && !still() && root.querySelector('[data-santa]')) { run.t0 = null; run.raf = window.requestAnimationFrame(santaTick); } }, 1000);
    wxLoad();
    if (/[?&]alert\b/.test(window.location.search)) { wx.demo = true; wxShow(); }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-tour],[data-tour-next],[data-tour-prev],[data-tour-pause],[data-tour-close],[data-freq],[data-amount],[data-sign-order],[data-ics]');
    if (!t || !S) return;
    if (t.matches('[data-tour]')) tourStart();
    else if (t.matches('[data-tour-next]')) tourGo(tour.i + 1, true);
    else if (t.matches('[data-tour-prev]')) tourGo(tour.i - 1, true);
    else if (t.matches('[data-tour-pause]')) { tour.paused = !tour.paused; tourDraw(); var b = tour.el.querySelector('[data-tour-pause]'); if (b) b.focus(); }
    else if (t.matches('[data-tour-close]')) tourStop();
    else if (t.matches('[data-freq]')) { root.querySelectorAll('[data-freq]').forEach(function (b) { b.setAttribute('aria-pressed', b === t); }); donateLabel(); }
    else if (t.matches('[data-amount]')) window.setTimeout(donateLabel, 0);       /* js/site.js writes the amount first */
    else if (t.matches('[data-sign-order]')) { var n = root.querySelector('[data-sign-note]'); if (n) n.hidden = false; }
    else if (t.matches('[data-ics]')) {
      var body = ics(S.events.items[+t.getAttribute('data-ics')]); if (!body) return;
      var a = document.createElement('a'), url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
      a.href = url; a.download = String(S.events.items[+t.getAttribute('data-ics')].title).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.ics';
      document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'sign-no' || !S) return;
    var v = e.target.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 5).toUpperCase(), out = root.querySelector('[data-sign]');
    if (out) out.textContent = v || (S.support.signs.sample || '27');
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest && e.target.closest('[data-apply]'); if (!f || !S) return;
    e.preventDefault();
    var note = f.querySelector('[data-apply-note]'), name = f.elements.name.value.trim(), phone = f.elements.phone.value.replace(/[^0-9]/g, '');
    note.hidden = false;
    if (!name || phone.length < 10) { note.textContent = 'Add your name and a mobile number with its area code, so a member can call you back.'; (name ? f.elements.phone : f.elements.name).focus(); return; }
    note.textContent = S.join.apply.done;
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && tour.el && !document.querySelector('dialog[open]')) tourStop();
  });

  window.FirePlus = {
    qr: qr, feed: feed, year: year, neighbors: neighbors, lake: lake, santa: santa, alertSlot: alertSlot, freq: freq, giveQr: giveQr, signs: signs,
    applyButton: applyButton, dialogs: function (s) { return applyDialog(s) + reportDialog(s); }, reportButton: reportButton, calendarButton: calendarButton,
    tourButton: tourButton, tour: tourStart, mount: mount
  };
})();
