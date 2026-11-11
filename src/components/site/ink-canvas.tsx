"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * 墨流し。ノイズ場の等高線を細い線として描き、
 * クリックした場所には墨を一滴落とす（同心円が広がり、やがて水面に馴染む）。
 * ライブラリなしの素の WebGL2。非対応環境では何も描かない。
 */

const MAX_DROPS = 6;

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uReveal;
uniform float uBands;
uniform float uAlpha;
uniform vec3 uLine;
uniform vec3 uAccent;
uniform vec3 uPointer;
uniform vec2 uVelocity;
uniform vec4 uDrops[${MAX_DROPS}];

out vec4 fragColor;

// Simplex 3D noise — Ian McEwan, Ashima Arts (MIT)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float hash(float n) { return fract(sin(n * 91.3458) * 47453.5453); }

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime;

  // 指で水面をなぞる：カーソルの周りだけ模様が膨らみ、動かした向きに引きずられる
  vec2 dp = uv - uPointer.xy;
  float gp = exp(-dot(dp, dp) * 7.0) * uPointer.z;
  vec2 p = uv - dp * gp * 0.35 - uVelocity * gp * 0.2;

  // ゆっくり流れる水面
  vec2 w = vec2(
    snoise(vec3(p * 0.62, t * 0.035)),
    snoise(vec3(p * 0.62 + 19.7, t * 0.035 + 4.0))
  );
  vec2 q = p + w * 0.42;
  float f = snoise(vec3(q * 0.72, t * 0.03 + 9.0));
  f += 0.22 * snoise(vec3(q * 1.7 - 3.1, t * 0.045));

  // 落とした墨。丘がひとつ足されるので、その等高線が同心円になる
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    vec4 d = uDrops[i];
    float age = t - d.z;
    if (d.w > 0.0 && age > 0.0) {
      float sigma = 0.035 + 0.42 * (1.0 - exp(-age * 0.5));
      float amp = d.w * smoothstep(0.0, 0.5, age) * exp(-age * 0.085);
      vec2 r = (p - d.xy) + w * 0.1 * smoothstep(0.0, 3.0, age);
      f += amp * exp(-dot(r, r) / (2.0 * sigma * sigma));
    }
  }

  float reveal = uReveal * uReveal * (3.0 - 2.0 * uReveal);
  float bands = f * uBands * mix(0.2, 1.0, reveal);
  float fw = fwidth(bands);
  float fr = fract(bands);
  float px = min(fr, 1.0 - fr) / max(fw, 1e-4) / uDpr;

  float id = floor(bands + 0.5);
  float thin = 1.0 - smoothstep(0.3, 1.0, px);
  float bold = 1.0 - smoothstep(0.75, 1.6, px);
  float line = mix(thin, bold, step(0.8, hash(id)));
  // 線が密になりすぎる所は消して、モアレを防ぐ
  line *= 1.0 - smoothstep(0.3, 0.75, fw);

  float accent = step(abs(mod(id + 40.0, 9.0) - 4.0), 0.25);
  float weight = mix(0.4, 1.0, hash(id + 7.0));
  float lineAlpha = line * mix(weight * uAlpha, 0.92, accent);
  vec3 lineColor = mix(uLine, uAccent, accent);

  // ところどころ帯を淡く染める
  float washAlpha = step(0.82, hash(floor(bands) * 3.17 + 1.3)) * 0.085 * uAlpha;

  float fade = smoothstep(0.0, 0.35, uReveal);
  vec3 rgb = lineColor * lineAlpha + uLine * washAlpha * (1.0 - lineAlpha);
  float alpha = lineAlpha + washAlpha * (1.0 - lineAlpha);
  fragColor = vec4(rgb, alpha) * fade;
}`;

type Rgb = readonly [number, number, number];

export type InkDrop = {
  /** キャンバス内の位置（0〜1、左上が原点） */
  x: number;
  y: number;
  strength: number;
  /** 表示が始まってから落ちるまでの秒数 */
  delay: number;
};

type InkCanvasProps = {
  className?: string;
  line: Rgb;
  accent: Rgb;
  alpha?: number;
  bands?: number;
  /** false の間は描かず、true になったら広がりながら現れる */
  active?: boolean;
  /** 模様の出発点をずらす */
  seed?: number;
  drops?: InkDrop[];
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export function InkCanvas({
  className,
  line,
  accent,
  alpha = 0.5,
  bands = 7,
  active = true,
  seed = 0,
  drops,
}: InkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const activeRef = useRef(active);
  activeRef.current = active;
  const settings = useRef({ line, accent, alpha, bands, drops });
  settings.current = { line, accent, alpha, bands, drops };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // 画面を覆う三角形ひとつ
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      res: uniform("uRes"),
      dpr: uniform("uDpr"),
      time: uniform("uTime"),
      reveal: uniform("uReveal"),
      bands: uniform("uBands"),
      alpha: uniform("uAlpha"),
      line: uniform("uLine"),
      accent: uniform("uAccent"),
      pointer: uniform("uPointer"),
      velocity: uniform("uVelocity"),
      drops: uniform("uDrops"),
    };

    const state = {
      time: seed,
      reveal: 0,
      started: false,
      dpr: 1,
      // 描画が追いつかない端末では、解像度を段階的に落とす
      quality: 1,
      slow: { frames: 0, total: 0 },
      pointer: { x: 0, y: 0, tx: 0, ty: 0, force: 0, targetForce: 0, vx: 0, vy: 0 },
      drops: new Float32Array(MAX_DROPS * 4),
      nextDrop: 0,
      lastDrop: seed,
    };

    const addDrop = (x: number, y: number, strength: number, delay = 0) => {
      const offset = state.nextDrop * 4;
      state.drops[offset] = x;
      state.drops[offset + 1] = y;
      state.drops[offset + 2] = state.time + delay;
      state.drops[offset + 3] = strength;
      state.nextDrop = (state.nextDrop + 1) % MAX_DROPS;
      state.lastDrop = state.time + delay;
    };

    /** 画面座標 → シェーダーと同じ座標系（短辺が 1、中心が原点、上が正） */
    const toUv = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const m = Math.min(rect.width, rect.height) || 1;
      return {
        x: (clientX - rect.left - rect.width / 2) / m,
        y: (rect.height / 2 - (clientY - rect.top)) / m,
        inside: clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const area = rect.width * rect.height;
      if (!area) return;
      // 4K などでも重くなりすぎないよう、総ピクセル数に上限を設ける
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3_200_000 / area)) * state.quality;
      state.dpr = dpr;
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const draw = () => {
      const s = settings.current;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.dpr, state.dpr);
      gl.uniform1f(u.time, state.time);
      gl.uniform1f(u.reveal, state.reveal);
      gl.uniform1f(u.bands, s.bands);
      gl.uniform1f(u.alpha, s.alpha);
      gl.uniform3f(u.line, s.line[0] / 255, s.line[1] / 255, s.line[2] / 255);
      gl.uniform3f(u.accent, s.accent[0] / 255, s.accent[1] / 255, s.accent[2] / 255);
      gl.uniform3f(u.pointer, state.pointer.x, state.pointer.y, state.pointer.force);
      gl.uniform2f(u.velocity, state.pointer.vx, state.pointer.vy);
      gl.uniform4fv(u.drops, state.drops);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const start = () => {
      if (state.started) return;
      state.started = true;
      const rect = canvas.getBoundingClientRect();
      const m = Math.min(rect.width, rect.height) || 1;
      for (const drop of settings.current.drops ?? []) {
        addDrop(((drop.x - 0.5) * rect.width) / m, ((0.5 - drop.y) * rect.height) / m, drop.strength, drop.delay);
      }
    };

    let raf = 0;
    let last = 0;
    let visible = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const elapsed = (now - (last || now)) / 1000;
      const dt = Math.min(elapsed, 0.05);
      last = now;
      state.time += dt;

      // 直近 45 フレームの平均が 40fps を下回っていたら、解像度を 2 割落とす
      if (elapsed > 0 && elapsed < 0.25) {
        state.slow.frames += 1;
        state.slow.total += elapsed;
        if (state.slow.frames >= 45) {
          if (state.slow.total / state.slow.frames > 1 / 40 && state.quality > 0.45) {
            state.quality *= 0.8;
            resize();
          }
          state.slow.frames = 0;
          state.slow.total = 0;
        }
      }

      if (activeRef.current) {
        start();
        state.reveal = Math.min(1, state.reveal + dt / 2.8);
        // しばらく誰も触れていなければ、どこかにそっと一滴落として水面を動かし続ける
        if (state.time - state.lastDrop > 11) {
          const aspect = canvas.width / Math.max(1, canvas.height);
          const spanX = aspect >= 1 ? aspect : 1;
          const spanY = aspect >= 1 ? 1 : 1 / aspect;
          addDrop(
            (Math.random() - 0.5) * spanX * 0.8,
            (Math.random() - 0.3) * spanY * 0.6,
            0.55 + Math.random() * 0.35,
          );
        }
      }

      const ptr = state.pointer;
      const ease = 1 - Math.exp(-dt * 5);
      const px = ptr.x + (ptr.tx - ptr.x) * ease;
      const py = ptr.y + (ptr.ty - ptr.y) * ease;
      if (dt > 0) {
        const vx = Math.max(-1.5, Math.min(1.5, (px - ptr.x) / dt));
        const vy = Math.max(-1.5, Math.min(1.5, (py - ptr.y) / dt));
        ptr.vx += (vx - ptr.vx) * ease;
        ptr.vy += (vy - ptr.vy) * ease;
      }
      ptr.x = px;
      ptr.y = py;
      ptr.force += (ptr.targetForce - ptr.force) * (1 - Math.exp(-dt * 3));

      draw();
    };

    const play = () => {
      if (raf || reduced) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => {
      if (visible && !document.hidden) play();
      else pause();
    };

    /** 動きを減らす設定のときは、広がりきった状態を一枚だけ描く */
    const drawStill = () => {
      if (!reduced) return;
      start();
      state.time = seed + 14;
      state.reveal = 1;
      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const point = toUv(event.clientX, event.clientY);
      state.pointer.tx = point.x;
      state.pointer.ty = point.y;
      state.pointer.targetForce = point.inside ? 1 : 0;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!visible || event.button !== 0 || !activeRef.current) return;
      // リンクやボタンを押したときは落とさない
      if (event.target instanceof Element && event.target.closest("a, button, input, iframe")) return;
      const point = toUv(event.clientX, event.clientY);
      if (point.inside) addDrop(point.x, point.y, 1.15);
    };
    const onPointerLeave = () => {
      state.pointer.targetForce = 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) drawStill();
      else if (!raf) draw();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "10% 0px" },
    );
    intersectionObserver.observe(canvas);

    resize();
    drawStill();

    document.addEventListener("visibilitychange", sync);
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      pause();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [reduced, seed]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className ?? ""}`} aria-hidden />;
}
