// Launch-and-screenshot plumbing for user-sim-bug-hunt. Mechanical only: it never judges findings.
// Drives a web app (URL) in Chromium or an Electron app (built main entry) through Playwright.
// CLI apps need no harness: run real commands in a shell or pty.
//
//   node drive-app.mjs <url | path-to-electron-main> [shotDir]        # smoke test
//   xvfb-run -a node drive-app.mjs <electron-main> [shotDir]            # Electron without a display
//
// The smoke test launches, screenshots the first window, prints its title and exits, proving you
// can drive and capture before hunting. For charters, import { launch } and act as a user:
//   const { win, shot, close } = await launch(target, 'shots', 'charter-3')
//   await win.getByRole('button', { name: 'New' }).click()
//   await win.getByLabel('Name').pressSequentially('my thing')   // keystrokes, not fill()
//   await shot('after-new'); await close()
//
// Run from a directory where playwright is installed (npm i -D playwright; npx playwright install
// chromium for web targets). The app's own build must already exist.

import { mkdirSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

// Resolve Playwright from the directory you run in (the product), not from this script's location.
const { _electron: electron, chromium } = createRequire(`${process.cwd()}/`)('playwright')

const TARGET = process.argv[2] || process.env.APP_TARGET || process.env.APP_MAIN
const SHOT_DIR = process.argv[3] || process.env.SHOT_DIR || 'shots'

// launch() is duplicated in heat-map-system-testing's enumerate-ui.mjs on purpose, so each skill stands alone.
// runId namespaces screenshots so separate launches/charters in one hunt don't overwrite each other.
export async function launch(target = TARGET, shotDir = SHOT_DIR, runId = `r${Date.now()}`) {
  if (!target) throw new Error('No target given: pass a URL or an Electron main entry (argv[2] or APP_TARGET).')
  mkdirSync(shotDir, { recursive: true })
  let app, win
  if (/^(https?|file):\/\//.test(target)) {
    app = await chromium.launch()
    win = await (await app.newContext()).newPage()
    await win.goto(target)
  } else {
    // --no-sandbox: Electron's sandbox usually fails inside containers and CI.
    app = await electron.launch({ args: [target, '--no-sandbox'] })
    win = await app.firstWindow()
    await win.waitForLoadState('domcontentloaded')
  }
  let n = 0
  const shot = async (label) => {
    const path = `${shotDir}/${runId}-${String(++n).padStart(2, '0')}-${label}.png`
    await win.screenshot({ path })
    return path
  }
  return { app, win, shot, close: () => app.close() }
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const { win, shot, close } = await launch()
  console.log('shot:', await shot('launch'))
  console.log('window title:', await win.title())
  await close()
}
