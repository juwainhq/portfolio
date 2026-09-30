"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Dark/light toggle for the navigation bar.
 *
 * Keeps the site's signature dark look as the default and lets visitors
 * flip to the paper-white palette. Toggling temporarily adds html.theme-anim
 * (see globals.css) so every color cross-fades instead of snapping.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: icons only render after mount.
  useEffect(() => setMounted(true), []);

  const toggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-anim");
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-anim"), 550);
  };

  const isDark = resolvedTheme !== "light";

  return (
    <button
      onClick={toggle}
      aria-label={
        !mounted
          ? "Toggle color theme"
          : isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
      }
      title={!mounted ? "Toggle theme" : isDark ? "Light mode" : "Dark mode"}
      className={`group relative p-1.5 hover:opacity-50 transition-opacity duration-300 ${className}`}
    >
      <span className="relative block w-[18px] h-[18px]">
        <Sun
          size={18}
          strokeWidth={1.5}
          className={`absolute inset-0 transition-all duration-500 ease-out ${
            mounted && isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50"
          }`}
        />
        <Moon
          size={18}
          strokeWidth={1.5}
          className={`absolute inset-0 transition-all duration-500 ease-out ${
            mounted && !isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50"
          }`}
        />
      </span>
    </button>
  );
}
