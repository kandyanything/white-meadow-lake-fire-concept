/* Renders the whole site from data/site.js, then wires up the interactions.
   Nothing here is department-specific: edit the data file, not this one. */
(function () {
  'use strict';
  var A = window.FireArt, RAW = window.SITE, esc = A.esc, I = A.icon;
  var app = document.getElementById('app');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state = { rig: 0, station: 0, ad: 0, adPaused: reduced, first: true, coat: '', amount: null, still: false, zoom: false, slide: 0 };
  var S, FX = window.FireFX, P = window.FirePlus;
  try { state.still = window.localStorage.getItem('fx-still') === '1'; } catch (e) { /* storage can be blocked: start with motion on */ }

  /* ---------- background motion: embers and glints behind the dark sections ---------- */
  function motionOn() { return !!FX && RAW.motion !== false; }
  function sparks(kind) { return motionOn() ? '<div class="fx-layer" aria-hidden="true"><canvas class="fx-sparks" data-fx="' + kind + '"></canvas></div>' : ''; }
  function stillButton(cls) {
    return '<button class="' + cls + '" type="button" data-still aria-pressed="' + state.still + '">' + I(state.still ? 'play' : 'pause') + '<span>' + (state.still ? 'Play motion' : 'Pause motion') + '</span></button>';
  }
  function setStill(v) {
    state.still = !!v;
    document.documentElement.classList.toggle('is-still', state.still);
    var hero = app.querySelector('.hero'); if (hero) hero.classList.toggle('is-still', state.still);
    app.querySelectorAll('[data-still]').forEach(function (b) {
      b.setAttribute('aria-pressed', state.still);
      b.innerHTML = I(state.still ? 'play' : 'pause') + '<span>' + (state.still ? 'Play motion' : 'Pause motion') + '</span>';
    });
    if (FX) FX.pause(state.still);
    try { window.localStorage.setItem('fx-still', state.still ? '1' : '0'); } catch (e) { /* not saved; the button still works for this visit */ }
  }

  /* ---------- data: fill {tokens}, derive names ---------- */
  function resolve(raw) {
    var tok = { town: raw.town, station: raw.station };
    tok.company = raw.companyTemplate.replace('{town}', raw.town);
    tok.short = raw.shortTemplate.replace('{town}', raw.town);
    function walk(v) {
      if (typeof v === 'string') return v.replace(/\{(town|company|short|station)\}/g, function (m, k) { return tok[k]; });
      if (Array.isArray(v)) return v.map(walk);
      if (v && typeof v === 'object') { var o = {}; Object.keys(v).forEach(function (k) { o[k] = walk(v[k]); }); return o; }
      return v;
    }
    var s = walk(raw);
    s.company = tok.company; s.short = tok.short;
    s.mapStreets = s.contact.mapStreets;
    return s;
  }
  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = Math.round((n >> 16) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function money(n) { return '$' + Number(n).toLocaleString('en-US'); }
  function topicLink(label, topic, cls) { return '<a class="' + (cls || 'link') + '" href="#contact" data-topic="' + esc(topic) + '">' + esc(label) + '</a>'; }

  /* ---------- sections ---------- */
  function emblem() { return S.emblemImage ? '<img class="art art-emblem" src="' + esc(S.emblemImage) + '" alt="">' : A.emblem(S); }
  function header() {
    var nav = [['Join', '#join']].concat(S.stations && S.stations.items && S.stations.items.length ? [['Stations', '#stations']] : [], [['Apparatus', '#apparatus'], ['Officers', '#officers'], ['Safety', '#safety'], ['Events', '#events'], ['Support us', '#support'], ['Contact', '#contact']]);
    return (S.sampleBanner ? '<div class="sample-bar"><div class="wrap">' + esc(S.sampleBanner) + (S.concept ? '' : P.tourButton(S)) + '</div></div>' : '') +
      '<div class="strip"><div class="wrap"><strong>Emergency? Call 911.</strong><div class="strip-right">' +
      '<a href="tel:' + esc(S.contact.nonEmergency.replace(/[^0-9]/g, '')) + '">Non-emergency: ' + esc(S.contact.nonEmergency) + '</a>' +
      '<button type="button" data-open="members">' + I('lock') + 'Members</button></div></div></div>' +
      (S.alert && S.alert.active ? '<div class="alert" role="status"><div class="wrap">' + I('burn') + '<p>' + esc(S.alert.text) + (S.alert.link ? ' <a href="' + esc(S.alert.link.href) + '">' + esc(S.alert.link.label) + '</a>' : '') + '</p></div></div>' : '') + P.alertSlot(S) +
      '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="#top">' + emblem() + '<span><b>' + esc(S.company) + '</b><span>' + esc(S.tagline) + '</span></span></a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav">' + I('menu') + 'Menu</button>' +
      '<nav class="nav" id="nav" aria-label="Main">' + nav.map(function (n) { return '<a href="' + n[1] + '">' + n[0] + '</a>'; }).join('') +
      '<a class="btn btn--small" href="#support">Donate</a></nav></div></header>';
  }

  function hero() {
    var h = S.hero;
    var slides = h.slides && h.slides.length ? h.slides : (h.photo ? [{ src: h.photo, alt: h.photoAlt }] : null);
    if (slides) state.slide = Math.min(state.slide, slides.length - 1);
    /* Only the first photo loads with the page; the rest are fetched a moment later (see render). */
    if (slides) return '<section class="hero hero--photo" id="top" aria-labelledby="hero-h"><div class="hero-media">' + slides.map(function (x, i) {
        var on = i === state.slide;
        return '<img class="hero-img' + (on ? ' is-on' : '') + '" ' + (on || !state.first ? 'src' : 'data-src') + '="' + esc(x.src) + '" alt="' + esc(x.alt || '') + '"' + (x.pos ? ' style="object-position:' + esc(x.pos) + '"' : '') + (on ? '' : ' aria-hidden="true"') + '>';
      }).join('') + '</div><div class="hero-shade"></div>' + sparks('hero') +
      '<div class="hero-copy wrap"><h1 id="hero-h">' + esc(h.title) + '</h1><p>' + esc(h.text) + '</p>' +
      '<div class="hero-cta"><a class="btn btn--gold" href="' + h.primary.href + '">' + esc(h.primary.label) + '</a><a class="btn btn--ghost" href="' + h.secondary.href + '">' + esc(h.secondary.label) + '</a></div></div>' + (motionOn() ? stillButton('hero-pause') : '') + '</section>';
    if (h.framed && h.framed.src) return '<section class="hero hero--framed" id="top" aria-labelledby="hero-h">' + sparks('hero') +
      '<div class="hero-copy wrap"><h1 id="hero-h">' + esc(h.title) + '</h1><p>' + esc(h.text) + '</p>' +
      '<div class="hero-cta"><a class="btn btn--gold" href="' + h.primary.href + '">' + esc(h.primary.label) + '</a><a class="btn btn--ghost" href="' + h.secondary.href + '">' + esc(h.secondary.label) + '</a></div></div>' +
      '<figure class="hero-frame"><img src="' + esc(h.framed.src) + '" alt="' + esc(h.framed.alt || '') + '">' + (h.framed.caption ? '<figcaption>' + esc(h.framed.caption) + '</figcaption>' : '') + '</figure>' +
      (motionOn() ? stillButton('hero-pause') : '') + '</section>';
    return '<section class="hero' + (state.first ? '' : ' no-intro') + (state.still ? ' is-still' : '') + '" id="top" aria-labelledby="hero-h">' +
      '<div class="hero-copy wrap"><h1 id="hero-h">' + esc(h.title) + '</h1><p>' + esc(h.text) + '</p>' +
      '<div class="hero-cta"><a class="btn btn--gold" href="' + h.primary.href + '">' + esc(h.primary.label) + '</a><a class="btn btn--ghost" href="' + h.secondary.href + '">' + esc(h.secondary.label) + '</a></div></div>' +
      '<div class="hero-scene">' + A.station(S) + '</div>' + sparks('hero') + stillButton('hero-pause') + '</section>';
  }

  function partnerBanner() {
    var ads = S.partners.top.filter(function (a) { return a.active !== false; });
    if (!ads.length) return '';
    if (state.ad >= ads.length) state.ad = 0;
    return '<aside class="pb" aria-label="Community partners"><div class="wrap"><div class="pb-frame">' +
      ads.map(function (a, i) {
        return '<a class="pb-ad' + (i === state.ad ? ' is-active' : '') + '" href="' + esc(a.url) + '" style="--from:' + a.theme.from + ';--to:' + a.theme.to + ';--ac:' + a.theme.accent + '"' + (i === state.ad ? '' : ' tabindex="-1" aria-hidden="true"') + '>' +
          '<span class="pb-mark">' + (a.logo ? '<img class="pb-logo" src="' + esc(a.logo) + '" alt="" width="52" height="52">' : '') + '<span><b>' + esc(a.mark[0]) + '</b><i>' + esc(a.mark[1] || '') + '</i></span></span>' +
          '<span class="pb-copy"><strong>' + esc(a.headline) + '</strong><span>' + esc(a.sub) + '</span></span>' +
          '<span class="pb-cta">' + esc(a.cta) + '</span></a>';
      }).join('') + '</div>' +
      '<div class="pb-bar"><span>Community partner. <a class="link" href="#partners">Put your business here</a></span><span class="pb-ctrl">' +
      ads.map(function (a, i) { return '<button class="pb-dot" type="button" data-ad="' + i + '" aria-label="Show ' + esc(a.name) + '"' + (i === state.ad ? ' aria-current="true"' : '') + '></button>'; }).join('') +
      '<button class="pb-pause" type="button" data-ad-pause aria-label="' + (state.adPaused ? 'Play partner rotation' : 'Pause partner rotation') + '">' + I(state.adPaused ? 'play' : 'pause') + '</button></span></div></div></aside>';
  }

  function tasks() {
    var t = S.tasks;
    return '<section class="tasks" aria-labelledby="tasks-h"><div class="wrap"><div class="head"><h2 id="tasks-h">' + esc(t.title) + '</h2></div><ul class="task-grid">' +
      t.items.map(function (x) {
        var link = x.topic ? topicLink(x.action, x.topic) : '<a class="link" href="' + x.href + '">' + esc(x.action) + '</a>';
        return '<li class="task">' + I(x.icon) + '<div><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p>' + link + '</div></li>';
      }).join('') + '</ul></div></section>';
  }

  function plates(units) { return units.map(function (u) { return '<span class="plate">' + esc(u) + '</span>'; }).join(''); }
  function stationPanel() {
    var x = S.stations.items[state.station];
    return '<div class="viewer"><div class="viewer-photo"><img src="' + esc(x.photo) + '" alt="Station ' + esc(x.number) + ', ' + esc(x.name) + '" loading="lazy"></div>' +
      '<div class="viewer-info"><h3>Station ' + esc(x.number) + '</h3><p class="rig-kind">' + esc(x.name) + '</p><p class="rig-text">' + esc(x.text) + '</p>' +
      '<dl class="specs specs--stack"><div><dt>Address</dt><dd>' + esc(x.address) + ', ' + esc(S.town) + '</dd></div><div><dt>Housed here</dt><dd>' + plates(x.units) + '</dd></div></dl></div></div>';
  }
  function stations() {
    var st = S.stations;
    if (!st || !st.items || !st.items.length) return '';
    return '<section class="band band--concrete" id="stations" aria-labelledby="sta-h"><div class="wrap"><div class="head"><h2 id="sta-h">' + esc(st.title) + '</h2><p class="lede">' + esc(st.text) + '</p></div>' +
      '<div class="rig-tabs" role="tablist" aria-label="Stations">' + st.items.map(function (x, i) {
        return '<button class="rig-tab" type="button" role="tab" id="st-tab-' + i + '" aria-controls="st-panel" aria-selected="' + (i === state.station) + '" tabindex="' + (i === state.station ? 0 : -1) + '" data-station="' + i + '"><span class="plate">' + esc(x.number) + '</span>' + esc(x.name) + '</button>';
      }).join('') + '</div><div id="st-panel" role="tabpanel" aria-labelledby="st-tab-' + state.station + '">' + stationPanel() + '</div></div></section>';
  }

  function calls() {
    var c = S.calls, max = Math.max.apply(null, c.byType.map(function (b) { return b.n; }));
    return '<section class="band" id="calls" aria-labelledby="calls-h"><div class="wrap calls-grid"><div>' +
      '<h2 class="calls-total" id="calls-h"><b>' + Number(c.total).toLocaleString('en-US') + '</b><span>calls answered in ' + c.year + '</span></h2>' +
      '<p class="calls-note">Through ' + esc(c.through) + '. ' + esc(c.note) + '</p><ul class="bars">' +
      c.byType.map(function (b) { return '<li class="bar"><span>' + esc(b.label) + '</span><i style="width:' + Math.max(4, Math.round(b.n / max * 100)) + '%"></i><b>' + b.n + '</b></li>'; }).join('') + '</ul></div>' +
      '<div><table class="runlog"><caption>' + esc(c.recentTitle || 'Latest calls') + '</caption><thead><tr><th scope="col">When</th><th scope="col">Call</th><th scope="col">Where</th><th scope="col">Units</th></tr></thead><tbody>' +
      c.recent.map(function (r) { return '<tr><td>' + esc(r.when) + '</td><td>' + esc(r.type) + '</td><td>' + esc(r.where) + '</td><td>' + plates(r.units) + '</td></tr>'; }).join('') +
      '</tbody></table><p class="calls-foot">' + esc(c.foot || 'Locations are given by block or intersection to protect privacy.') + '</p></div></div></section>';
  }

  /* The typed surname as it is lettered on the coat: first letter capital, the rest as typed. */
  function onCoat(v) { v = String(v || '').trim(); return v.charAt(0).toUpperCase() + v.slice(1); }
  function gearCaption(g) { return state.coat && g.name && g.namedCaption ? g.namedCaption.replace('{name}', onCoat(state.coat)) : (g.caption || ''); }
  function zoomLabel() { return I(state.zoom ? 'zoomout' : 'zoomin') + '<span>' + (state.zoom ? 'Show the whole photo' : 'See the name up close') + '</span>'; }
  function gearFigure(g) {
    var n = g.name, z = g.zoom, W = g.width, H = g.height, has = !!(n && state.coat);
    var vars = '--ar:' + W + ' / ' + H + (z ? ';--zs:' + (W / z[2]).toFixed(4) + ';--zx:' + (-z[0] / W * 100).toFixed(3) + '%;--zy:' + (-z[1] / H * 100).toFixed(3) + '%' : '');
    var overlay = !n ? '' : '<svg class="gear-name" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<defs><path id="gear-arc" d="' + esc(n.arc) + '"/>' +
      '<filter id="gear-sewn" filterUnits="userSpaceOnUse" x="' + (n.box[0] - 12) + '" y="' + (n.box[1] - 12) + '" width="' + (n.box[2] + 24) + '" height="' + (n.box[3] + 24) + '"><feGaussianBlur in="SourceAlpha" stdDeviation=".9"/><feOffset dy=".9" result="o"/><feFlood flood-color="#000" flood-opacity=".6"/><feComposite in2="o" operator="in" result="sh"/><feGaussianBlur in="SourceGraphic" stdDeviation=".42" result="t"/><feMerge><feMergeNode in="sh"/><feMergeNode in="t"/></feMerge></filter></defs>' +
      '<image href="' + esc(n.blank) + '" x="' + n.box[0] + '" y="' + n.box[1] + '" width="' + n.box[2] + '" height="' + n.box[3] + '" preserveAspectRatio="none"/>' +
      '<text class="gear-letters" font-size="' + n.size + '" fill="' + esc(n.color) + '" filter="url(#gear-sewn)" data-max="' + n.max + '"><textPath href="#gear-arc" startOffset="50%" text-anchor="middle">' + esc(onCoat(state.coat)) + '</textPath></text></svg>';
    return '<figure class="gear' + (has ? ' has-name' : '') + (z && state.zoom ? ' is-zoomed' : '') + '" id="gear" style="' + vars + '">' +
      '<div class="gear-view"><div class="gear-stage"><img src="' + esc(g.photo) + '" alt="' + esc(g.alt || '') + '" width="' + W + '" height="' + H + '" loading="lazy">' + overlay + '</div>' +
      (z ? '<button class="gear-zoom" type="button" data-gear-zoom aria-pressed="' + !!state.zoom + '">' + zoomLabel() + '</button>' : '') + '</div>' +
      '<figcaption id="gear-cap" aria-live="polite">' + esc(gearCaption(g)) + '</figcaption></figure>';
  }
  /* Squeeze a long surname so it stays inside the panel. */
  function fitGearName() {
    var t = app.querySelector('.gear-letters'); if (!t || !t.getComputedTextLength) return;
    t.removeAttribute('textLength'); t.removeAttribute('lengthAdjust');
    var max = +t.getAttribute('data-max');
    if (max && t.getComputedTextLength() > max) { t.setAttribute('textLength', max); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
  }
  var capTimer;
  function setGearName() {
    var fig = document.getElementById('gear'), g = S.join.gear; if (!fig || !g) return false;
    var tp = fig.querySelector('.gear-letters textPath');
    if (tp) {
      if (state.coat) { tp.textContent = onCoat(state.coat); fitGearName(); }
      fig.classList.toggle('has-name', !!state.coat);
      setZoom(!!state.coat);
    }
    clearTimeout(capTimer);
    capTimer = setTimeout(function () { var c = document.getElementById('gear-cap'); if (c) c.textContent = gearCaption(g); }, 600);
    return true;
  }
  function setZoom(v) {
    var fig = document.getElementById('gear'), b = fig && fig.querySelector('[data-gear-zoom]'); if (!b) return;
    state.zoom = !!v;
    fig.classList.toggle('is-zoomed', state.zoom);
    b.setAttribute('aria-pressed', state.zoom); b.innerHTML = zoomLabel();
  }

  function join() {
    var j = S.join, name = state.coat || j.coatDefault, photo = j.gear && j.gear.photo, typing = !photo || !!j.gear.name;
    return '<section class="band band--dusk" id="join" aria-labelledby="join-h">' + sparks('dusk') + '<div class="wrap">' +
      '<div class="join-top' + (photo ? ' join-top--photo' : '') + '"><div class="join-copy"><h2 id="join-h">' + esc(j.title) + '</h2><p class="lede">' + esc(j.text) + '</p>' +
      '<div class="coat-try">' + (typing ? '<label for="coat-name">' + esc(j.coatLabel) + '</label>' : '') + '<div class="coat-row">' + (typing ? '<input id="coat-name" type="text" maxlength="14" autocomplete="family-name" placeholder="Last name" value="' + esc(state.coat) + '">' : '') +
      (j.apply ? P.applyButton(S) + topicLink(j.cta.label, j.cta.topic, 'link') : topicLink(j.cta.label, j.cta.topic, 'btn btn--gold')) + '</div></div>' +
      '<ul class="perks">' + j.perks.map(function (p) { return '<li>' + I('check') + esc(p) + '</li>'; }).join('') + '</ul></div>' +
      (photo ? gearFigure(j.gear) : '<div class="join-coat" id="coat">' + A.coat(S, name) + '</div>') + '</div>' +
      '<div class="join-mid' + (j.film ? '' : ' join-mid--steps') + '">' + (j.film ? '<figure class="film"><video controls playsinline preload="metadata" poster="' + esc(j.film.poster) + '"><source src="' + esc(j.film.src) + '" type="video/mp4"></video><figcaption>' + esc(j.film.caption) + '</figcaption></figure>' : '') +
      '<div class="steps"><h3>How joining works</h3><ol>' + j.steps.map(function (s, i) { return '<li><b>' + (i + 1) + '</b><div><strong>' + esc(s.title) + '</strong><span>' + esc(s.text) + '</span></div></li>'; }).join('') + '</ol></div></div>' +
      '<ul class="roles"><li class="roles-title">There is a job for everyone</li>' + j.roles.map(function (r) { return '<li class="role">' + A.shield(S, r.label, r.color) + '<strong>' + esc(r.title) + '</strong><span>' + esc(r.text) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="faq"><h3>Questions people ask</h3><div class="faq-list">' + j.faq.map(function (f) { return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') + '</div></div>' +
      '</div></section>';
  }

  function rigPanel() {
    var r = S.apparatus.rigs[state.rig];
    if (r.photo) return '<div class="viewer"><div class="viewer-photo"><img src="' + esc(r.photo) + '" alt="' + esc(r.name) + '" loading="lazy"' + (r.photoRatio ? ' style="aspect-ratio:' + esc(r.photoRatio) + '"' : '') + '></div>' +
      '<div class="viewer-info"><h3>' + esc(r.name) + '</h3><p class="rig-kind">' + esc(r.kind) + '</p><p class="rig-text">' + esc(r.text) + '</p>' +
      '<dl class="specs specs--stack">' + r.specs.map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('') + '</dl></div></div>';
    return '<div class="rig-stage">' + A.rig(r.type, S, { label: r.name }) + '<div class="rig-floor"></div></div>' +
      '<div class="rig-info"><div><h3>' + esc(r.name) + '</h3><p class="rig-kind">' + esc(r.kind) + '</p><p class="rig-text">' + esc(r.text) + '</p></div>' +
      '<dl class="specs">' + r.specs.map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('') + '</dl></div>';
  }
  function apparatus() {
    var a = S.apparatus;
    return '<section class="band" id="apparatus" aria-labelledby="app-h"><div class="wrap"><div class="head"><h2 id="app-h">' + esc(a.title) + '</h2><p class="lede">' + esc(a.text) + '</p></div>' +
      '<div class="rig-tabs" role="tablist" aria-label="Apparatus">' + a.rigs.map(function (r, i) {
        return '<button class="rig-tab" type="button" role="tab" id="rig-tab-' + i + '" aria-controls="rig-panel" aria-selected="' + (i === state.rig) + '" tabindex="' + (i === state.rig ? 0 : -1) + '" data-rig="' + i + '"><span class="plate">' + esc(r.plate || (r.code + ((r.name.match(/\d+$/) || [S.station])[0]))) + '</span>' + esc(r.tab || r.name.replace(/\s*\d+$/, '')) + '</button>';
      }).join('') + '</div><div id="rig-panel" role="tabpanel" aria-labelledby="rig-tab-' + state.rig + '">' + rigPanel() + '</div>' + (a.fleet ? '<p class="fleet">' + esc(a.fleet) + '</p>' : '') + '</div></section>';
  }

  /* A plain tile with the person's initials, for real people whose photo has not been supplied. */
  function monogram(name) {
    var parts = String(name).replace(/\b(Jr|Sr|II|III)\.?$/i, '').trim().split(/\s+/), ini = (parts[0] || '').charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '');
    return '<div class="mono" aria-hidden="true"><span>' + esc(ini.toUpperCase()) + '</span></div>';
  }
  function person(p) {
    var pic = p.photo ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.rank + ' ' + p.name) + '" loading="lazy">' : (S.officers.portraits === 'initials' ? monogram(p.name) : A.portrait(p, S));
    return '<li><figure class="person' + (p.photo ? ' person--photo' : '') + '">' + pic + '<figcaption><span class="rank">' + esc(p.rank) + '</span><strong>' + esc(p.name) + '</strong>' + (p.note ? '<span class="note">' + esc(p.note) + '</span>' : '') + '</figcaption></figure></li>';
  }
  function chief(c) {
    if (!c) return '';
    var both = c.portrait && c.uniform;
    var uni = c.uniform ? '<figure class="chief-uniform"><img src="' + esc(c.uniform) + '" alt="' + esc(c.uniformAlt || '') + '" loading="lazy">' + (c.uniformCaption ? '<figcaption>' + esc(c.uniformCaption) + '</figcaption>' : '') + '</figure>' : '';
    var pic = c.portrait ? '<figure class="chief-portrait"><img src="' + esc(c.portrait) + '" alt="' + esc(c.rank + ' ' + c.name) + '" loading="lazy"></figure>' : '';
    var lead = pic || uni || (S.officers.portraits === 'initials' ? '<figure class="chief-portrait">' + monogram(c.name) + '</figure>' : '');
    return '<article class="chief' + (both ? ' chief--both' : '') + (lead ? '' : ' chief--text') + '" aria-labelledby="chief-h">' + lead +
      '<div class="chief-copy"><p class="rank">' + esc(c.rank) + '</p><h3 id="chief-h">' + esc(c.name) + '</h3>' +
      (c.message && c.message.length ? '<blockquote class="chief-words">' + c.message.map(function (m) { return '<p>' + esc(m) + '</p>'; }).join('') + '</blockquote>' : '') +
      (c.placeholder ? '<p class="placeholder-note">' + esc(c.placeholder) + '</p>' : '') +
      (c.facts && c.facts.length ? '<dl class="chief-facts">' + c.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' : '') + '</div>' +
      (both ? uni : '') + '</article>';
  }
  function officers() {
    var o = S.officers;
    return '<section class="band band--concrete" id="officers" aria-labelledby="off-h"><div class="wrap"><div class="head"><h2 id="off-h">' + esc(o.title) + '</h2><p class="lede">' + esc(o.text) + '</p></div>' +
      chief(o.chief) +
      '<ul class="people">' + o.line.map(person).join('') + '</ul>' +
      (o.captains && o.captains.length ? '<h3 class="people-sub">' + esc(o.captainsTitle || 'Station captains') + '</h3><ul class="captains">' + o.captains.map(function (c) { return '<li><span>' + esc(c.station) + '</span><strong>' + esc(c.name) + '</strong></li>'; }).join('') + '</ul>' : '') +
      (o.dept && o.dept.length ? '<h3 class="people-sub">' + esc(o.deptTitle || 'Department officers') + '</h3><ul class="people people--admin">' + o.dept.map(person).join('') + '</ul>' : '') +
      (o.admin && o.admin.length ? '<h3 class="people-sub">' + esc(o.adminTitle || 'Company officers') + '</h3><ul class="people people--admin">' + o.admin.map(person).join('') + '</ul>' : '') + '</div></section>';
  }

  function safety() {
    var s = S.safety;
    return '<section class="band" id="safety" aria-labelledby="safe-h"><div class="wrap safety-grid"><div><h2 id="safe-h">' + esc(s.title) + '</h2>' +
      '<div class="season"><b>' + esc(s.seasonal.label) + '</b><p>' + esc(s.seasonal.text) + '</p></div>' + topicLink(s.cta.label, s.cta.topic, 'btn') + '</div>' +
      '<ul class="tips">' + s.items.map(function (x) { return '<li>' + I(x.icon) + '<h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></li>'; }).join('') + '</ul></div></section>';
  }

  function events() {
    var e = S.events;
    return '<section class="band band--concrete" id="events" aria-labelledby="ev-h"><div class="wrap events-grid"><div><div class="head"><h2 id="ev-h">' + esc(e.title) + '</h2></div><ul>' +
      e.items.map(function (x, i) { return '<li class="event"><time><span>' + esc(x.month) + '</span><b>' + esc(x.day) + '</b></time><div><strong>' + esc(x.title) + '</strong><p>' + esc(x.meta) + '</p>' + (x.sponsor ? '<p class="event-sponsor">Sponsored by <b>' + esc(x.sponsor) + '</b></p>' : '') + P.calendarButton(S, i) + '</div></li>'; }).join('') + '</ul></div>' +
      '<div class="news"><h3>News from the company</h3><ul>' + e.news.map(function (n) { return '<li><time>' + esc(n.date) + '</time><strong>' + esc(n.title) + '</strong><p>' + esc(n.text) + '</p></li>'; }).join('') + '</ul></div></div></section>';
  }

  function support() {
    var s = S.support, f = s.fund, pct = Math.round(f.raised / f.goal * 100);
    return '<section class="band band--accent" id="support" aria-labelledby="sup-h">' + sparks('accent') + '<div class="wrap support-grid"><div><h2 id="sup-h">' + esc(s.title) + '</h2><p class="lede">' + esc(s.text) + '</p>' +
      '<div class="card fund"><h3>' + esc(f.name) + '</h3><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Fund drive progress"><i style="width:' + pct + '%"></i></div>' +
      '<div class="fund-nums"><span><b>' + money(f.raised) + '</b> raised</span><span>of ' + money(f.goal) + '</span></div><p class="fund-note">' + esc(f.note) + '</p>' +
      P.freq(S) + '<div class="amounts" role="group" aria-label="Gift amount">' + s.amounts.map(function (a) { return '<button class="amount" type="button" data-amount="' + a + '" aria-pressed="' + (state.amount === a) + '">' + money(a) + '</button>'; }).join('') + '</div>' +
      '<button class="btn btn--dusk" type="button" data-donate>' + I('heart') + '<span>' + (state.amount ? 'Donate ' + money(state.amount) : 'Donate') + '</span></button>' +
      '<p class="demo-note" id="donate-note" hidden>Demo only. On a live site this button opens the company\'s payment page.</p>' + P.giveQr(S) + '</div></div>' +
      '<div class="support-side">' + (s.hall ? '<div class="card hall"><h3>' + esc(s.hall.name) + '</h3><p>' + esc(s.hall.text) + '</p>' + topicLink(s.hall.cta.label, s.hall.cta.topic, 'btn btn--gold') + '</div>' : '') + P.signs(S) +
      '<div class="other"><h3>Other ways to give</h3><ul>' + s.other.map(function (x) { return '<li>' + I('check') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div></div></div></section>';
  }

  function partners() {
    var p = S.partners;
    return '<section class="band" id="partners" aria-labelledby="par-h"><div class="wrap"><div class="head"><h2 id="par-h">' + esc(p.title) + '</h2><p class="lede">' + esc(p.text) + '</p></div>' +
      '<ul class="tiers">' + p.tiers.map(function (t) { return '<li class="tier"><h3>' + esc(t.name) + '</h3><p class="price">' + esc(t.price) + '</p><ul>' + t.items.map(function (x) { return '<li>' + I('check') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul></li>'; }).join('') + '</ul>' +
      '<h3 class="wall-title">This year\'s partners</h3><ul class="wall">' + p.wall.map(function (w, i) { if (w.open) return '<li class="is-open"><div><b>' + esc(w.name) + '</b><span>' + esc(w.tier) + ' partner</span></div></li>'; return '<li style="--i:' + i + '"' + (w.logo ? ' class="has-logo"><img class="wall-logo" src="' + esc(w.logo) + '" alt="" width="56" height="56" loading="lazy"' : '') + '><div><b>' + esc(w.name) + '</b><span>' + esc(w.tier) + ' partner</span></div></li>'; }).join('') + '</ul>' +
      '<div class="partners-foot"><p>' + esc(p.disclosure) + ' ' + P.reportButton(S) + '</p>' + topicLink(p.cta.label, p.cta.topic, 'btn') + '</div></div></section>';
  }

  function gallery() {
    var g = S.gallery;
    if (!g || !g.items || !g.items.length) return '';
    return '<section class="band" id="photos" aria-labelledby="gal-h"><div class="wrap"><div class="head"><h2 id="gal-h">' + esc(g.title) + '</h2></div><ul class="gallery' + (g.strip ? ' gallery--strip' : '') + '">' +
      g.items.map(function (x) { return '<li><figure><img src="' + esc(x.src) + '" alt="' + esc(x.alt || '') + '" loading="lazy">' + (x.caption ? '<figcaption>' + esc(x.caption) + '</figcaption>' : '') + '</figure></li>'; }).join('') + '</ul></div></section>';
  }

  function mobileBar() {
    return '<nav class="mbar" aria-label="Quick actions"><a href="tel:' + esc(S.contact.nonEmergency.replace(/[^0-9]/g, '')) + '">' + I('phone') + 'Call station</a><a href="#join">' + I('ladder') + 'Join</a><a href="#support">' + I('heart') + 'Donate</a></nav>';
  }

  /* The welcome (js/welcome.js). It opens on every visit until the visitor ticks "Don't show this again";
     `force` plays it regardless. With `once: true` in the data it shows a single time instead. */
  function welcome(force) {
    var w = S.welcome, FW = window.FireWelcome;
    if (!w || w.on === false || !FW) return;
    var key = 'welcome-off:' + (w.id || 'v1'), off = false;
    try { off = window.localStorage.getItem(key) === '1'; } catch (e) { /* storage blocked: show it */ }
    if (off && !force) return;
    FW.open({
      badge: emblem(), title: esc(w.title), text: esc(w.text || ''), button: esc(w.button || 'Take a look around'), still: state.still,
      links: (w.links || []).map(function (l) { return { href: esc(l.href), label: esc(l.label) }; }),
      note: S.concept ? esc(S.concept.badge + '. ' + S.concept.badgeNote) : esc(w.note || ''),
      again: w.once ? null : { label: esc(w.again || "Don't show this again"), checked: off },
      onClose: function (dont) {
        try { if (dont || w.once) window.localStorage.setItem(key, '1'); else window.localStorage.removeItem(key); } catch (e) { /* it will show again next visit */ }
      }
    });
  }
  function conceptMarks() {
    var c = S.concept, old = document.getElementById('concept-badge');
    if (old) old.remove();
    if (!c) return;
    Object.keys(c.sample || {}).forEach(function (id) {
      var sec = document.getElementById(id), h = sec && sec.querySelector('h2');
      if (h) h.insertAdjacentHTML('afterend', '<p class="sample-tag"><b>Sample</b> ' + esc(c.sample[id]) + '</p>');
    });
    document.body.insertAdjacentHTML('beforeend', '<aside class="concept-badge" id="concept-badge" aria-label="About this page"><b>' + esc(c.badge) + '</b><span>' + esc(c.badgeNote) + '</span>' + P.tourButton(S) + '</aside>');
  }
  function jsonLd() {
    if (S.concept) { var old = document.getElementById('ld'); if (old) old.remove(); return; }
    var c = S.contact, d = { '@context': 'https://schema.org', '@type': 'FireStation', name: S.company, foundingDate: S.founded ? String(S.founded) : undefined, telephone: c.nonEmergency, email: c.email, address: { '@type': 'PostalAddress', streetAddress: c.address, addressLocality: S.town, addressRegion: S.state } };
    var el = document.getElementById('ld');
    if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'ld'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(d);
  }

  function history() {
    var h = S.history;
    return '<section class="band band--dusk" id="history" aria-labelledby="his-h">' + sparks('dusk') + '<div class="wrap"><div class="head"><h2 id="his-h">' + esc(h.title) + '</h2></div><ol class="timeline">' +
      h.items.map(function (x, i) { return '<li style="--i:' + i + '"><b>' + esc(x.year) + '</b><strong>' + esc(x.title) + '</strong><p>' + esc(x.text) + '</p></li>'; }).join('') + '</ol></div></section>';
  }

  function contact() {
    var c = S.contact, f = S.contactForm;
    return '<section class="band band--concrete" id="contact" aria-labelledby="con-h"><div class="wrap"><div class="head"><h2 id="con-h">' + esc(f.title) + '</h2></div><div class="contact-grid"><div>' +
      (c.photo ? '<img class="contact-photo" src="' + esc(c.photo) + '" alt="' + esc(c.photoAlt || '') + '" loading="lazy">' : '') +
      (c.mapLink ? '<p class="contact-dir"><a class="btn btn--line" href="' + esc(c.mapLink) + '" target="_blank" rel="noopener">' + I('door') + '<span>Get directions to ' + esc(c.address) + '</span></a></p>' : '<div class="contact-map">' + A.map(S) + '</div>') + '<dl class="facts">' +
      '<div><dt>' + esc(f.stationLabel || ('Station ' + S.station)) + '</dt><dd>' + esc(c.address) + '<br>' + esc(c.cityLine) + '</dd></div>' +
      '<div><dt>Non-emergency</dt><dd>' + esc(c.nonEmergency) + '</dd></div>' +
      (c.extra || []).map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('') +
      (c.drill ? '<div><dt>Drill night</dt><dd>' + esc(c.drill) + '</dd></div>' : '') +
      (c.meeting ? '<div><dt>Company meeting</dt><dd>' + esc(c.meeting) + '</dd></div>' : '') +
      (c.email ? '<div><dt>Email</dt><dd>' + esc(c.email) + '</dd></div>' : '') +
      '<div><dt>Emergency</dt><dd>Call 911</dd></div></dl></div>' +
      '<form class="card form" data-form novalidate><label>Name<input name="name" autocomplete="name" required></label><label>Phone<input name="phone" type="tel" autocomplete="tel"></label>' +
      '<label class="full">Email<input name="email" type="email" autocomplete="email" required></label>' +
      '<label class="full">What is this about?<select name="topic" id="topic">' + f.topics.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') + '</select></label>' +
      '<label class="full">Message<textarea name="message"></textarea></label>' +
      '<button class="btn full" type="submit">Send message</button>' +
      '<p class="demo-note full" data-form-note hidden></p></form></div></div></section>';
  }

  function footer() {
    var c = S.contact;
    return '<footer class="site-footer">' + sparks('night') + '<div class="wrap"><div class="foot-grid">' +
      '<div class="foot-brand">' + emblem() + '<div><b>' + esc(S.company) + '</b><p>' + esc(c.address) + ', ' + esc(c.cityLine) + '<br>' + esc(c.nonEmergency) + '</p></div></div>' +
      '<div class="foot-col"><h3>The company</h3><ul><li><a href="#join">Join</a></li>' + (S.stations && S.stations.items && S.stations.items.length ? '<li><a href="#stations">Stations</a></li>' : '') + '<li><a href="#apparatus">Apparatus</a></li><li><a href="#officers">Officers</a></li><li><a href="#history">History</a></li></ul></div>' +
      '<div class="foot-col"><h3>For residents</h3><ul><li><a href="#safety">Fire safety</a></li><li><a href="#events">Events</a></li><li><a href="#support">Donate</a></li><li><a href="#partners">Partners</a></li></ul></div>' +
      '<div class="foot-col"><h3>Follow and sign in</h3><ul>' + c.social.map(function (s) { return '<li><a href="' + esc(s.url) + '">' + esc(s.label) + '</a></li>'; }).join('') + '<li><button type="button" data-open="members">Members\' area</button></li></ul></div></div>' +
      '<div class="foot-legal"><p class="foot-911">In an emergency, call 911. This website is not monitored.</p><p>&copy; ' + new Date().getFullYear() + ' ' + esc(S.company) + '.' + (S.footer.status === undefined ? ' A 501(c)(3) nonprofit.' : (S.footer.status ? ' ' + esc(S.footer.status) : '')) + (S.footer.builtBy ? ' ' + esc(S.footer.builtBy) : '') + '</p><p>' + esc(S.footer.sample) + '</p>' + (motionOn() || S.welcome ? '<p class="foot-tools">' + (motionOn() ? stillButton('foot-still') : '') + (S.welcome && S.welcome.on !== false ? '<button class="foot-still" type="button" data-welcome>' + I('play') + '<span>Play the welcome again</span></button>' : '') + '</p>' : '') + '</div></div><div class="chevrons" aria-hidden="true"></div></footer>';
  }

  function membersDialog() {
    return '<dialog id="members" aria-labelledby="mem-h"><div class="dlg"><h2 id="mem-h">Members\' area</h2><ul>' +
      ['Duty roster and drill sign-in', 'Training calendar and certificates', 'Truck checks and maintenance requests', 'Minutes, bylaws and SOGs'].map(function (x) { return '<li>' + I('check') + '<span>' + x + '</span></li>'; }).join('') +
      '</ul><p class="demo-note">Demo only. On a live site, members sign in here.</p><button class="btn btn--line" type="button" data-close>Close</button></div></dialog>';
  }

  /* ---------- template controls (delete this block for a live site) ---------- */
  var PRESETS = [
    { name: 'Red with a white cab', livery: { body: '#C4161C', upper: '#F5F3EC', stripe: '#E9B949', letter: '#E9B949' }, accent: '#C4161C' },
    { name: 'Black over red', livery: { body: '#B3131B', upper: '#16181D', stripe: '#F5F3EC', letter: '#E9B949' }, accent: '#B3131B' },
    { name: 'White with blue', livery: { body: '#F5F3EC', upper: '#F5F3EC', stripe: '#1D4E89', letter: '#1D4E89' }, accent: '#1D4E89' },
    { name: 'Forest green', livery: { body: '#1F5D3A', upper: '#F5F3EC', stripe: '#E9B949', letter: '#E9B949' }, accent: '#1F5D3A' }
  ];
  function controls() {
    var el = document.createElement('div');
    el.innerHTML = '<button class="tc-open" type="button" aria-expanded="false" aria-controls="tc">' + I('tune') + '<span>Template controls</span></button>' +
      '<div class="tc" id="tc" hidden><h2>Template controls</h2><p>Rename the town and repaint the rigs. The whole site re-letters itself.</p>' +
      '<div class="tc-row"><label>Town<input id="tc-town" maxlength="22" value="' + esc(RAW.town) + '"></label><label>Station<input id="tc-station" maxlength="3" value="' + esc(RAW.station) + '"></label></div>' +
      '<fieldset><legend>Rig colors</legend><div class="swatches">' + PRESETS.map(function (p, i) {
        return '<button class="swatch" type="button" data-preset="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + p.name + '" title="' + p.name + '"><span style="background:' + p.livery.upper + '"></span><span style="background:' + p.livery.body + '"></span><span style="background:' + p.livery.stripe + '"></span></button>';
      }).join('') + '</div></fieldset></div>';
    document.body.appendChild(el);
  }

  /* ---------- render ---------- */
  function theme() {
    var r = document.documentElement.style;
    r.setProperty('--accent', S.accent);
    r.setProperty('--accent-deep', shade(S.accent, 0.72));
    document.title = S.company + (S.concept ? ' (website concept, not the official site)' : (S.sampleBanner ? ' (sample site)' : ''));
  }
  function render() {
    S = resolve(RAW);
    theme();
    app.innerHTML = header() + '<main id="main">' + hero() + partnerBanner() + tasks() + P.feed(S) + stations() + calls() + P.year(S) + join() + P.neighbors(S) + apparatus() + officers() + safety() + P.lake(S, sparks('dusk')) + events() + P.santa(S, sparks('dusk')) + support() + partners() + gallery() + history() + contact() + '</main>' + footer() + mobileBar() + membersDialog() + P.dialogs(S);
    jsonLd();
    setTimeout(function () { app.querySelectorAll('.hero-img[data-src]').forEach(function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }); }, 1500);
    conceptMarks();
    P.mount(app, S);
    fitGearName();
    state.first = false;
    var root = document.documentElement, on = motionOn();
    root.classList.toggle('fx-on', on);
    root.classList.toggle('is-still', on && state.still);
    if (FX) { if (on) { FX.pause(state.still); FX.mount(app, { density: RAW.motion && RAW.motion.density }); } else FX.unmount(); }
  }
  function rerender() {
    var y = window.scrollY, active = document.activeElement && document.activeElement.id;
    render();
    window.scrollTo(0, y);
    if (active && document.getElementById(active)) document.getElementById(active).focus();
  }

  /* ---------- interactions (delegated, so they survive a re-render) ---------- */
  function showAd(i) {
    var ads = app.querySelectorAll('.pb-ad'), dots = app.querySelectorAll('.pb-dot');
    if (!ads.length) return;
    state.ad = (i + ads.length) % ads.length;
    ads.forEach(function (a, k) { var on = k === state.ad; a.classList.toggle('is-active', on); if (on) { a.removeAttribute('tabindex'); a.removeAttribute('aria-hidden'); } else { a.setAttribute('tabindex', '-1'); a.setAttribute('aria-hidden', 'true'); } });
    dots.forEach(function (d, k) { if (k === state.ad) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
  }
  function withUtm(url) {
    var u = S.partners.utm;
    if (!u || !/^https?:/.test(url)) return url;
    try { var x = new URL(url); if (!x.searchParams.has('utm_source')) { x.searchParams.set('utm_source', u.source); x.searchParams.set('utm_medium', u.medium || 'partner'); } return x.href; } catch (e) { return url; }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-rig],[data-station],[data-ad],[data-ad-pause],[data-topic],[data-open],[data-close],[data-amount],[data-donate],[data-still],[data-gear-zoom],[data-welcome],[data-preset],.nav-toggle,.tc-open,.pb-ad,.nav a');
    if (!t) return;
    if (t.matches('[data-rig]')) {
      state.rig = +t.getAttribute('data-rig');
      app.querySelectorAll('#apparatus .rig-tab').forEach(function (b, i) { var on = i === state.rig; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      var panel = document.getElementById('rig-panel'); panel.innerHTML = rigPanel(); panel.setAttribute('aria-labelledby', 'rig-tab-' + state.rig);
    } else if (t.matches('[data-station]')) {
      state.station = +t.getAttribute('data-station');
      app.querySelectorAll('#stations .rig-tab').forEach(function (b, i) { var on = i === state.station; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      var sp = document.getElementById('st-panel'); sp.innerHTML = stationPanel(); sp.setAttribute('aria-labelledby', 'st-tab-' + state.station);
    } else if (t.matches('[data-ad]')) { showAd(+t.getAttribute('data-ad')); }
    else if (t.matches('[data-ad-pause]')) {
      state.adPaused = !state.adPaused;
      t.innerHTML = I(state.adPaused ? 'play' : 'pause'); t.setAttribute('aria-label', state.adPaused ? 'Play partner rotation' : 'Pause partner rotation');
    } else if (t.matches('.pb-ad')) { var href = withUtm(t.getAttribute('href')); if (href !== t.getAttribute('href')) t.setAttribute('href', href); }
    else if (t.matches('[data-topic]')) { var sel = document.getElementById('topic'); if (sel) sel.value = t.getAttribute('data-topic'); }
    else if (t.matches('[data-open]')) { var d = document.getElementById(t.getAttribute('data-open')); if (d && d.showModal) d.showModal(); }
    else if (t.matches('[data-close]')) { t.closest('dialog').close(); }
    else if (t.matches('[data-amount]')) {
      state.amount = +t.getAttribute('data-amount');
      app.querySelectorAll('.amount').forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-amount') === state.amount); });
      app.querySelector('[data-donate] span').textContent = 'Donate ' + money(state.amount);
    } else if (t.matches('[data-donate]')) { document.getElementById('donate-note').hidden = false; }
    else if (t.matches('[data-still]')) { setStill(!state.still); }
    else if (t.matches('[data-gear-zoom]')) { setZoom(!state.zoom); }
    else if (t.matches('[data-welcome]')) { welcome(true); }
    else if (t.matches('.nav-toggle')) {
      var nav = document.getElementById('nav'), open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open); t.setAttribute('aria-expanded', open);
    } else if (t.matches('.nav a')) {
      document.getElementById('nav').classList.remove('is-open'); var nt = app.querySelector('.nav-toggle'); if (nt) nt.setAttribute('aria-expanded', 'false');
    } else if (t.matches('.tc-open')) {
      var tc = document.getElementById('tc'); tc.hidden = !tc.hidden; t.setAttribute('aria-expanded', !tc.hidden);
    } else if (t.matches('[data-preset]')) {
      var p = PRESETS[+t.getAttribute('data-preset')];
      RAW.livery = p.livery; RAW.accent = p.accent;
      document.querySelectorAll('.swatch').forEach(function (b) { b.setAttribute('aria-pressed', b === t); });
      rerender();
    }
  });

  document.addEventListener('keydown', function (e) {
    var tab = e.target.closest && e.target.closest('.rig-tab');
    if (!tab || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    var tabs = Array.prototype.slice.call(tab.parentNode.querySelectorAll('.rig-tab')), i = tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1);
    var next = tabs[(i + tabs.length) % tabs.length]; next.click(); next.focus(); e.preventDefault();
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'coat-name') {
      state.coat = e.target.value.trim();
      var box = document.getElementById('coat'), nm = state.coat || S.join.coatDefault;
      if (!setGearName() && box && !A.coatName(box, S, nm)) box.innerHTML = A.coat(S, nm);
    } else if (e.target.id === 'tc-town' || e.target.id === 'tc-station') {
      var town = document.getElementById('tc-town').value.trim(), st = document.getElementById('tc-station').value.trim();
      RAW.town = town || 'Your Town'; RAW.station = st || '1';
      rerender();
    }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    var note = f.querySelector('[data-form-note]'), name = f.elements.name.value.trim(), email = f.elements.email.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) { note.textContent = 'Add your name and a valid email address so we can reply.'; note.hidden = false; (name ? f.elements.email : f.elements.name).focus(); return; }
    note.textContent = 'Demo only. On a live site, "' + f.elements.topic.value + '" would now be in the company\'s inbox.'; note.hidden = false;
  });

  window.addEventListener('scroll', function () { var h = app.querySelector('.site-header'); if (h) h.classList.toggle('is-stuck', window.scrollY > 48); }, { passive: true });

  render();
  /* ?tour starts the guided tour instead of the welcome */
  setTimeout(function () { if (/[?&]tour\b/.test(window.location.search)) P.tour(); else welcome(/[?&]welcome\b/.test(window.location.search)); }, 900);
  if (RAW.templateControls !== false) controls();
  /* cross-fade the hero photos; "Pause motion" and reduced-motion both hold the current one */
  setInterval(function () {
    var imgs = app.querySelectorAll('.hero-media .hero-img');
    if (imgs.length < 2 || state.still || reduced || document.hidden) return;
    var next = (state.slide + 1) % imgs.length;
    if (imgs[next].hasAttribute('data-src') || !imgs[next].complete) return;
    state.slide = next;
    imgs.forEach(function (im, i) { im.classList.toggle('is-on', i === next); if (i === next) im.removeAttribute('aria-hidden'); else im.setAttribute('aria-hidden', 'true'); });
  }, ((RAW.hero && RAW.hero.slideSeconds) || 7) * 1000);
  setInterval(function () {
    if (state.adPaused || document.hidden) return;
    var frame = app.querySelector('.pb-frame'); if (!frame || frame.matches(':hover') || frame.contains(document.activeElement)) return;
    showAd(state.ad + 1);
  }, (RAW.partners.rotateSeconds || 7) * 1000);
})();
