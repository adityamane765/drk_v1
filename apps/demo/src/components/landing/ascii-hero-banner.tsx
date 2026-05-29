"use client";

import { useEffect, useRef } from "react";

const CHARS = "ASDGKDFSWRKWRWORNWRWKKKWRKR";

export function AsciiHeroBanner({ contained = false, fade = true }: { contained?: boolean; fade?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = window.devicePixelRatio || 1;

    const CHAR_W = 7;
    const LINE_H = 10;
    const FONT_SIZE = 9;

    // char grid state (for the bg rain)
    let cols = 0;
    let rows = 0;
    let switchAt: Float32Array;
    let chars: string[];

    function randChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function build(w: number, h: number) {
      cols = Math.floor(w / CHAR_W);
      rows = Math.floor(h / LINE_H);
      const n = cols * rows;
      switchAt = new Float32Array(n);
      chars = new Array(n);
      for (let i = 0; i < n; i++) {
        chars[i] = randChar();
        switchAt[i] = Math.random() * 60;
      }
    }

    // NyxMark geometry in SVG space (viewBox 0 0 120 120)
    // We'll scale it to a target size on canvas and center it
    function drawLogoGlow(cx: number, cy: number, scale: number, pulse: number) {
      // SVG origin: mark is centered at svg(60,60), we map svg coords → canvas coords
      // canvas_x = cx + (svg_x - 60) * scale
      // canvas_y = cy + (svg_y - 60) * scale
      const sx = (svgX: number) => cx + (svgX - 60) * scale;
      const sy = (svgY: number) => cy + (svgY - 60) * scale;

      const baseBlur = 38 + pulse * 18;
      const fillA = 0.10 + pulse * 0.06;
      const glowA = 0.85 + pulse * 0.15;

      // ── half-circle (clipped at y=66 in svg space) ──
      ctx.save();
      ctx.beginPath();
      ctx.rect(sx(0), sy(0), 120 * scale, 66 * scale);
      ctx.clip();

      ctx.beginPath();
      ctx.arc(sx(60), sy(60), 36 * scale, 0, Math.PI * 2);
      ctx.shadowBlur = baseBlur;
      ctx.shadowColor = `rgba(250,126,35,${glowA})`;
      ctx.fillStyle = `rgba(250,126,35,${fillA})`;
      ctx.fill();
      ctx.restore();

      // ── long horizon rect (svg: x=18,y=66,w=84,h=4) ──
      ctx.save();
      ctx.shadowBlur = baseBlur;
      ctx.shadowColor = `rgba(250,126,35,${glowA})`;
      ctx.fillStyle = `rgba(250,126,35,${fillA})`;
      ctx.fillRect(sx(18), sy(66), 84 * scale, 4 * scale);
      ctx.restore();

      // ── short horizon rect (svg: x=18,y=78,w=60,h=4, opacity 0.5) ──
      ctx.save();
      ctx.shadowBlur = baseBlur * 0.6;
      ctx.shadowColor = `rgba(250,126,35,${glowA * 0.5})`;
      ctx.fillStyle = `rgba(250,126,35,${fillA * 0.5})`;
      ctx.fillRect(sx(18), sy(78), 60 * scale, 4 * scale);
      ctx.restore();
    }

    // DARKNYX bitmap letters (5-wide, 5-tall)
    const letters: Record<string, string[]> = {
      D: ["████ ", "█   █", "█   █", "█   █", "████ "],
      A: [" ███ ", "█   █", "█████", "█   █", "█   █"],
      R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
      K: ["█  █ ", "█ █  ", "██   ", "█ █  ", "█  █ "],
      N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
      Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
      X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
    };

    function drawTextGlow(
      centerX: number, centerY: number,
      textBaseY: number, pulse: number
    ) {
      const text = "DARKNYX";
      const charPx = CHAR_W;
      const textWidth = text.length * (charPx + 1);
      let cursorX = centerX - textWidth / 2;
      const baseBlur = 10 + pulse * 6;
      const alpha = 0.88 + pulse * 0.12;

      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";

      for (const ch of text) {
        const bitmap = letters[ch];
        for (let py = 0; py < bitmap.length; py++) {
          for (let px = 0; px < bitmap[py].length; px++) {
            if (bitmap[py][px] !== " ") {
              ctx.shadowBlur = baseBlur;
              ctx.shadowColor = `rgba(250,126,35,${alpha})`;
              ctx.fillStyle = `rgba(250,126,35,${alpha})`;
              ctx.fillText(ch === ch ? bitmap[py][px] : "", cursorX + px * charPx, textBaseY + py * LINE_H);
            }
          }
        }
        cursorX += charPx + 1;
      }
    }

    function drawTextGlowFixed(
      centerX: number, textBaseY: number, pulse: number
    ) {
      const text = "DARKNYX";
      const charPx = CHAR_W;
      const textWidth = text.length * (charPx + 1);
      let cursorX = Math.floor(centerX - textWidth / 2);
      const baseBlur = 22 + pulse * 10;
      const fillA = 0.12 + pulse * 0.06;
      const glowA = 0.80 + pulse * 0.20;

      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";

      for (const ch of text) {
        const bitmap = letters[ch];
        for (let py = 0; py < bitmap.length; py++) {
          for (let px = 0; px < bitmap[py].length; px++) {
            if (bitmap[py][px] !== " ") {
              ctx.save();
              ctx.shadowBlur = baseBlur;
              ctx.shadowColor = `rgba(250,126,35,${glowA})`;
              ctx.fillStyle = `rgba(250,126,35,${fillA})`;
              ctx.fillRect(cursorX + px * charPx, textBaseY + py * LINE_H, charPx - 1, LINE_H - 2);
              ctx.restore();
            }
          }
        }
        cursorX += charPx + 1;
      }
    }

    const resize = () => {
      const w = contained ? (canvas.parentElement?.offsetWidth ?? 480) : window.innerWidth;
      const h = contained ? (canvas.parentElement?.offsetHeight ?? 340) : 620;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build(w, h);
    };

    function draw() {
      const frame = ++frameRef.current;
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;

      // bg
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      // dot grid
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      for (let x = 0; x < w; x += 12)
        for (let y = 0; y < h; y += 12)
          ctx.fillRect(x, y, 1, 1);

      // ascii rain chars (all dim, no logo coloring)
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.09)";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (frame >= switchAt[i]) {
            chars[i] = randChar();
            switchAt[i] = frame + 20 + Math.random() * 80;
          }
          ctx.fillText(chars[i], c * CHAR_W, r * LINE_H);
        }
      }

      // pulse 0..1
      const pulse = (Math.sin(frame * 0.03) + 1) / 2;

      // logo centered, scale so logo ~140px tall in a 620px canvas
      const logoSvgH = 88; // viewBox height used (0..88 covers circle+rects)
      const targetH = contained ? Math.min(h * 0.38, 120) : 160;
      const scale = targetH / logoSvgH;

      const cx = w / 2;
      // center of SVG is at svg(60,60); position it so logo sits above wordmark
      const wordmarkH = 5 * LINE_H + 12; // 5 rows + gap
      const totalH = targetH + wordmarkH;
      const cy = h / 2 - totalH / 2 + 60 * scale; // map svg center y=60 to canvas

      drawLogoGlow(cx, cy, scale, pulse);

      // wordmark below logo
      const logoBottomSvgY = 82; // bottom of second rect (y=78+h=4)
      const textBaseY = cy + (logoBottomSvgY - 60) * scale + 14;
      drawTextGlowFixed(cx, textBaseY, pulse);

      // scanlines
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      for (let y = 0; y < h; y += 4)
        ctx.fillRect(0, y, w, 1);

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [contained]);

  if (contained) {
    return (
      <div className="relative overflow-hidden h-full" style={{ borderRadius: "2px", background: "#050505" }}>
        <canvas ref={canvasRef} className="block w-full h-full" />
        {fade && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_30%,black_100%)]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 to-transparent" />
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden border-b border-white/10 bg-[#050505]">
      <canvas ref={canvasRef} className="block w-full" style={{ height: "620px" }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent" />
    </section>
  );
}
