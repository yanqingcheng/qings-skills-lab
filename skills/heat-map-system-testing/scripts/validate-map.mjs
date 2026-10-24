// Check a product heat map's shape and invariants against product-map.schema.json and the heat
// rules in ../SKILL.md. Dependency-free (Node built-ins). Checks structure and arithmetic only,
// never whether the map is comprehensive.
//
//   node validate-map.mjs <map.json>
//
// Exits 0 and prints "OK: ..." when valid; exits 1 and lists each violation otherwise.
// Unrecognised fields are warnings, so hand-added fields in older maps still load.

import { readFileSync } from 'node:fs'

const KINDS = new Set(['surface', 'panel', 'control'])
const HEATS = new Set(['unknown', 'hot', 'warm', 'cold'])
const RANK = { hot: 3, unknown: 2, warm: 1, cold: 0 }
const DIMS = new Set(['structure', 'function', 'data', 'interfaces', 'platform', 'operations', 'time'])
const IMPLICIT = new Set(['structure', 'function'])
const TOP = new Set(['schemaVersion', 'app', 'builtFrom', 'mappedAt', 'lastUpdated', 'converged', 'qualities', 'charterIdeas', 'folded', 'nodes'])
const NODE = new Set(['id', 'label', 'kind', 'affordance', 'dimensions', 'qualities', 'probed', 'traversals', 'bugsFound', 'dryStreak', 'heat', 'heatOverride', 'notes', 'children'])

const file = process.argv[2]
if (!file) { console.error('usage: node validate-map.mjs <map.json>'); process.exit(2) }

let map
try { map = JSON.parse(readFileSync(file, 'utf8')) }
catch (e) { console.error(`FAIL: cannot read/parse ${file}: ${e.message}`); process.exit(1) }

const errs = []
const warns = []
const ids = new Set()
const leaves = []
let nodeCount = 0
const strings = v => Array.isArray(v) && v.every(s => typeof s === 'string' && s)
const isInt = v => Number.isInteger(v) && v >= 0

if (map.schemaVersion !== 1) errs.push(`schemaVersion must be 1 (got ${JSON.stringify(map.schemaVersion)})`)
for (const k of ['app', 'builtFrom']) if (typeof map[k] !== 'string' || !map[k]) errs.push(`top-level "${k}" must be a non-empty string`)
for (const k of Object.keys(map)) if (!TOP.has(k)) warns.push(`unrecognised top-level field "${k}"`)
if (!Array.isArray(map.nodes) || !map.nodes.length) errs.push('top-level "nodes" must be a non-empty array; build the map first')
if (map.qualities !== undefined && !strings(map.qualities)) errs.push('top-level "qualities" must be an array of non-empty strings')
const QUALS = new Set(strings(map.qualities) ? map.qualities : [])
if (map.folded !== undefined && !(Array.isArray(map.folded) && map.folded.every(f => typeof f?.ref === 'string' && f.ref)))
  errs.push('"folded" must be an array of { ref, at }')

// Same rule as suggestHeat in update-map.mjs; change both together. The Heat table in ../SKILL.md is canonical.
function suggestHeat(n) {
  if (n.traversals === 0 && n.bugsFound === 0) return 'unknown'
  if (n.dryStreak === 0) return 'hot'
  if (n.dryStreak === 1) return 'warm'
  const open = [...(n.dimensions || []), ...(n.qualities || [])].filter(d => !IMPLICIT.has(d) && !(n.probed || []).includes(d))
  return open.length ? 'warm' : 'cold'
}

