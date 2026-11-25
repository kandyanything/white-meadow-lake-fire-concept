/* FireWelcome — the first-visit welcome.
   The department's badge is on fire. A hose stream comes in and knocks the fire down,
   and the welcome message appears once it is out. The visitor can aim the hose by
   moving the pointer or a finger; left alone, the hose finds the fire by itself.

   The flames are not a picture or a video. They are computed every frame (WebGL) from
   the outline of whichever badge the site uses, so any department's patch burns in its
   own shape, and the fire dies exactly where water has landed.

   Nothing moves for visitors whose device asks for reduced motion: they get the badge
   and the message straight away. */
(function () {
  'use strict';

  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  /* where the badge sits inside the stage, as fractions of the stage */
  var ASPECT = 0.8, BX = 0.32, BY = 0.47, BW = 0.36;
  var MW = 256, MH = Math.round(MW * ASPECT);      /* badge outline, for the flames */
  var WW = 128, WH = Math.round(WW * ASPECT);      /* where water has landed */

  var VS = 'attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }';
  var FS = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', '#else', 'precision mediump float;', '#endif',
    'uniform sampler2D uMask, uWet; uniform float uTime, uHeat; varying vec2 v;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }',
    'float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; } return s; }',
    'void main(){',
    '  vec2 uv = v; float t = uTime;',
    /* turbulence that rises, warped by a slower one so tongues curl, split and lean */
    '  vec2 q = vec2(uv.x * 3.1, uv.y * 2.2 - t * 1.75);',
    '  vec2 w = vec2(fbm(q * 1.2 + vec2(0., -t * .5)), fbm(q * 1.2 + vec2(5.2, -t * .8)));',
    '  float n1 = fbm(q * 1.6 + (w - .5) * 1.9);',
    '  float n2 = fbm(q * 3.5 + (w - .5) * 2.5 + vec2(3.1, -t * 2.));',
    '  float n3 = fbm(q * 7. + vec2(1.3, -t * 3.1));',
    /* fuel: how much dry, burning badge lies below this point (flames climb from it) */
    '  float fuel = 0.;',
    '  for (int i = 0; i < 18; i++){',
    '    float k = (float(i) + .5) / 18.;',
    /* looking down and outward from here, so the fire draws in to a point as it climbs */
    '    vec2 pp = vec2(.5 + (uv.x - .5) * (1. + k * 1.25), uv.y) - vec2((n1 - .5) * .26 * k + (n2 - .5) * .1 * k, k * .58);',
    '    fuel += texture2D(uMask, pp).a * (1. - texture2D(uWet, pp).r) * (1. - k * .7);',
    '  }',
    /* small patches still burn hard: a lone arm of the badge keeps its own flame until water reaches it */
    '  fuel = 1.12 * pow(fuel / 11.7, .62);',
    '  float here = texture2D(uMask, uv).a * (1. - texture2D(uWet, uv).r);',
    '  float flick = .88 + .12 * sin(t * 12. + uv.x * 8.) * sin(t * 7.3 + 1.7);',
    '  float f = fuel * (.72 + 1.55 * n1) - (.33 + .62 * n2) + (n3 - .5) * .16 * fuel;',
    '  f = max(f, 0.) * uHeat * flick * 1.3;',
    '  float val = f + here * (.1 + .32 * n2) * uHeat;',
    /* black-body-ish ramp: deep red at the edges, orange, yellow, near white at the heart */
    '  vec3 c = vec3(0.);',
    '  c = mix(c, vec3(.42, .02, 0.), smoothstep(.02, .22, val));',
    '  c = mix(c, vec3(.95, .26, .01), smoothstep(.16, .5, val));',
    '  c = mix(c, vec3(1., .62, .1), smoothstep(.42, .86, val));',
    '  c = mix(c, vec3(1., .9, .55), smoothstep(.8, 1.25, val));',
    '  c = mix(c, vec3(1., .98, .9), smoothstep(1.2, 1.8, val));',
    '  float a = smoothstep(.02, .4, val);',
    '  a *= mix(1., .7, here);',                            /* let the badge show through flames that sit on it */
    '  float haze = fuel * fuel * uHeat * .3;',                   /* a soft red glow in the air around the fire */
    '  gl_FragColor = vec4(c * a + vec3(.55, .12, .02) * haze * (1. - a), max(a, haze * .45));',
    '}'
  ].join('\n');

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function soft(stops) {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    stops.forEach(function (s) { r.addColorStop(s[0], s[1]); });
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return c;
  }

  var live = null;

  function open(cfg) {
    close();
    var d = el('dialog', 'wl'); d.id = 'welcome'; d.setAttribute('aria-labelledby', 'wl-h');
    var still = reduce.matches || !!cfg.still;
    d.innerHTML =
      '<button class="wl-x" type="button" data-wl-close aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>' +
      '<div class="wl-stage" aria-hidden="true"><div class="wl-glow"></div><div class="wl-badge">' + cfg.badge + '</div>' +
      (still ? '' : '<canvas class="wl-fire"></canvas><canvas class="wl-fx"></canvas><p class="wl-hint">Move or tap to aim the hose</p>') + '</div>' +
      '<div class="wl-fold"><div class="wl-copy"><h2 id="wl-h">' + cfg.title + '</h2>' + (cfg.text ? '<p>' + cfg.text + '</p>' : '') +
      (cfg.links && cfg.links.length ? '<ul class="wl-links">' + cfg.links.map(function (l) { return '<li><a href="' + l.href + '" data-wl-close>' + l.label + '</a></li>'; }).join('') + '</ul>' : '') +
      '<div class="wl-actions"><button class="btn btn--gold" type="button" data-wl-close>' + (cfg.button || 'Take a look around') + '</button></div>' +
      (cfg.note ? '<p class="wl-note">' + cfg.note + '</p>' : '') + '</div></div>' +
      (still ? '' : '<button class="wl-skip" type="button" data-wl-skip>Skip the fire</button>');
    document.body.appendChild(d);
    if (still) d.classList.add('is-static');
    d.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-wl-close],[data-wl-skip]') : null;
      if (t && t.hasAttribute('data-wl-skip')) { if (live && live.finish) live.finish(); return; }
      if (t || e.target === d) close();
    });
    d.addEventListener('close', function () { if (live && live.d === d) close(); if (cfg.onClose) cfg.onClose(); });
    live = { d: d };
    d.tabIndex = -1;
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    try { d.focus({ preventScroll: true }); } catch (e) { /* older browsers focus the first button instead */ }
    if (!still) run(d, live);
    return d;
  }

  function close() {
    if (!live) return;
    var l = live; live = null;
    if (l.stop) l.stop();
    if (l.d.open && l.d.close) { try { l.d.close(); } catch (e) { /* already closing */ } }
    if (l.d.parentNode) l.d.parentNode.removeChild(l.d);
  }

  /* Turn the badge on the page (an <img> or an inline <svg>) into an image we can read the outline of. */
  function badgeImage(node, done) {
    var im = new Image();
    im.onload = function () {
      if (node.parentNode) { node.parentNode.style.setProperty('--wl-mask', 'url("' + im.src + '")'); node.parentNode.classList.add('has-mask'); }
      done(im);
    };
    im.onerror = function () { done(null); };
    try {
      if (node && node.tagName && node.tagName.toLowerCase() === 'img') { im.src = node.currentSrc || node.src; }
      else if (node) {
        var c = node.cloneNode(true), vb = (c.getAttribute('viewBox') || '0 0 100 100').split(/[ ,]+/).map(Number), k = 512 / Math.max(vb[2] || 100, vb[3] || 100);
        c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.setAttribute('width', Math.round((vb[2] || 100) * k)); c.setAttribute('height', Math.round((vb[3] || 100) * k));
        im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(c));
      }
      else done(null);
    } catch (e) { done(null); }
  }

  function run(d, L) {
    var stage = d.querySelector('.wl-stage'), fireC = d.querySelector('.wl-fire'), fxC = d.querySelector('.wl-fx');
    var badge = d.querySelector('.wl-badge').firstElementChild;
    var raf = 0, stopped = false, t0 = performance.now(), last = t0;
    var W = 1, H = 1, U = 1, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var heat = 0, remaining = 1, phase = 'burn', outAt = 0, sampleAt = 0, sprayAt = 0;
    var aim = { x: 0.5, y: 0.7, ux: 0.5, uy: 0.7, userAt: -9 }, target = { x: 0.5, y: 0.7 };
    var drops = [], steam = [], sparks = [], drips = [];
    var gl = null, prog = null, uTime, uHeat, wetTex = null, wetDirty = true;

    var mask = document.createElement('canvas'); mask.width = MW; mask.height = MH;
    var small = document.createElement('canvas'); small.width = WW; small.height = WH;
    var wet = document.createElement('canvas'); wet.width = WW; wet.height = WH;
    var wg = wet.getContext('2d', { willReadFrequently: true }), alpha = null, total = 1;
    var GR = 12, cell = new Float32Array(GR * GR), cx = new Float32Array(GR * GR), cy = new Float32Array(GR * GR), held = -1;
    wg.fillStyle = '#000'; wg.fillRect(0, 0, WW, WH);
    var fx = fxC.getContext('2d');
    var puff = soft([[0, 'rgba(255,255,255,.9)'], [0.4, 'rgba(236,240,246,.42)'], [1, 'rgba(236,240,246,0)']]);
    var ember = soft([[0, 'rgba(255,246,214,1)'], [0.25, 'rgba(255,180,70,.9)'], [0.6, 'rgba(240,110,30,.2)'], [1, 'rgba(240,110,30,0)']]);
    var mistS = soft([[0, 'rgba(214,234,255,.5)'], [0.45, 'rgba(188,218,250,.2)'], [1, 'rgba(188,218,250,0)']]);
    var wetDot = soft([[0, 'rgba(255,255,255,.95)'], [0.5, 'rgba(255,255,255,.5)'], [1, 'rgba(255,255,255,0)']]);

    function size() {
      var r = stage.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); U = W / 520;
      fxC.width = Math.round(W * dpr); fxC.height = Math.round(H * dpr);
      var fd = Math.min(dpr, 1.25);                       /* flames are soft: no need for full resolution */
      fireC.width = Math.round(W * fd); fireC.height = Math.round(H * fd);
      if (gl) gl.viewport(0, 0, fireC.width, fireC.height);
    }

    function setMask(im) {
      var g = mask.getContext('2d'); g.clearRect(0, 0, MW, MH);
      var s = BW * MW, x = BX * MW, y = BY * MH, ok = false;
      if (im) {
        try {
          if ('filter' in g) g.filter = 'blur(2.2px)';
          var iw = im.naturalWidth || s, ih = im.naturalHeight || s, k = Math.min(s / iw, s / ih);
          g.drawImage(im, x + (s - iw * k) / 2, y + (s - ih * k) / 2, iw * k, ih * k);
          g.getImageData(0, 0, 1, 1); ok = true;         /* throws if the browser will not let us read the badge */
        } catch (e) { ok = false; }
      }
      if (!ok) {                                         /* fall back to a plain disc */
        mask = document.createElement('canvas'); mask.width = MW; mask.height = MH; g = mask.getContext('2d');
        g.fillStyle = '#fff'; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * 0.47, 0, 6.2832); g.fill();
      }
      var sg = small.getContext('2d'); sg.clearRect(0, 0, WW, WH); sg.drawImage(mask, 0, 0, WW, WH);
      var id = sg.getImageData(0, 0, WW, WH).data; alpha = new Float32Array(WW * WH); total = 0;
      for (var i = 0; i < alpha.length; i++) { alpha[i] = id[i * 4 + 3] / 255; if (alpha[i] >= 0.3) total += alpha[i]; }
      total = Math.max(total, 1);
    }

    function initGL() {
      try { gl = fireC.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false }) || fireC.getContext('experimental-webgl'); } catch (e) { gl = null; }
      if (!gl) return false;
      function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
      var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
      if (!vs || !fs) { gl = null; return false; }
      prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; return false; }
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uTime = gl.getUniformLocation(prog, 'uTime'); uHeat = gl.getUniformLocation(prog, 'uHeat');
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      function tex(unit, src) {
        var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); return t;
      }
      try { tex(0, mask); wetTex = tex(1, wet); } catch (e) { gl = null; return false; }
      gl.uniform1i(gl.getUniformLocation(prog, 'uMask'), 0); gl.uniform1i(gl.getUniformLocation(prog, 'uWet'), 1);
      gl.viewport(0, 0, fireC.width, fireC.height);
      gl.clearColor(0, 0, 0, 0);
      return true;
    }

    function burning(nx, ny) {       /* is there dry badge at this point of the stage? */
      var x = Math.floor(nx * WW), y = Math.floor(ny * WH);
      return x >= 0 && y >= 0 && x < WW && y < WH && alpha ? alpha[y * WW + x] : 0;
    }
    function douse(nx, ny) { var r = 8; wg.globalCompositeOperation = 'lighter'; wg.globalAlpha = 0.024; wg.drawImage(wetDot, nx * WW - r, ny * WH - r, r * 2, r * 2); wg.globalAlpha = 1; wetDirty = true; }

    /* how much fire is left, and where the bulk of it is (the hose aims there when left alone) */
    function survey() {
      var id = wg.getImageData(0, 0, WW, WH).data, left = 0, i, a, c, x, y, best = -1, bs = 0, sc, dxy;
      for (i = 0; i < GR * GR; i++) { cell[i] = 0; cx[i] = 0; cy[i] = 0; }
      for (i = 0; i < alpha.length; i++) {
        if (alpha[i] < 0.3) continue;
        a = alpha[i] * (1 - id[i * 4] / 255); if (a < 0.04) continue;
        x = i % WW; y = (i - x) / WW; c = Math.floor(y * GR / WH) * GR + Math.floor(x * GR / WW);
        left += a; cell[c] += a; cx[c] += a * x; cy[c] += a * y;
      }
      remaining = left / total;
      /* go for the biggest patch still burning: the one in hand first, then the nearest, low ones before high ones */
      for (c = 0; c < GR * GR; c++) {
        if (cell[c] <= 0) continue;
        x = cx[c] / cell[c] / WW; y = cy[c] / cell[c] / WH; dxy = Math.sqrt((x - aim.x) * (x - aim.x) + (y - aim.y) * (y - aim.y));
        sc = cell[c] * (1 + 0.7 * Math.max(0, 1 - dxy / 0.25)) * (0.8 + 0.5 * y) * (c === held ? 1.5 : 1);
        if (sc > bs) { bs = sc; best = c; }
      }
      if (best >= 0) { held = best; target.x = cx[best] / cell[best] / WW; target.y = cy[best] / cell[best] / WH; }
    }

    function finish() {
      if (phase === 'out') return;
      if (phase === 'burn') sprayAt = performance.now();
      phase = 'out'; outAt = performance.now();
      wg.globalCompositeOperation = 'source-over'; wg.globalAlpha = 1; wg.fillStyle = '#fff'; wg.fillRect(0, 0, WW, WH); wetDirty = true;
      d.classList.add('is-out'); d.setAttribute('data-phase', 'out');
      var i, bx = BX * W, by = BY * H, s = BW * W;
      for (i = 0; i < 34; i++) steam.push({ x: bx + Math.random() * s, y: by + Math.random() * s * 0.8, vx: (Math.random() - 0.5) * 40 * U, vy: (-40 - Math.random() * 90) * U, r: (16 + Math.random() * 22) * U, g: (26 + Math.random() * 30) * U, t: 0, life: 1.6 + Math.random() * 1.8, a: 0.1 + Math.random() * 0.14 });
      for (i = 0; i < 7; i++) drips.push({ x: bx + s * (0.12 + Math.random() * 0.76), y: by + s * (0.55 + Math.random() * 0.4), vy: (10 + Math.random() * 30) * U, wait: Math.random() * 1.3 });
    }
    L.finish = finish;

    function frame(now) {
      if (stopped) return;
      var t = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000), i, p, n, k; last = now;
      var S = W;   /* the stage's width is the yardstick for speeds */

      /* --- the plan: let the fire take hold, then bring the hose in --- */
      if (phase === 'burn' && (t > 2.1 || now / 1000 - aim.userAt < 0.2)) { phase = 'spray'; sprayAt = now; d.setAttribute('data-phase', 'spray'); }
      if (phase === 'spray') {
        if (now - sampleAt > 100) { sampleAt = now; survey(); }
        if (remaining < 0.09 || now - sprayAt > 4000) finish();
      }
      var user = now / 1000 - aim.userAt < 1.4;
      var gx = user ? aim.ux : target.x, gy = user ? aim.uy : target.y;
      aim.x += (gx - aim.x) * Math.min(1, dt * (user ? 14 : 8)); aim.y += (gy - aim.y) * Math.min(1, dt * (user ? 14 : 8));
      if (phase === 'out') heat = Math.max(0, heat - dt * 1.7);
      else heat = phase === 'spray' ? 0.62 + 0.38 * Math.min(1, remaining * 1.4) : Math.min(1, 0.15 + t * 1.5);
      d.style.setProperty('--heat', heat.toFixed(3));
      d.style.setProperty('--glow', (heat * (0.8 + 0.2 * Math.sin(t * 13) * Math.sin(t * 7.1 + 1) + 0.06 * Math.sin(t * 31))).toFixed(3));
      d.setAttribute('data-left', remaining.toFixed(2));

      /* --- water: a hose stream thrown in an arc from off the left edge --- */
      var spraying = phase === 'spray' || (phase === 'out' && now - outAt < 260);
      var grav = 1.15 * S;
      if (spraying) {
        var nx0 = -0.05 * W, ny0 = 0.99 * H, tx = aim.x * W, ty = aim.y * H, v0 = 2.1 * S;
        var dist = Math.sqrt((tx - nx0) * (tx - nx0) + (ty - ny0) * (ty - ny0)), tf = dist / v0;
        var dx = tx - nx0, dy = ty - ny0 - 0.5 * grav * tf * tf, base = Math.atan2(dy, dx);
        var ramp = Math.min(1, (now - sprayAt) / 260);       /* the stream builds as the nozzle opens */
        n = Math.round(760 * dt * ramp);
        for (i = 0; i < n; i++) {
          var tight = Math.random() < 0.72, ang = base + (Math.random() - 0.5) * (tight ? 0.05 : 0.2), sp = v0 * (tight ? 0.95 + Math.random() * 0.1 : 0.7 + Math.random() * 0.3), back = Math.random() * dt;
          p = { x: nx0, y: ny0, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, t: 0, life: 1.4, land: tf * (v0 / sp) * (0.93 + Math.random() * 0.14), core: tight, splash: false };
          p.x += p.vx * back; p.y += p.vy * back; drops.push(p);
        }
      }
      fx.setTransform(dpr, 0, 0, dpr, 0, 0); fx.clearRect(0, 0, W, H);
      fx.globalCompositeOperation = 'lighter'; fx.lineCap = 'round';
      var keep = [], path = new Path2D(), fine = new Path2D(), rr;
      for (i = 0; i < drops.length; i++) {
        p = drops[i]; p.t += dt; p.vy += grav * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.t > p.life || p.y > H + 40 || p.x > W + 40 || p.x < -60) continue;
        if (!p.splash && p.t >= p.land) {
          var hot = burning(p.x / W, p.y / H) > 0.3;
          if (hot) douse(p.x / W, p.y / H);
          if (hot && heat > 0.08 && steam.length < 150 && Math.random() < 0.34) steam.push({ x: p.x + (Math.random() - 0.5) * 14 * U, y: p.y + (Math.random() - 0.5) * 10 * U, vx: (Math.random() - 0.5) * 70 * U + p.vx * 0.05, vy: (-60 - Math.random() * 150) * U, r: (5 + Math.random() * 9) * U, g: (22 + Math.random() * 40) * U, t: 0, life: 1 + Math.random() * 1.4, a: 0.05 + Math.random() * 0.1 });
          if (Math.random() < 0.6) { p.splash = true; p.core = false; var sa = Math.random() * 6.283, ss = (0.15 + Math.random() * 0.5) * S; p.vx = Math.cos(sa) * ss; p.vy = Math.sin(sa) * ss - 0.25 * S; p.life = p.t + 0.3 + Math.random() * 0.35; }
          else continue;
        }
        /* a soft body that swells into mist as the water travels, and a bright core near the nozzle */
        rr = ((p.core ? 3.2 : 2.2) + p.t * (p.splash ? 26 : 34)) * U;
        fx.globalAlpha = Math.max(0, (p.core ? 0.5 : 0.3) - p.t * (p.splash ? 0.7 : 0.42));
        if (fx.globalAlpha > 0.012) fx.drawImage(mistS, p.x - rr, p.y - rr, rr * 2, rr * 2);
        k = 0.016;
        if (p.core && p.t < 0.5) { path.moveTo(p.x - p.vx * k, p.y - p.vy * k); path.lineTo(p.x, p.y); }
        else if (i % 4 === 0) { fine.moveTo(p.x - p.vx * k * 0.6, p.y - p.vy * k * 0.6); fine.lineTo(p.x, p.y); }
        keep.push(p);
      }
      drops = keep; fx.globalAlpha = 1;
      fx.strokeStyle = 'rgba(196,224,252,.16)'; fx.lineWidth = 4.2 * U; fx.stroke(path);
      fx.strokeStyle = 'rgba(236,246,255,.2)'; fx.lineWidth = Math.max(1, 1.5 * U); fx.stroke(path);
      fx.strokeStyle = 'rgba(226,240,255,.3)'; fx.lineWidth = Math.max(0.8, 1.1 * U); fx.stroke(fine);

      /* --- sparks thrown up by the fire --- */
      if (heat > 0.25 && Math.random() < dt * 34 * heat) sparks.push({ x: (BX + Math.random() * BW) * W, y: (BY + Math.random() * 0.2) * H, vx: (Math.random() - 0.5) * 60 * U, vy: -(120 + Math.random() * 200) * U, t: 0, life: 0.7 + Math.random() * 1, r: (1 + Math.random() * 1.8) * Math.max(0.75, U), ph: Math.random() * 6.3 });
      keep = [];
      for (i = 0; i < sparks.length; i++) {
        p = sparks[i]; p.t += dt; if (p.t > p.life) continue;
        p.x += (p.vx + Math.sin(p.t * 9 + p.ph) * 40 * U) * dt; p.y += p.vy * dt; p.vy *= (1 - dt * 0.6);
        fx.globalAlpha = Math.min(1, (1 - p.t / p.life) * 1.4); fx.drawImage(ember, p.x - p.r * 3, p.y - p.r * 3, p.r * 6, p.r * 6); keep.push(p);
      }
      sparks = keep;

      /* --- steam where water meets fire --- */
      fx.globalCompositeOperation = 'source-over'; keep = [];
      for (i = 0; i < steam.length; i++) {
        p = steam[i]; p.t += dt; if (p.t > p.life) continue;
        k = p.t / p.life; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= (1 - dt * 0.9); p.vy *= (1 - dt * 0.35);
        var rr = p.r + p.g * k * 1.6;
        fx.globalAlpha = p.a * Math.sin(Math.PI * Math.min(1, k * 1.15)) * (1 - k * 0.4);
        fx.drawImage(puff, p.x - rr, p.y - rr, rr * 2, rr * 2); keep.push(p);
      }
      steam = keep; fx.globalAlpha = 1;

      /* --- water running off the badge once the fire is out --- */
      if (phase === 'out') {
        fx.globalCompositeOperation = 'lighter'; fx.strokeStyle = 'rgba(210,232,255,.55)'; fx.lineWidth = 1.6; fx.beginPath();
        for (i = 0; i < drips.length; i++) {
          p = drips[i]; if (p.wait > 0) { p.wait -= dt; continue; }
          p.vy += 620 * U * dt; p.y += p.vy * dt; if (p.y > H + 20) continue;
          fx.moveTo(p.x, p.y - Math.min(16 * U, p.vy * 0.03)); fx.lineTo(p.x, p.y);
        }
        fx.stroke();
      }

      /* --- the fire --- */
      if (gl) {
        if (wetDirty) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, wetTex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wet); wetDirty = false; }
        gl.uniform1f(uTime, t); gl.uniform1f(uHeat, heat);
        gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (phase === 'out' && now - outAt > 4200 && !steam.length && !drops.length) { stopped = true; return; }
      raf = requestAnimationFrame(frame);
    }

    function point(e) {
      var r = stage.getBoundingClientRect();
      aim.ux = (e.clientX - r.left) / r.width; aim.uy = (e.clientY - r.top) / r.height; aim.userAt = performance.now() / 1000;
      d.classList.add('is-aimed');
    }
    stage.addEventListener('pointermove', point);
    stage.addEventListener('pointerdown', point);
    window.addEventListener('resize', size);

    L.stop = function () {
      stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', size);
      if (gl) { var ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
    };

    size();
    badgeImage(badge, function (im) {
      if (stopped) return;
      setMask(im);
      if (!initGL()) {
        L.stop(); d.classList.add('is-static');
        [fireC, fxC, d.querySelector('.wl-hint'), d.querySelector('.wl-skip')].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
        return;
      }
      t0 = last = performance.now();
      raf = requestAnimationFrame(frame);
    });
  }

  window.FireWelcome = { open: open, close: close };
})();
