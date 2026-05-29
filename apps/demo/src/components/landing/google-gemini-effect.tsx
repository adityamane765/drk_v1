"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

/* -------------------------------------------------------------------------- */
/* REAL GEMINI-LIKE FLOW FIELD                                                */
/* -------------------------------------------------------------------------- */

const RIGHT_PATHS = [
  {
    color: "#ff7a18",
    d: "M720 424C760 424 790 424 840 424C900 424 930 388 980 360C1080 305 1200 300 1440 300",
  },
  {
    color: "#ff9838",
    d: "M720 424C760 424 800 424 860 424C930 424 960 420 1020 408C1130 390 1260 390 1440 390",
  },
  {
    color: "#ffffff",
    d: "M720 424C780 424 840 424 920 424C1050 424 1200 424 1440 424",
  },
  {
    color: "#c86418",
    d: "M720 424C760 424 800 424 860 424C930 424 960 438 1020 470C1130 510 1260 510 1440 510",
  },
  {
    color: "#7f3400",
    d: "M720 424C760 424 790 424 840 424C900 424 930 470 980 530C1080 620 1200 640 1440 640",
  },
];

/* -------------------------------------------------------------------------- */
/* MIRROR LEFT SIDE                                                           */
/* -------------------------------------------------------------------------- */

const LEFT_PATHS = [
  {
    color: "#ff7a18",
    d: "M720 424C680 424 650 424 600 424C540 424 510 388 460 360C360 305 240 300 0 300",
  },
  {
    color: "#ff9838",
    d: "M720 424C680 424 640 424 580 424C510 424 480 420 420 408C310 390 180 390 0 390",
  },
  {
    color: "#ffffff",
    d: "M720 424C660 424 600 424 520 424C390 424 240 424 0 424",
  },
  {
    color: "#c86418",
    d: "M720 424C680 424 640 424 580 424C510 424 480 438 420 470C310 510 180 510 0 510",
  },
  {
    color: "#7f3400",
    d: "M720 424C680 424 650 424 600 424C540 424 510 470 460 530C360 620 240 640 0 640",
  },
];

const ALL_PATHS = [...LEFT_PATHS, ...RIGHT_PATHS];

export function GoogleGeminiEffect({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-screen w-full overflow-hidden bg-black",
        className
      )}
    >
      {/* ------------------------------------------------------------------ */}
      {/* BACKGROUND FLOW FIELD                                               */}
      {/* ------------------------------------------------------------------ */}

      <svg
        width="1440"
        height="900"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full z-0"
      >
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>

        {/* glow copies */}
        {ALL_PATHS.map((path, i) => (
          <path
            key={`blur-${i}`}
            d={path.d}
            stroke={path.color}
            strokeWidth="3"
            fill="none"
            opacity="0.18"
            filter="url(#blurMe)"
          />
        ))}

        {/* animated paths */}
        {ALL_PATHS.map((path, i) => (
          <motion.path
            key={i}
            d={path.d}
            stroke={path.color}
            strokeWidth="1.7"
            fill="none"
            strokeLinecap="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </svg>

      {/* ------------------------------------------------------------------ */}
      {/* CENTER HERO                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        {/* LOGO BLOCK */}
        <div className="relative flex flex-col items-center">
          {/* glow behind */}
          <div className="absolute inset-0 scale-[2.8] rounded-full bg-[#ff6a00]/10 blur-3xl" />

          {/* logo */}
          <div className="relative z-30 scale-[2.2]">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="hor">
                  <rect x="0" y="0" width="120" height="66" />
                </clipPath>
              </defs>

              <circle
                cx="60"
                cy="60"
                r="36"
                fill="#ff8a1f"
                clipPath="url(#hor)"
              />

              {/* horizon */}
              {/* <rect
                x="18"
                y="66"
                width="84"
                height="4"
                fill="#ffffff"
              /> */}

              {/* lower settlement lines */}
              <rect
                x="18"
                y="78"
                width="72"
                height="4"
                fill="#1b1b1b"
                opacity="0.95"
              />

              <rect
                x="18"
                y="86"
                width="86"
                height="4"
                fill="#1b1b1b"
                opacity="0.9"
              />

              <rect
                x="18"
                y="94"
                width="102"
                height="4"
                fill="#1b1b1b"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* WORDMARK */}
          <div
            className="relative z-30 mt-24"
            style={{
              fontFamily:
                "'Space Grotesk', Inter, system-ui, sans-serif",
              fontSize: "clamp(56px, 8vw, 120px)",
              lineHeight: 1,
              letterSpacing: "-0.07em",
            }}
          >
            <span
              style={{
                color: "#ff8a1f",
                fontWeight: 700,
              }}
            >
              dark
            </span>

            <span
              style={{
                color: "#7a3810",
                fontWeight: 400,
              }}
            >
              nyx
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CENTER MASK                                                        */}
      {/* hides messy convergence behind logo                                */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2"
        style={{
          width: 340,
          height: 140,
          marginTop: -55,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.95), rgba(0,0,0,1))",
          filter: "blur(18px)",
        }}
      />

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10" />
    </div>
  );
}