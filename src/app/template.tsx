"use client";

/**
 * Route transition template — Next.js remounts this file on every
 * navigation, so its entrance animation plays once per page change.
 * Deliberately opacity-only (see globals.css .page-enter): transforms on
 * an ancestor would break the fixed header/mobile menu inside the tree.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
