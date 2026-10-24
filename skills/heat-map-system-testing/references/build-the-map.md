# Build or extend the product map

Read this when no map exists, the product has grown, or a hunt found an affordance the map lacks.

The goal is a decomposition that misses nothing a user can reach, with the facets worth testing
tagged. A shallow walk is the main way this fails. The map exists to catch what goal-driven charters
slide past, such as a control inside a collapsed dropdown that no user story happened to open.

Unlike the hunter, you may read structure (routes, menu definitions, command definitions, API specs,
source) to confirm you reached every surface.

## Steps

1. **Extend rather than replace.** If a map exists, keep every node's counters and heat. Add new
   nodes without `traversals`, `bugsFound`, `dryStreak` or `heat`: the next run of `update-map.mjs`
   starts them at zero and `unknown`. Remove a node only when the thing is gone, noting the removal in its
   parent's `notes`. Mark changed areas through a `changed: true` fold, not by editing counters.
   When splitting a leaf into children, move its counters, `heat`, `probed` and any `heatOverride`
   to the child that stands for the original control, so its evidence carries over; the new
   parent and other children start without counters.
2. **Reach every surface.** Choose the route for the product type:
   - **Web or Electron:** visit every route or window, signed in with the test account when the
     product has a login (create one if the project allows). Run
     `node <skill-dir>/scripts/enumerate-ui.mjs <url | electron-main> <map-dir>/shots` on each screen
     for a raw affordance dump; the second argument keeps screenshots out of the product tree.
     Smoke-test it first (launch, screenshot, dump). Open every menu, dropdown, tab, dialog and
     context menu so hidden affordances are listed too. Cross-check against the router or menu
     definitions.
   - **CLI:** walk `--help` recursively and the command definitions. Controls are subcommands, flags,
     arguments, stdin, config keys and environment variables. Outputs users depend on, such as exit
     codes, files written and machine-readable stdout, are not controls: tag the command that
     produces them (`interfaces` for files and other programs, `data` for output formats) and name
     them in its `notes`.
   - **API or service:** endpoint groups, endpoints, then parameters and auth, from the OpenAPI
     document or route table.
   - **Other desktop apps:** the platform's accessibility tree or automation interface, plus menus.
3. **Structure the tree.** Group into surface → panel → control, skipping panels where the product
   has no natural regions (a CLI command's flags can sit directly under it). Give each node a stable, meaningful
   id (`surface:settings`, `panel:toolbar`, `control:export-btn`, `control:init--force`), the label a
   user sees or types, and for controls an `affordance`. Drop pure chrome such as scrollbars and layout
   wrappers, and collapse repeated rows into one representative control. A control is something a
   user acts on, not every DOM node.
4. **Tag `dimensions` selectively**: `data` where values flow through, `interfaces` where it persists
   or calls a backend, `operations` for modes and multi-step sequences, `time` where state carries
   across relaunches or mode switches, `platform` where it depends on the environment. Tag only facets
   a real user could break. A static button may carry none; a filter input carries `data`; a mode
   toggle carries `operations` and `time`. A map where every control carries every dimension has not
   been judged.
5. **Tag `qualities`** when the project has quality priorities: list them in the top-level
   `qualities`, then tag nodes where each is a live risk (for example security at authentication and
   file writes, accessibility at custom widgets).
6. **Seed from evidence, not guesses.** Warm the map from what is already known: fold known open bugs
   (`walked: false`, `newBugs`, with their bug ids as `evidence`), and add recently changed areas to `charterIdeas` with their node ids,
   so they rank first among the unknowns. (A `changed` fold resets `dryStreak` and `probed` on any leaf, but a leaf never walked shows no
   visible effect: its heat stays `unknown`.)
7. **Anchor and validate.** Set `app` and `builtFrom` (commit or build id). If step 6 folded
   nothing, fold `{"touched": []}`
   (`node <skill-dir>/scripts/update-map.mjs <map-dir>/product-map.json fold.json`), so the script
   fills in counters, heat, `mappedAt` and `converged` rather than you. Then run
   `node <skill-dir>/scripts/validate-map.mjs <map-dir>/product-map.json` until it prints `OK`.
8. **Park what you cannot reach.** Anything behind a login you cannot obtain, a native dialog or a
   gesture the harness cannot perform goes in that node's `notes` (or its parent's) with the reason.
   Never guess that it exists or how it behaves.

## Done when

Every reachable surface is present, hidden affordances were opened rather than missed, ids are
stable, controls carry selective tags, the validator prints `OK`, and the hand-back lists node and
leaf counts plus everything not reached and why.
