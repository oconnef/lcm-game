# Last Chance Motel — Night Shift

A browser-only playable first chapter: check in at the office, enter Room 06, solve the registration-slip puzzle, and return to Bobbi with the diner lead. The current game starts at **`index.html`**. The older HTML files under `source/` remain reference prototypes.

## Play locally

From the repository folder, run:

```sh
python3 -m http.server 8000
```

On the same computer, open `http://localhost:8000/`. Keep the terminal running. Use a server rather than opening `index.html` directly, because this version loads JavaScript modules. If port 8000 is occupied by a server for this folder, reuse it.

Move with WASD / arrows or hold the on-screen direction buttons. Press E / Space or tap the contextual action button near people and objects. Music is opt-in. Escape or Pause freezes movement. Restart asks before clearing progress. Progress saves in this browser on this origin; changing the host or port uses a different save. If browser storage is unavailable, the game reports that progress lasts only for the session.

## Chapter one walkthrough (puzzle spoilers)

1. Walk up to Bobbi at the reception desk and interact to receive the Room 06 key.
2. Walk to the right-hand door and interact to enter Room 06.
3. Read the registration slip on the central table. Note the arrival time, **03:17**.
4. Walk to the drawer at the right, interact, and enter **0317**. Collect the diner voucher.
5. Return through the door at the bottom of the room. Talk to Bobbi to finish the chapter.

The diner and enemy encounters are future chapters. This slice is a short puzzle sequence, not the full 15–25-minute game.

## Verify changes

No build or package installation is required to play. For automated checks:

```sh
node --test tests/night_shift.test.mjs
# With the server above running, Python Playwright installed, and /usr/bin/chromium available:
python3 tests/night_shift_browser.py
```

The unit tests cover progression gates, collisions, nearby interaction selection, and storage recovery. Browser tests complete the chapter using desktop keyboard and mobile on-screen controls, including wrong codes, reloads, music, pause, and restart. Browser screenshots are written to `/tmp/night-shift-desktop.png` and `/tmp/night-shift-mobile.png`.

## Publish the game

Upload `index.html` and the complete `source/night-shift/` directory together to a static web host, preserving their relative paths. No server-side code, build command, credentials, screenplay, or reference artwork is needed. Serve `.mjs` files as JavaScript (`text/javascript` or `application/javascript`). Test the hosted root page before sharing it. This repository has not been deployed automatically.

## Code layout

`source/night-shift/` contains separate modules for state/progression/save, scene definitions/collision, input, canvas rendering/dialogue, generated audio, and runtime/UI wiring. All game visuals are drawn locally with Canvas; no reference photos or screenplay text are bundled into the playable chapter.

---

# Last Chance Motel — Codex Handoff

This is a handoff bundle, NOT a new game build. It contains existing prototype source, the user-supplied annotated aerial map, user-supplied character reference images, the December 2024 screenplay, and implementation guidance.

## Quick start

1. Extract this ZIP into a local folder.
2. Open that folder as a project in Codex (or your editor connected to Codex).
3. Start with `docs/CODEX_TASK.md` and `docs/GAME_DESIGN_BRIEF.md`.
4. Open `source/last_chance_motel_v3.html` in a desktop browser to inspect the previous prototype. It may have rendering bugs; treat it as reference code, not production-ready.
5. Ask Codex to build the game iteratively, run a local dev server, use browser tests, and report test results honestly.

## Contents

- `source/`: V3 and V2 HTML game prototypes plus the original prototype.
- `references/`: character promotional art/reference photographs and annotated aerial property layout provided in chat.
- `screenplay/`: screenplay provided by user; contains major spoilers. Never expose major twists in public game.
- `docs/`: creative direction, development requirements, asset inventory, acceptance tests.

## Creative / rights notes

The supplied images and screenplay are for development reference. Confirm distribution rights and actor likeness permissions before shipping promotional imagery or likenesses publicly. Cadillac Jack's website photographs are NOT included; obtain permission before incorporating any original photographs. Create original pixel-art environments and sprites rather than redistributing external site assets.

Official film site for marketing CTA: https://lastchancemotelmovie.com/ . Verify destination and rental links before public launch.

## Local prototype checks

Serve the repository with Python 3:

```sh
python3 -m http.server 8000 --directory .
```

Open `source/last_chance_motel_v3.html` through that server. V3 is a reference prototype; the gameplay milestones in `docs/` remain future work.

With Python Playwright and Chromium installed at `/usr/bin/chromium`, run the browser regression check in another terminal:

```sh
python3 tests/v3_smoke.py
```

This checks desktop and mobile rendering, startup errors, desktop check-in, mobile control visibility, music toggling, and restart. It does not test a complete playthrough.
