# COPY THIS INTO CODEX

You are the lead gameplay engineer for Last Chance Motel: Night Shift, a static-hostable HTML5/JavaScript top-down pixel-art horror game that promotes the film's VOD rentals.

Read `README.md`, `docs/GAME_DESIGN_BRIEF.md`, the aerial image, and the screenplay (only to support spoiler-safe world/character details). Review `source/last_chance_motel_v3.html` for prior work, but do not assume it is bug-free.

FIRST: reproduce and diagnose the existing rendering/visualization errors using a real browser with console logs. Set up a maintainable project with a dev server, separated scene, input, collision, dialogue, NPC, AI, audio, UI and save systems. If a game framework materially helps, use a lightweight framework (Phaser 3 is acceptable) with a reproducible build and static export; otherwise vanilla Canvas is fine. Never require end users to install anything.

THEN: deliver a playable vertical slice with TWO REAL SEPARATE SCENES: motel office and an enterable guest room. Both must have solid walls/furniture collisions, exits/doors, a puzzle with at least two dependent steps, Bobbi Love dialogue bubbles anchored to the speaking sprite, and a persistent top HUD with hearts, objective and inventory. Include keyboard + touch support and original 8-bit music toggle. Provide a short walkthrough and tests.

AFTER THAT: implement the diner, courtyard/fish-shaped pool/outdoor chapel, car graveyard maze with hard barriers and Monster AI, Harold patrol, optional secret garage, win/lose flow and VOD CTA as specified in `docs/GAME_DESIGN_BRIEF.md`. Monster is a required enemy, not an Easter egg.

Test: automated unit tests for scene transitions, collision, inventory/puzzle gates and enemy detection; browser smoke tests for desktop and mobile sizes; manual completion test from start to finish. Do not claim tests you did not run. Use only original or cleared art/music. Keep the film's major twists out of game copy and endings. At each milestone give exact commands for me (a non-developer) to preview and publish the game.

Important: Do not settle for collecting three objects on an open map. Gameplay must have meaningful gates, maze obstacles, indoor scenes, enemy behaviors, and at least 15 minutes of designed content before polish.
