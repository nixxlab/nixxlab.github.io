/**
 * The sky behind every page (decorative; it lives in the aria-hidden art layer).
 *
 * Layers, back to front: stars and two nebulae; the flower-of-life lattice with octagrams at some nodes;
 * a vortex of living glyphs flowing into the seal; the seal — the seed of life inside the eight-pointed
 * star of Alatyr, with glyphs at its points and a ring of glyphs around it.
 *
 * One canvas keeps running across client-side navigations (transition:persist). It pauses while the tab
 * is hidden and draws a single still frame under prefers-reduced-motion.
 */

type Pointer = { x: number; y: number };

const TAU = Math.PI * 2;
const gold = (a: number) => `rgba(217, 172, 92, ${a})`;

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.stroke();
}

/** The eight-pointed star of Alatyr: two overlapping squares, a point at angle `rot`. */
function octagram(ctx: CanvasRenderingContext2D, r: number, rot: number) {
  for (const extra of [0, Math.PI / 4]) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = rot + extra + (i * TAU) / 4;
      ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

// ---------- the sky: stars with parallax by depth, two slow nebulae ----------

const stars = Array.from({ length: 420 }, () => ({
  x: Math.random(),
  y: Math.random(),
  z: Math.random() ** 2, // depth: 0 far … 1 near
  ph: Math.random() * TAU,
}));

function sky(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, m: Pointer) {
  ctx.fillStyle = '#05060b';
  ctx.fillRect(0, 0, w, h);
  for (const [cx, cy, r, c] of [
    [0.2 + 0.05 * Math.sin(t * 0.00004), 0.75, 0.6, '70, 60, 140'],
    [0.85, 0.2 + 0.05 * Math.cos(t * 0.00003), 0.5, '150, 100, 40'],
  ] as const) {
    const g = ctx.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, r * Math.max(w, h));
    g.addColorStop(0, `rgba(${c}, 0.16)`);
    g.addColorStop(1, `rgba(${c}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  for (const s of stars) {
    const px = ((s.x + t * 0.000004 * (0.3 + s.z)) % 1) * w + (m.x - 0.5) * 40 * s.z;
    const py = s.y * h + (m.y - 0.5) * 40 * s.z;
    const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0015 * (0.5 + s.z) + s.ph);
    ctx.fillStyle = `rgba(235, 228, 210, ${(0.15 + 0.75 * s.z) * twinkle})`;
    ctx.beginPath();
    ctx.arc(px, py, 0.3 + 1.3 * s.z, 0, TAU);
    ctx.fill();
  }
}

// ---------- living glyphs: runes, half-width katakana, marks of logic and alchemy ----------

const GLYPHS = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ' + 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ' + '01∴∵⊕⊗∇∆λ';
const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
const glyphFont = (px: number) => `${px}px 'Hiragino Sans', 'Apple Symbols', 'Noto Sans Runic', 'Segoe UI Symbol', monospace`;

type Cell = { c: string; ph: number };
const cells = (n: number): Cell[] => Array.from({ length: n }, () => ({ c: pick(), ph: Math.random() * TAU }));

/** Each glyph turns into another with probability `p` per frame. */
function mutate(list: { c: string }[], p: number) {
  for (const cell of list) if (Math.random() < p) cell.c = pick();
}

/** Brightness at position `pos` (0…1) along a ring: a dim breathing base, plus bright heads running round. */
function glow(pos: number, t: number, ph: number, speed: number, heads: number) {
  const d = (((pos * heads - t * speed) % 1) + 1) % 1; // 0 at a head, growing behind it
  const trail = d < 0.25 ? (1 - d / 0.25) ** 2 : 0;
  return { a: 0.1 + 0.08 * Math.sin(t * 0.003 + ph) + 0.8 * trail, hot: trail > 0.75 };
}

function fillGlyph(ctx: CanvasRenderingContext2D, g: { a: number; hot: boolean }, c: string, x: number, y: number) {
  ctx.fillStyle = g.hot ? `rgba(255, 246, 222, ${g.a})` : gold(g.a);
  ctx.fillText(c, x, y);
}

// ---------- the lattice: flower of life over the whole sky, octagrams burning at some nodes ----------

const NODES = Array.from({ length: 400 }, () => Math.random() < 0.05);
// The circles never change, so they are drawn once per size into an offscreen canvas and only slid each frame.
let latticeCache: { key: string; img: HTMLCanvasElement; r: number; dy: number } | null = null;

function latticeImage(w: number, h: number, dpr: number) {
  const r = Math.max(70, Math.min(w, h) * 0.12);
  const dy = r * Math.sin(Math.PI / 3);
  const key = `${w}x${h}@${dpr}`;
  if (latticeCache?.key === key) return latticeCache;
  const img = document.createElement('canvas');
  const W = w + 2 * r;
  const H = h + 4 * dy;
  img.width = W * dpr;
  img.height = H * dpr;
  const c = img.getContext('2d')!;
  c.scale(dpr, dpr);
  c.lineWidth = 1;
  const cx = W / 2;
  const cy = h * 0.4 + 2 * dy;
  const far = Math.hypot(w, h) / 2;
  for (let j = 0; j * dy < H + dy; j++) {
    for (let i = -1; i * r < W + r; i++) {
      const x = i * r + (j % 2 ? r / 2 : 0);
      const y = j * dy;
      const fade = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / far);
      c.strokeStyle = gold(0.02 + 0.06 * fade * fade);
      circle(c, x, y, r);
    }
  }
  latticeCache = { key, img, r, dy };
  return latticeCache;
}

function lattice(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number, t: number, m: Pointer) {
  const { img, r, dy } = latticeImage(w, h, dpr);
  const sway = Math.sin(t * 0.00005) * r * 0.4; // a slow sway that never wraps, so nodes never jump
  const ox = -r + sway + (m.x - 0.5) * 12;
  const oy = -2 * dy + (m.y - 0.5) * 12;
  ctx.drawImage(img, ox, oy, w + 2 * r, h + 4 * dy);
  const cx = w / 2;
  const cy = h * 0.4;
  const far = Math.hypot(w, h) / 2;
  let k = 0;
  for (let j = 0; j * dy < h + 4 * dy; j++) {
    for (let i = -1; i * r < w + 2 * r; i++) {
      if (!NODES[k++ % NODES.length]) continue;
      const x = ox + i * r + (j % 2 ? r / 2 : 0);
      const y = oy + j * dy;
      const fade = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / far);
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.0012 + i * 1.7 + j);
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = gold(0.08 + 0.3 * pulse * fade);
      octagram(ctx, r * 0.22, t * 0.00008 + i);
      ctx.restore();
    }
  }
}

// ---------- the vortex: glyphs stream along spiral arms from the edge of the sky into the seal ----------

const ARMS = 5;
const PER_ARM = 70;
const vortexCells = Array.from({ length: ARMS * PER_ARM }, (_, i) => ({
  arm: i % ARMS,
  s: Math.floor(i / ARMS) / PER_ARM + Math.random() * 0.01, // 0 at the rim … 1 at the centre
  v: 0.9 + Math.random() * 0.2,
  c: pick(),
  ph: Math.random() * TAU,
}));

function vortex(ctx: CanvasRenderingContext2D, rOut: number, rIn: number, size: number, t: number, dt: number) {
  mutate(vortexCells, 0.01);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of vortexCells) {
    p.s += dt * 0.000025 * p.v;
    if (p.s > 1) { p.s -= 1; p.c = pick(); }
    const theta = (p.arm * TAU) / ARMS + p.s * Math.PI * 1.2 + t * 0.00004;
    const r = rIn + (rOut - rIn) * (1 - p.s);
    const pulse = Math.max(0, Math.sin(t * 0.002 + p.ph)) ** 6;
    const a = Math.sin(Math.PI * p.s) * (0.18 + 0.7 * pulse);
    if (a < 0.02) continue;
    ctx.font = glyphFont(Math.max(8, size * (1 - 0.6 * p.s)));
    fillGlyph(ctx, { a, hot: pulse > 0.6 }, p.c, Math.cos(theta) * r, Math.sin(theta) * r);
  }
}

// ---------- the seal: seed of life inside the eight-pointed star, glyphs at its points, a ring of glyphs ----------

const pointGlyphs = cells(8);
const ringGlyphs = cells(96);

function seal(ctx: CanvasRenderingContext2D, R: number, t: number) {
  const rot = t * 0.00002;
  const r = R * 0.22;
  ctx.strokeStyle = gold(0.22);
  circle(ctx, 0, 0, r);
  for (let i = 0; i < 6; i++) circle(ctx, Math.cos(rot + (i * TAU) / 6) * r, Math.sin(rot + (i * TAU) / 6) * r, r);
  ctx.strokeStyle = gold(0.3);
  circle(ctx, 0, 0, R);
  ctx.strokeStyle = gold(0.26);
  octagram(ctx, R, -Math.PI / 2 - rot);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = glyphFont(Math.max(14, R * 0.09));
  mutate(pointGlyphs, 0.02);
  pointGlyphs.forEach((cell, i) => {
    const a = -Math.PI / 2 - rot + (i * TAU) / 8;
    const g = glow(i / 8, t, cell.ph, 0.00025, 1);
    fillGlyph(ctx, { a: Math.min(1, g.a + 0.2), hot: g.hot }, cell.c, Math.cos(a) * R * 1.12, Math.sin(a) * R * 1.12);
  });

  const ringR = R * 1.28;
  ctx.strokeStyle = gold(0.07);
  circle(ctx, 0, 0, ringR);
  ctx.font = glyphFont(Math.max(9, R * 0.04));
  mutate(ringGlyphs, 0.01);
  ringGlyphs.forEach((cell, i) => {
    const a = t * 0.00002 + (i * TAU) / ringGlyphs.length;
    fillGlyph(ctx, glow(i / ringGlyphs.length, t, cell.ph, 0.0001, 3), cell.c, Math.cos(a) * ringR, Math.sin(a) * ringR);
  });
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number, t: number, dt: number, m: Pointer) {
  sky(ctx, w, h, t, m);
  const R = Math.min(w, h) * 0.36;
  ctx.globalAlpha = 0.5; // the lattice and the vortex are the backdrop; the seal is in front
  lattice(ctx, w, h, dpr, t, m);
  ctx.save();
  ctx.translate(w / 2 + (m.x - 0.5) * 18, h * 0.4 + (m.y - 0.5) * 18);
  vortex(ctx, Math.hypot(w, h) * 0.6, R * 1.35, R * 0.07, t, dt);
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1;
  seal(ctx, R, t);
  ctx.restore();
}

// ---------- engine ----------

export function startCosmos(canvas: HTMLCanvasElement) {
  if (canvas.dataset.running) return;
  canvas.dataset.running = '1';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer: Pointer = { x: 0.5, y: 0.5 };
  let w = 0;
  let h = 0;
  let dpr = 1;
  let last = 0;
  let scheduled = false;

  const frame = (t: number) => {
    scheduled = false;
    const dt = last ? Math.min(64, t - last) : 16;
    last = t;
    draw(ctx, w, h, dpr, t, dt, pointer);
    if (!reduce.matches && !document.hidden) kick();
  };
  const kick = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(frame);
  };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    kick(); // under reduced motion: one new still frame for the new size
  };

  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => {
    pointer.x = e.clientX / innerWidth;
    pointer.y = e.clientY / innerHeight;
  });
  document.addEventListener('visibilitychange', () => {
    last = 0;
    if (!document.hidden) kick();
  });
  reduce.addEventListener('change', kick);
}