// returns the node's expected heat (leaf: its own; parent: hottest descendant leaf)
function walk(node, path) {
  nodeCount++
  const at = `${path}/${node?.id ?? '?'}`
  if (typeof node !== 'object' || node === null) { errs.push(`${at}: node is not an object`); return 'cold' }
  for (const k of Object.keys(node)) if (!NODE.has(k)) warns.push(`${at}: unrecognised field "${k}"`)
  if (typeof node.id !== 'string' || !node.id) errs.push(`${at}: id must be a non-empty string`)
  else if (ids.has(node.id)) errs.push(`${at}: duplicate id "${node.id}"`)
  else ids.add(node.id)
  if (typeof node.label !== 'string' || !node.label) errs.push(`${at}: label must be a non-empty string`)
  if (!KINDS.has(node.kind)) errs.push(`${at}: kind must be one of ${[...KINDS].join('|')} (got ${JSON.stringify(node.kind)})`)
  if (!HEATS.has(node.heat)) errs.push(`${at}: heat must be one of ${[...HEATS].join('|')} (got ${JSON.stringify(node.heat)})`)
  for (const k of ['traversals', 'bugsFound', 'dryStreak']) if (!isInt(node[k])) errs.push(`${at}: ${k} must be an integer >= 0 (got ${JSON.stringify(node[k])})`)
  if (node.dimensions !== undefined) {
    if (!Array.isArray(node.dimensions)) errs.push(`${at}: dimensions must be an array`)
    else for (const d of node.dimensions) if (!DIMS.has(d)) errs.push(`${at}: dimension "${d}" not one of ${[...DIMS].join('|')}`)
  }
  if (node.qualities !== undefined) {
    if (!strings(node.qualities)) errs.push(`${at}: qualities must be an array of non-empty strings`)
    else for (const q of node.qualities) if (!QUALS.has(q)) errs.push(`${at}: quality "${q}" is not listed in top-level "qualities"`)
  }
  if (node.probed !== undefined) {
    if (!strings(node.probed)) errs.push(`${at}: probed must be an array of non-empty strings`)
    else {
      const facets = new Set([...(node.dimensions || []), ...(node.qualities || [])])
      for (const p of node.probed) if (!facets.has(p)) errs.push(`${at}: probed "${p}" is not one of this node's dimensions or qualities`)
    }
  }
  const o = node.heatOverride
  if (o !== undefined && (!HEATS.has(o?.heat) || typeof o?.reason !== 'string' || !o.reason.trim())) errs.push(`${at}: heatOverride must be { heat, reason } with a valid heat and a non-empty reason`)
  const kids = node.children
  if (kids !== undefined && !Array.isArray(kids)) { errs.push(`${at}: children must be an array`); return 'cold' }
  if (!kids || kids.length === 0) {
    leaves.push(node)
    if (![node.traversals, node.bugsFound, node.dryStreak].every(isInt)) return node.heat
    const expected = HEATS.has(o?.heat) ? o.heat : suggestHeat(node)
    if (node.heat !== expected) errs.push(`${at}: heat "${node.heat}" does not match its evidence ("${expected}"); fold through update-map.mjs or record a heatOverride`)
    return expected
  }
  if (o !== undefined) errs.push(`${at}: heatOverride belongs on leaves; a parent's heat is its hottest leaf`)
  let best = 'cold'
  for (const c of kids) { const h = walk(c, at); if (RANK[h] > RANK[best]) best = h }
  if (node.heat !== best) errs.push(`${at}: parent heat "${node.heat}" should be its hottest leaf ("${best}")`)
  return best
}

if (Array.isArray(map.nodes)) for (const n of map.nodes) walk(n, '')

if (map.converged !== undefined && map.converged !== leaves.every(l => l.heat === 'cold'))
  errs.push(`converged=${map.converged} disagrees with the leaves`)
if (map.charterIdeas !== undefined) {
  if (!Array.isArray(map.charterIdeas)) errs.push('"charterIdeas" must be an array')
  else map.charterIdeas.forEach((c, i) => {
    if (typeof c?.text !== 'string' || !c.text) errs.push(`charterIdeas[${i}]: text must be a non-empty string`)
    if (c?.targets !== undefined) {
      if (!strings(c.targets)) errs.push(`charterIdeas[${i}]: targets must be an array of node ids`)
      else for (const t of c.targets) if (!ids.has(t)) errs.push(`charterIdeas[${i}]: target "${t}" is not a node id`)
    }
  })
}

for (const w of warns) console.error('warning: ' + w)
if (errs.length) { console.error(`FAIL: ${errs.length} violation(s):`); for (const e of errs) console.error('  - ' + e); process.exit(1) }
console.log(`OK: ${nodeCount} nodes (${leaves.length} leaves), ${ids.size} unique ids`)
