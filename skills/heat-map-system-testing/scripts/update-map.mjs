// Fold evidence into a product heat map and recompute heat. Dependency-free (Node built-ins).
// Mechanical only: the caller decides which node each finding belongs to and whether a node's heat
// needs a recorded override. Heat follows the Heat table in ../SKILL.md.
//
//   node update-map.mjs <map.json> <fold.json>
//
// fold.json:
//   { "evidence": ["hunt:2026-09-23-c4", "BUG-112"],        // refs folded here; refused if already folded
//     "touched": [
//       { "id": "control:new-project-btn", "newBugs": 2, "probed": ["data"] },   // walked by a charter
//       { "id": "control:sidebar-filter", "newBugs": 0 },                        // walked, clean
//       { "id": "control:export", "newBugs": 1, "walked": false },               // bug from outside the loop
//       { "id": "control:checkout-pay", "changed": true },                       // fix or change landed
//       { "id": "surface:settings", "changed": true }                            // change across a surface
//   ] }
// Entries name leaves. A parent is accepted only for `changed: true` with no bugs and no walk; it
// expands to every descendant leaf. Fields: newBugs (integer >= 0, default 0) = NEW bugs attributed
// here; walked (boolean) = a charter exercised it (traversals += 1; default true, but false when
// changed is set); changed (boolean) = the product changed here, so earned dryness, probed facets
// and any override reset; probed = this leaf's dimensions/qualities the walk actually exercised.
// `evidence` is required, non-empty, whenever an entry is walked or carries bugs, so a replayed
// fold is refused rather than counted twice. A changed-only fold may omit it; a landed fix cites
// the fix (e.g. "fix:<sha>"), never the bug id already folded. `{"touched": []}` needs none: it
// just recomputes heat, for example after deleting a lapsed heatOverride.
//
// A node newly added by hand may omit traversals, bugsFound and dryStreak; it starts at 0/0/0.
// The whole map and fold are checked before anything changes. An empty map, duplicate ids,
// malformed children, counters partly present or invalid, node dimensions/qualities/probed that
// are not arrays of strings, a heatOverride that is not { heat, reason } on a leaf, unknown keys,
// bad types, probed facets the leaf does not list, a leaf named twice (after parent expansion), a
// walk or bug without evidence, or an already-folded evidence ref refuse the fold and leave the
// map untouched.

import { readFileSync, writeFileSync, renameSync } from 'node:fs'

const RANK = { hot: 3, unknown: 2, warm: 1, cold: 0 }
const HEATS = new Set(Object.keys(RANK))
const IMPLICIT = new Set(['structure', 'function'])
const FOLD_KEYS = new Set(['evidence', 'touched'])
const ENTRY_KEYS = new Set(['id', 'newBugs', 'walked', 'changed', 'probed'])

const [mapFile, foldFile] = process.argv.slice(2)
if (!mapFile || !foldFile) { console.error('usage: node update-map.mjs <map.json> <fold.json>'); process.exit(2) }

const fail = msg => { console.error(`FAIL: ${msg}\nNothing was changed.`); process.exit(1) }
const load = f => { try { return JSON.parse(readFileSync(f, 'utf8')) } catch (e) { fail(`cannot read/parse ${f}: ${e.message}`) } }
const map = load(mapFile)
const fold = load(foldFile)
if (!Array.isArray(map?.nodes) || !map.nodes.length) fail(`${mapFile} has no nodes; build the map first (references/build-the-map.md)`)
if (typeof fold !== 'object' || fold === null || Array.isArray(fold)) fail('the fold must be a JSON object')

