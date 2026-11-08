# Founder Player Prototype — Phase 01

This is an isolated, client-only movement and camera prototype. It does not connect to Supabase, Hermes, Vapi, n8n, or live agent data.

## Open

Open `/founder-prototype/` on the same static hosting preview that serves the repository root. The prototype reuses the existing `/lib/three.min.js` (Three.js r128).

## Controls

- WASD / arrow keys: move
- Mouse: look around (pointer lock on desktop, drag fallback)
- Shift: run
- Space: jump
- V or the camera button: switch first/third person
- Reset button: return to spawn
- Escape: release pointer lock

## Scope and known limitations

- The current human-shaped character is a lightweight procedural stand-in, not the final realistic avatar.
- Replace it with a properly licensed, optimized GLB after selecting an asset and validating its rig/animation compatibility with Three.js r128.
- The test office has simple rectangular collision boundaries and obstacle footprints; this is not a full physics engine.
- Desktop controls are the initial target. Mobile touch controls, audio, agent presence, multiplayer, and live integrations are out of scope.
- Performance must be measured on the target PC; no FPS guarantee is made.

## Safety

The existing `index.html`, Supabase configuration, database, authentication, and production deployment are not changed by this prototype.
