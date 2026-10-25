# GAME DESIGN BRIEF — LAST CHANCE MOTEL: NIGHT SHIFT

## Creative north star
A compelling, spoiler-free, 15–25-minute, top-down 2D pixel-art survival-horror mini-game that sells rentals of *Last Chance Motel*. Tone: neon pink roadside motel meets darkly funny slasher. The existing 30-second collectible walk is not acceptable as the finished game.

## Platform
Browser only: HTML5 Canvas, CSS, JavaScript. Desktop keyboard and mobile touch. No account, installation, payment, app store, or backend required to play. May use a lightweight JS game framework if justified, but deliver an easily hosted static build. Sound/music generated locally or packaged with appropriate rights; audio opt-in and mute.

## Map fidelity
Use `references/real_motel_annotated_aerial.png` as the physical orientation reference, while styling for the film rather than the real-life location. From aerial: southeast office, two southern/central motel room blocks, fish-shaped pool center-west, outdoor chapel center, diner east, car graveyard west and north, desert road entrance northeast. Blue marked route curves around northern/western perimeter. This is an approximation based on user markup, not a measured architectural plan. Separate map scenes with door transitions and return routes.

## Gameplay levels
1. OFFICE (indoor separate screen): Bobbi Love check-in, readable speech bubbles over sprites, desk/register/security props, first key and locked back room, tutorial.
2. GUEST ROOM (enterable separate screen): furniture and bathroom collision, drawers, inspection, multi-stage clue puzzle; visible cause/effect and journal update.
3. DINER (separate screen): booths, counter, kitchen, NPC dialogue, puzzle involving order slips / jukebox / register. Avoid arbitrary pixel hunts.
4. COURTYARD + FISH POOL + OUTDOOR CHAPEL: physical pool collision and pathways, wedding-themed objective, Harold patrol and stealth chase.
5. CAR GRAVEYARD (maze): dense impassable wrecks, fences, dead ends, locked gate, multiple routes, hiding places, Monster patrol, sightline detection, escape challenge.
6. SECRET GARAGE (optional): discoverable through clue chain; higher-difficulty puzzle and Easter egg, not required for main escape.

## Enemy design
HAROLD: recognizable roaming threat with telegraphed detection, chase, and cooldown. MONSTER: separate and more dangerous AI with patrols, line-of-sight, audible cues, and hiding mechanics. Collision must matter; enemies must respect walls and obstacles. No unfair instant kills. Player gets health or recoverable mistakes; retry from checkpoints.

## Progression design
Three meaningful gates rather than three unguarded pickups: office check-in grants room access; room puzzle unlocks diner lead; diner clue opens chapel/graveyard route; chapel objective opens junkyard gate; navigate maze while evading Monster to acquire Cadillac keys or escape part; return to Cadillac for escape. Optional garage offers alternate reward. Show objective, hearts, key inventory, and progress at top HUD; allow mission log details by click/tap. Save progress via localStorage if practical. Target 15–25 minutes on first playthrough; adjust after playtesting.

## UI/UX
Dialogue bubbles anchored above speaking NPC with name and clear contrast, auto-positioned within viewport, readable on mobile. Top HUD: location, current mission, health, inventory/items, sound control. Keyboard WASD/arrows, E/Space interact; touch joystick/D-pad and action button. Interaction prompt near object. Pause and restart. Readable, accessible contrast; avoid flashing visuals by default.

## Sound
Original 8-bit chiptune soundtrack with distinct area loops and danger stinger, user-initiated audio toggle; respect browser autoplay policy. Synthesized WebAudio or licensed sound files only. Never copy recognizable Nintendo melodies.

## Marketing conversion
On win and loss screens, show compelling film CTA: 'YOU SURVIVED THE GAME. CAN YOU SURVIVE THE MOVIE?' / 'CHECK IN. NEVER CHECK OUT.' Link to https://lastchancemotelmovie.com/ with label 'RENT OR BUY THE MOVIE'. Verify links. Optional shareable survival score, but don't require sign-in. Do not reveal the Andi family connection or any major ending twist.

## Visual assets
Character images and posters in `references/` are user-provided design references; not game-ready sprites. Build original sprites from visual references, distinguish Bobbi Love, Casey, Andi, Betty, Harold, Monster. Some reference files are unlabeled; ask user to identify rather than guessing. Use film poster's hot pink neon, sunset orange, teal pool, distressed retro signage, and dusty desert palette. Monster likeness needs reference; do not invent actor resemblance.

## Milestones
M1: Fix V3 rendering and create robust scene architecture + real collision + room transitions.
M2: Office and guest room fully playable with puzzle and clear NPC speech bubbles.
M3: Diner and chapel/courtyard puzzles, HUD, save, music.
M4: Car graveyard maze + Monster AI + Harold AI + garage.
M5: End-to-end playtest, mobile QA, polish, analytics-ready CTA, deployment.

## Non-goals
No 3D, multiplayer, login, ads, microtransactions, paid backend, or copyrighted game music. No screenplay spoilers.
