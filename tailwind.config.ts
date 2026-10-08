import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Self-hosted (see src/fonts + src/app/layout.tsx)
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-body)", "ui-monospace", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--foreground))",
          foreground: "hsl(var(--background))",
        },
        secondary: {
          DEFAULT: "hsl(var(--card-2))",
          foreground: "hsl(var(--foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--card-2))",
          foreground: "hsl(var(--muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--card-2))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--background))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        // Theme-aware, AA-safe accents (text).
        ink: {
          1: "hsl(var(--accent-1))",
          2: "hsl(var(--accent-2))",
          3: "hsl(var(--accent-3))",
          4: "hsl(var(--accent-4))",
          5: "hsl(var(--accent-5))",
        },
        // Always-saturated fills (dither dots, chips, blocks).
        vivid: {
          1: "hsl(var(--vivid-1))",
          2: "hsl(var(--vivid-2))",
          3: "hsl(var(--vivid-3))",
          4: "hsl(var(--vivid-4))",
          5: "hsl(var(--vivid-5))",
          ink: "hsl(var(--on-vivid))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0",
      },
      letterSpacing: {
        "ultra-tight": "-0.05em",
        "mega-tight": "-0.04em",
        "ultra-wide": "0.25em",
        "mega-wide": "0.35em",
      },
      lineHeight: {
        tighter: "0.85",
        tight: "1.1",
        snug: "1.25",
        normal: "1.5",
        relaxed: "1.625",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-in": "fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        blink: "blink 1.4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
