// Affordance dump for building a product heat map of a web or Electron app. Mechanical only: it
// screenshots and lists the interactive elements it can see. Deciding what counts as a control,
// how to group surfaces and panels, and where to walk next is the heat-map-system-testing runner's job.
//
//   node enumerate-ui.mjs <url | path-to-electron-main> [shotDir]       # smoke: launch, shot, dump JSON
//   xvfb-run -a node enumerate-ui.mjs <electron-main> [shotDir]         # Electron without a display
//
// For a full walk, import { launch, enumerate } and drive between snapshots:
//   const { win, shot, close } = await launch(target)
//   console.log(JSON.stringify(await enumerate(win)))                  // surface 1
//   await win.getByRole('tab', { name: 'Settings' }).click(); await shot('settings')
//   console.log(JSON.stringify(await enumerate(win)))                  // surface 2
//   await close()
//
// Run from a directory where playwright is installed (npm i -D playwright; npx playwright install
// chromium for web targets). launch() deliberately duplicates user-sim-bug-hunt's drive-app.mjs so each skill stands alone.

import { mkdirSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

// Resolve Playwright from the directory you run in (the product), not from this script's location.
const { _electron: electron, chromium } = createRequire(`${process.cwd()}/`)('playwright')

const TARGET = process.argv[2] || process.env.APP_TARGET || process.env.APP_MAIN
const SHOT_DIR = process.argv[3] || process.env.SHOT_DIR || 'shots'

export async function launch(target = TARGET, shotDir = SHOT_DIR, runId = `map${Date.now()}`) {
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

// Enumerate visible affordance-candidates in the current window. Returns raw facts, no judgment.
export async function enumerate(win) {
  const title = await win.title()
  const affordances = await win.evaluate(() => {
    const SEL = [
      'button', 'a[href]', 'input', 'select', 'textarea', 'summary', 'label[for]',
      '[role=button]', '[role=tab]', '[role=menuitem]', '[role=link]', '[role=checkbox]',
      '[role=radio]', '[role=switch]', '[role=combobox]', '[role=option]', '[role=slider]',
      '[contenteditable=""]', '[contenteditable=true]', '[onclick]', '[tabindex]:not([tabindex="-1"])',
    ].join(',')
    // Content of a closed <details> is not rendered, but layout queries can still report a size.
    // Its own <summary> stays visible.
    const inClosedDetails = (el) => {
      for (let d = el.closest('details:not([open])'); d; d = d.parentElement?.closest('details:not([open])')) {
        const summary = d.querySelector(':scope > summary')
        if (!summary?.contains(el)) return true
      }
      return false
    }
    const seen = new Set()
    const out = []
    for (const el of document.querySelectorAll(SEL)) {
      if (seen.has(el)) continue
      seen.add(el)
      const r = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      const visible = r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' &&
        !inClosedDetails(el) && (el.checkVisibility?.({ visibilityProperty: true }) ?? true)
      const text = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || '').trim().slice(0, 80)
      out.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || undefined,
        role: el.getAttribute('role') || undefined,
        text,
        testid: el.getAttribute('data-testid') || el.getAttribute('data-test') || undefined,
        id: el.id || undefined,
        disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true' || undefined,
        visible,
        bbox: visible ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : undefined,
      })
    }
    return out
  })
  return { title, url: win.url(), count: affordances.length, affordances }
}

// Standalone smoke: launch, screenshot, enumerate the first window, print JSON, exit.
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const { win, shot, close } = await launch()
  const shotPath = await shot('map-launch')
  const snap = await enumerate(win)
  console.log(JSON.stringify({ shot: shotPath, ...snap }, null, 2))
  await close()
}
