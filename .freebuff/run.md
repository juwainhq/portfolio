# Run doc — portfolio dev preview

Static-export Next.js 14 portfolio (pnpm workspace, Next 14.2.13 / React 18.3.1).

## 1. Reproduce the uncommitted artifacts

A fresh checkout needs `node_modules/` and one `package.json` fix. No `.env*`
files are required — the Supabase publishable key is committed in
`src/integrations/supabase/client.ts`.

### Node runtime (this machine has NO system Node on PATH)

Use the runtime binaries that already exist locally:

- `node.exe`: `C:\Program Files\Adobe\Adobe Photoshop 2026\node.exe` (v22.18.0)
- `pnpm`: corepack cache — `%LOCALAPPDATA%\node\corepack\v1\pnpm\11.25.0\bin\pnpm.cjs`
  (run it through the node.exe above; the workspace's `allowBuilds:` schema needs pnpm 11)

Invoke pnpm as: `"<node.exe path>" "<pnpm.cjs path>" <args>`.

### Fix the unpublished dev dependency (if not already applied)

`@dyad-sh/nextjs-webpack-component-tagger@^0.0.1` was never published to npm
(only 0.8.0+ exists), so a bare install fails. In `package.json` set the
devDependency to `"^0.8.0"` (matches what the registry and the rewritten
lockfile agree on). Applied once in this workspace.

### Next.js config format (if not already applied)

Next 14 cannot load `next.config.ts` (TS configs require Next 15+); the server
exits immediately with "Configuring Next.js via 'next.config.ts' is not
supported". The file has been converted to **`next.config.mjs`** (same
settings, plain ESM: drop `import type`, `satisfies`, and `@type` stays as a
JSDoc comment). Applied once in this workspace.

### Install dependencies

```bash
"<node.exe path>" "<pnpm.cjs path>" install --no-frozen-lockfile
```

`--frozen-lockfile` fails on a stale lockfile (it pinned Next 15/React 19 while
the manifest wants Next 14/React 18); the first successful `--no-frozen-lockfile`
install rewrites `pnpm-lock.yaml` consistently. The only skipped build script is
`unrs-resolver` (ESLint-only; harmless for the dev server).

## 2. Run the dev server

- Port: Next's default mode — it tries **3000** first, then auto-picks a free
  one. On this machine the actual port varies per boot (1173, 3046, 3745 were
  observed), so **parse it from the log line** `- Local: http://localhost:<port>`
  after startup instead of assuming 3000.
- Env: none needed. `NEXT_PUBLIC_BASE_PATH` must stay **unset** so `basePath`
  is empty and the site serves at `/` (it is only set for the production
  GitHub Pages export under `/portfolio`).

Launch detached (bash backgrounding — the documented PowerShell
`Start-Process` recipe hangs on this machine when spawning node.exe; the
process survives the shell either way):

```bash
"<node.exe path>" node_modules/next/dist/bin/next dev \
  > .freebuff/preview.log 2> .freebuff/preview.log.err &
```

Then:
1. Wait a few seconds; read the `- Local: http://localhost:<port>` line from
   `.freebuff/preview.log` (cold start: "Ready in" can take ~15s).
2. Resolve the real Windows pid: `netstat -ano | grep ":<port>" | grep LISTENING`
   (the bash `$!` is an MSYS pid, not the Windows pid).
3. Poll `http://localhost:<port>/` with curl until HTTP 200.
4. Register the preview with that URL and Windows pid.

Note: killing the server by Windows pid: `taskkill //F //PID <pid>`.

