"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Dark / light switch. The choice is persisted by next-themes under the
 * `juwain-theme` key and applied to `<html class="…">` before first paint.
 */
export function ThemeToggle({
  className = "",
  id = "desktop",
}: {
  className?: string;
  id?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme : "dark") !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`group inline-flex h-9 w-9 items-center justify-center border-2 border-border text-foreground transition-colors duration-200 hover:border-ink-2 hover:text-ink-2 ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      data-theme-toggle={id}
    >
      <span className="sr-only">
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </span>
      {isDark ? (
        <Moon size={16} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Sun size={16} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}
