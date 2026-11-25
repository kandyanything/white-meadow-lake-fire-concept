/* FireFX — the moving background behind the dark sections: gold embers that
   drift upward and platinum glints that catch the light.
   Each section that wants it carries <canvas class="fx-sparks" data-fx="…">,
   one screen tall and pinned while its section scrolls past (see site.css).
   A field only animates while it is on screen. Nothing moves for visitors who
   ask their device for reduced motion, or after "Pause motion" is pressed. */
(function () {
  'use strict';

  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var fields = [], running = false, paused = false, last = 0, io = null, ro = null, density = 1, sprites = null;
  var TAU = Math.PI * 2;

  /* how each kind of section is seeded: amount, share of platinum, rise speed */
  var KINDS = {
    hero:   { amount: 1.0, platinum: 0.18, speed: 1.15, glints: 0.8 },
    dusk:   { amount: 0.9, platinum: 0.38, speed: 1.0, glints: 1.0 },
    accent: { amount: 0.8, platinum: 0.3, speed: 0.9, glints: 1.0 },
    night:  { amount: 0.6, platinum: 0.45, speed: 0.8, glints: 0.9 }
  };

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* soft glowing dots, drawn once and stamped many times */
  function dot(stops) {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    stops.forEach(function (s) { r.addColorStop(s[0], s[1]); });
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function makeSprites() {
    return {
      gold: dot([[0, 'rgba(255,250,228,1)'], [0.16, 'rgba(248,212,116,.95)'], [0.45, 'rgba(233,185,73,.24)'], [1, 'rgba(233,185,73,0)']]),
      ember: dot([[0, 'rgba(255,238,196,1)'], [0.16, 'rgba(244,170,70,.95)'], [0.45, 'rgba(226,126,44,.22)'], [1, 'rgba(226,126,44,0)']]),
      platinum: dot([[0, 'rgba(255,255,255,1)'], [0.16, 'rgba(232,236,242,.92)'], [0.45, 'rgba(196,204,216,.2)'], [1, 'rgba(196,204,216,0)']])
    };
  }

  function Field(canvas) {
    this.c = canvas; this.g = canvas.getContext('2d'); this.on = false; this.w = 0; this.h = 0;
    this.k = KINDS[canvas.getAttribute('data-fx')] || KINDS.dusk;
    this.hero = canvas.getAttribute('data-fx') === 'hero';
    this.p = []; this.s = [];
    this.size();
  }
  Field.prototype.size = function () {
    var w = this.c.clientWidth, h = this.c.clientHeight, d = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h || (w === this.w && h === this.h)) return;
    if (w * h * d * d > 4.2e6) d = Math.sqrt(4.2e6 / (w * h));   /* keep very large screens light */
    this.w = w; this.h = h; this.d = d;
    this.c.width = Math.round(w * d); this.c.height = Math.round(h * d);
    this.seed();
    if (!running) this.draw(performance.now() / 1000, 0);
  };
  Field.prototype.ember = function (anywhere) {
    var r = Math.pow(Math.random(), 1.7) * 2.2 + 0.7, plat = Math.random() < this.k.platinum;
    return {
      x: rnd(0, this.w), y: anywhere ? rnd(0, this.h) : this.h + rnd(6, 40),
      r: r, v: (6 + r * 9) * this.k.speed * rnd(0.8, 1.25),
      ph: rnd(0, TAU), f: rnd(0.25, 0.8), amp: rnd(5, 16), tw: rnd(0.9, 2.6), a: rnd(0.5, 1),
      img: plat ? 'platinum' : (this.hero && Math.random() < 0.45 ? 'ember' : 'gold')
    };
  };
  Field.prototype.glint = function (now, first) {
    return {
      x: rnd(0.04, 0.96) * this.w, y: rnd(0.06, 0.94) * this.h, len: rnd(6, 15),
      t0: now + (first ? rnd(0, 5) : rnd(0.6, 4.5)), life: rnd(1.5, 2.8), rot: rnd(0, 0.8),
      img: Math.random() < 0.62 ? 'platinum' : 'gold'
    };
  };
  Field.prototype.seed = function () {
    var small = this.w < 620 ? 0.75 : 1, n = Math.round(this.w * this.h / 21000 * this.k.amount * density * small), i;
    n = Math.max(8, Math.min(90, n));
    var m = Math.max(3, Math.min(22, Math.round(n / 3.6 * this.k.glints))), now = performance.now() / 1000;
    this.p = []; for (i = 0; i < n; i++) this.p.push(this.ember(true));
    this.s = []; for (i = 0; i < m; i++) this.s.push(this.glint(now, true));
  };
  Field.prototype.draw = function (t, dt) {
    var g = this.g, w = this.w, h = this.h, i, e, a, sz, k, env, L, q;
    if (!w || !sprites) return;
    g.setTransform(this.d, 0, 0, this.d, 0, 0);
    g.clearRect(0, 0, w, h);
    g.globalCompositeOperation = 'lighter';
    for (i = 0; i < this.p.length; i++) {
      e = this.p[i];
      e.y -= e.v * dt;
      e.x += (Math.sin(t * e.f + e.ph) * e.amp + 3) * dt;
      if (e.y < -14) { this.p[i] = e = this.ember(false); }
      if (e.x > w + 14) e.x = -14; else if (e.x < -14) e.x = w + 14;
      a = e.a * (0.62 + 0.38 * Math.sin(t * e.tw + e.ph)) * Math.min(1, (h - e.y + 30) / 90, (e.y + 14) / 110);
      if (a <= 0.01) continue;
      sz = e.r * 9;
      g.globalAlpha = a;
      g.drawImage(sprites[e.img], e.x - sz / 2, e.y - sz / 2, sz, sz);
    }
    for (i = 0; i < this.s.length; i++) {
      q = this.s[i]; k = (t - q.t0) / q.life;
      if (k < 0) continue;
      if (k >= 1) { this.s[i] = this.glint(t, false); continue; }
      env = Math.pow(Math.sin(Math.PI * k), 1.6); L = q.len * (0.35 + 0.65 * env);
      g.save();
      g.translate(q.x, q.y); g.rotate(q.rot + k * 0.7);
      g.globalAlpha = env * 0.85;
      g.drawImage(sprites[q.img], -L * 1.7, -L * 1.7, L * 3.4, L * 3.4);
      g.fillStyle = q.img === 'gold' ? '#FFF2C4' : '#FFFFFF';
      star(g, L, 0.1);
      g.rotate(Math.PI / 4); g.globalAlpha = env * 0.55;
      star(g, L * 0.42, 0.16);
      g.restore();
    }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  };
  function star(g, L, thin) {
    var w = L * thin;
    g.beginPath();
    g.moveTo(0, -L); g.lineTo(w, -w); g.lineTo(L, 0); g.lineTo(w, w);
    g.lineTo(0, L); g.lineTo(-w, w); g.lineTo(-L, 0); g.lineTo(-w, -w);
    g.closePath(); g.fill();
  }

  function frame(now) {
    if (!running) return;
    var t = now / 1000, dt = Math.min(0.05, Math.max(0, (now - last) / 1000)), any = false, i;
    last = now;
    for (i = 0; i < fields.length; i++) if (fields[i].on) { fields[i].draw(t, dt); any = true; }
    if (any && !paused && !document.hidden) requestAnimationFrame(frame); else running = false;
  }
  function kick() {
    if (running || paused || reduce.matches || document.hidden || !fields.length) return;
    running = true; last = performance.now(); requestAnimationFrame(frame);
  }

  function unmount() {
    if (io) io.disconnect();
    if (ro) ro.disconnect();
    io = ro = null; fields = []; running = false;
  }
  function mount(root, o) {
    unmount();
    o = o || {};
    density = o.density > 0 ? o.density : 1;
    var list = (root || document).querySelectorAll('canvas.fx-sparks');
    if (!list.length || !window.requestAnimationFrame) return;
    if (!sprites) sprites = makeSprites();
    fields = Array.prototype.map.call(list, function (c) { return new Field(c); });
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function (entries) {
        entries.forEach(function (en) { fields.forEach(function (f) { if (f.c === en.target) f.size(); }); });
      });
      fields.forEach(function (f) { ro.observe(f.c); });
    }
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { fields.forEach(function (f) { if (f.c === en.target) f.on = en.isIntersecting; }); });
        kick();
      }, { rootMargin: '80px 0px' });
      fields.forEach(function (f) { io.observe(f.c); });
    } else { fields.forEach(function (f) { f.on = true; }); kick(); }
  }
  /* Stop or restart the movement. Paused fields keep their last frame. */
  function pause(v) { paused = !!v; if (!paused) kick(); }

  document.addEventListener('visibilitychange', kick);
  if (reduce.addEventListener) reduce.addEventListener('change', kick);

  window.FireFX = { mount: mount, unmount: unmount, pause: pause };
})();