const COUNTERS = ['traversals', 'bugsFound', 'dryStreak']
const byId = new Map()
const leaves = []
const fresh = []   // nodes with none of the counters yet (just added); they start at 0/0/0
function index(node, path) {
  if (typeof node !== 'object' || node === null || Array.isArray(node)) fail(`${path}: node is not an object`)
  const at = `${path}/${node.id}`
  if (typeof node.id !== 'string' || !node.id) fail(`${at}: id must be a non-empty string`)
  if (byId.has(node.id)) fail(`${at}: duplicate id "${node.id}"; ids must be unique (run validate-map.mjs)`)
  byId.set(node.id, node)
  const present = COUNTERS.filter(k => node[k] !== undefined)
  if (present.length === 0) fresh.push(node)
  else if (!COUNTERS.every(k => Number.isInteger(node[k]) && node[k] >= 0))
    fail(`${at}: counters must be integers >= 0, or all absent on a new node (got ${COUNTERS.map(k => `${k}=${JSON.stringify(node[k])}`).join(', ')})`)
  for (const k of ['dimensions', 'qualities', 'probed'])
    if (node[k] !== undefined && !(Array.isArray(node[k]) && node[k].every(v => typeof v === 'string')))
      fail(`${at}: ${k} must be an array of strings (got ${JSON.stringify(node[k])})`)
  const kids = node.children ?? []
  if (!Array.isArray(kids)) fail(`${at}: children must be an array (got ${JSON.stringify(kids)})`)
  const o = node.heatOverride   // same rule as validate-map.mjs
  if (o !== undefined && (!HEATS.has(o?.heat) || typeof o?.reason !== 'string' || !o.reason.trim()))
    fail(`${at}: heatOverride must be { heat, reason } with heat one of ${[...HEATS].join('|')} and a non-empty reason (got ${JSON.stringify(o)})`)
  if (o !== undefined && kids.length) fail(`${at}: heatOverride belongs on leaves; a parent's heat is its hottest leaf`)
  if (kids.length === 0) leaves.push(node)
  else for (const c of kids) index(c, at)
}
for (const n of map.nodes) index(n, '')
const isLeaf = n => !(n.children || []).length
const leavesUnder = n => isLeaf(n) ? [n] : n.children.flatMap(leavesUnder)

// 0) check the whole fold; nothing is mutated until every check has passed
for (const k of Object.keys(fold)) if (!FOLD_KEYS.has(k)) fail(`unknown fold key "${k}" (allowed: ${[...FOLD_KEYS].join(', ')})`)
const evidence = fold.evidence ?? []
if (!Array.isArray(evidence) || !evidence.every(r => typeof r === 'string' && r)) fail('"evidence" must be an array of non-empty strings')
const refs = [...new Set(evidence)]   // a ref listed twice in one fold is recorded once
const folded = new Set((map.folded || []).map(f => f.ref))
const again = refs.filter(r => folded.has(r))
if (again.length) fail(`evidence already folded: ${again.join(', ')} (a changed-only fold may omit evidence)`)
const touched = fold.touched ?? []
if (!Array.isArray(touched)) fail('"touched" must be an array')

const entries = []
const namedBy = new Map()   // leaf id -> the fold entry that named it
touched.forEach((e, i) => {
  const at = `touched[${i}]${typeof e?.id === 'string' ? ` (${e.id})` : ''}`
  if (typeof e !== 'object' || e === null || Array.isArray(e)) fail(`${at} must be an object`)
  for (const k of Object.keys(e)) if (!ENTRY_KEYS.has(k)) fail(`${at}: unknown key "${k}" (allowed: ${[...ENTRY_KEYS].join(', ')})`)
  const n = typeof e.id === 'string' && byId.get(e.id)
  if (!n) fail(`${at}: id must name a node in the map`)
  if (e.newBugs !== undefined && !(Number.isInteger(e.newBugs) && e.newBugs >= 0)) fail(`${at}: newBugs must be an integer >= 0 (got ${JSON.stringify(e.newBugs)})`)
  for (const k of ['walked', 'changed']) if (e[k] !== undefined && typeof e[k] !== 'boolean') fail(`${at}: ${k} must be true or false (got ${JSON.stringify(e[k])})`)
  if (e.probed !== undefined && !(Array.isArray(e.probed) && e.probed.every(p => typeof p === 'string'))) fail(`${at}: probed must be an array of strings`)
  const walked = e.walked ?? !e.changed
  if (e.probed?.length && !walked) fail(`${at}: probed needs a walk; nothing is probed on a leaf that was not walked`)
  const claim = entry => {
    if (namedBy.has(entry.id)) fail(`${at}: leaf ${entry.id} is already named by ${namedBy.get(entry.id)}; give each leaf one entry per fold`)
    namedBy.set(entry.id, at)
    entries.push(entry)
  }
  if (isLeaf(n)) {
    const facets = new Set([...(n.dimensions || []), ...(n.qualities || [])])
    const stray = (e.probed || []).filter(p => !facets.has(p))
    if (stray.length) fail(`${at}: probed ${stray.join(', ')} is not among this leaf's dimensions or qualities (${[...facets].join(', ') || 'none'})`)
    claim({ ...e, walked })
    return
  }
  if (!e.changed || walked || e.newBugs || e.probed?.length)
    fail(`${at} is not a leaf; only "changed" may name a parent. Attribute walks and bugs to leaves (add a leaf if none fits).`)
  for (const l of leavesUnder(n)) claim({ id: l.id, changed: true, walked: false, via: e.id })
})
if (!refs.length && entries.some(e => e.walked || e.newBugs))
  fail('a fold with a walk or bugs must cite its "evidence" (hunt report or bug ids), so replaying it is refused rather than counted twice')

const unprobed = n => [...(n.dimensions || []), ...(n.qualities || [])]
  .filter(d => !IMPLICIT.has(d) && !(n.probed || []).includes(d))

// Same rule as suggestHeat in validate-map.mjs; change both together. The Heat table in ../SKILL.md is canonical.
function suggestHeat(n) {
  if (n.traversals === 0 && n.bugsFound === 0) return 'unknown'
  if (n.dryStreak === 0) return 'hot'
  if (n.dryStreak === 1) return 'warm'
  return unprobed(n).length ? 'warm' : 'cold'
}

// 1) start new nodes at zero, then apply the fold to leaves
for (const n of fresh) { n.traversals = 0; n.bugsFound = 0; n.dryStreak = 0 }
for (const e of entries) {
  const n = byId.get(e.id)
  const newBugs = e.newBugs || 0
  if (e.changed) { n.dryStreak = 0; delete n.probed }
  if (e.changed || newBugs > 0) delete n.heatOverride
  if (e.walked) n.traversals += 1
  n.bugsFound += newBugs
  if (newBugs > 0) n.dryStreak = 0
  else if (e.walked) n.dryStreak += 1
  if (e.walked && e.probed?.length) n.probed = [...new Set([...(n.probed || []), ...e.probed])]
}
for (const l of leaves) l.heat = l.heatOverride?.heat ?? suggestHeat(l)
const neverWalked = entries.filter(e => e.changed).map(e => byId.get(e.id))
  .filter(n => n.traversals === 0 && n.bugsFound === 0).map(n => n.id)

// 2) parents take their hottest leaf
function rollup(node) {
  if (isLeaf(node)) return node.heat
  let best = 'cold'
  for (const c of node.children) { const h = rollup(c); if (RANK[h] > RANK[best]) best = h }
  return (node.heat = best)
}
for (const n of map.nodes) rollup(n)

// 3) ledger, convergence signal, stamps; write via rename so a crash cannot leave half a map
map.lastUpdated = new Date().toISOString()
if (refs.length) map.folded = [...(map.folded || []), ...refs.map(ref => ({ ref, at: map.lastUpdated }))]
map.converged = leaves.every(l => l.heat === 'cold')
if (!map.mappedAt) map.mappedAt = map.lastUpdated
writeFileSync(`${mapFile}.tmp`, JSON.stringify(map, null, 2) + '\n')
renameSync(`${mapFile}.tmp`, mapFile)

// 4) report
const tally = { hot: 0, unknown: 0, warm: 0, cold: 0 }
for (const l of leaves) tally[l.heat]++
console.log(`folded ${entries.length} leaf entr${entries.length === 1 ? 'y' : 'ies'} into ${mapFile}`)
for (const e of entries) {
  const n = byId.get(e.id)
  const how = [e.changed && `changed${e.via ? ` via ${e.via}` : ''}`, e.walked ? 'walked' : 'not walked', `+${e.newBugs || 0} bug(s)`].filter(Boolean).join(', ')
  const open = unprobed(n)
  console.log(`  ${e.id}: ${how} -> dryStreak=${n.dryStreak}, heat=${n.heat}${open.length ? ` (un-probed: ${open.join(', ')})` : ''}`)
}
if (neverWalked.length) console.log(`changed but never walked (still unknown; add to charterIdeas): ${neverWalked.join(', ')}`)
const overridden = leaves.filter(l => l.heatOverride)
if (overridden.length) console.log(`heat overrides in force (delete any whose reason has lapsed): ${overridden.map(l => `${l.id}=${l.heatOverride.heat}`).join(', ')}`)
console.log(`leaves: ${tally.hot} hot | ${tally.unknown} unknown | ${tally.warm} warm | ${tally.cold} cold`)
const remaining = leaves.filter(l => l.heat !== 'cold').sort((a, b) => RANK[b.heat] - RANK[a.heat] || b.bugsFound - a.bugsFound)
if (remaining.length) {
  console.log('hottest remaining leaves:')
  for (const l of remaining.slice(0, 8)) console.log(`  [${l.heat}] ${l.id} (${l.label}) bugs=${l.bugsFound} traversals=${l.traversals}`)
}
console.log(map.converged
  ? 'CONVERGED: every leaf is cold. Confirm the dry declaration (SKILL.md, "When to stop").'
  : `NOT converged: ${remaining.length} leaf/leaves still hot, warm or unknown.`)
