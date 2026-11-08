# Founder Player Prototype — Phase 01

This is an isolated, client-only movement and camera prototype. It does not connect to Supabase, Hermes, Vapi, n8n, or live agent data.

## Open

Open `/founder-prototype/` on the same static hosting preview that serves the repository root. The prototype reuses the existing `/lib/three.min.js` (Three.js r128).

## Controls

- WASD / arrow keys: move
- Mouse: look around (pointer lock on desktop, drag fallback)
- Shift: run
- Space: jump
- E near the east-side elevator: open the floor selector; choose 0–4 or click a destination
- V or the camera button: switch first/third person
- Reset button: return to spawn
- Escape: release pointer lock

## Implemented in this prototype

- Ground-floor furniture collision and a central passage through the glass divider.
- Separate collision maps for the ground floor and upper floors.
- An elevator landing with a west-facing exit and floor destinations aligned to the building decks (0, 4.2, 8.4, 12.6, and 16.9 metres).
- Switchback stair support surfaces aligned to the visible stair flights and landings, with guarded deck snapping to avoid unrelated floor jumps.
- Upper-floor central passageways with proximity-triggered double-door animation.
- A lightweight procedural founder stand-in with basic face and clothing details.

## Known limitations / QA gates

- The character is still a procedural placeholder, not the final realistic human avatar. A properly licensed, optimized GLB must be selected and checked for scale, rig, animations, license, and compatibility with Three.js r128 before integration.
- Elevator floor changes are instant greybox transitions, not a simulated lift ride.
- Upper-floor furniture and all architectural edges do not yet have complete collision coverage.
- Automatic doors are animated visuals; closed-leaf collision and doorway interaction still need browser QA.
- Stair, door, collision, first-person camera orientation, movement direction, and glass-divider escape behavior have not yet passed hands-on browser testing.
- Mobile touch controls, audio, agent presence, multiplayer, and live integrations are out of scope.
- Performance must be measured on the target PC; no FPS guarantee is made.

## Current verification

- JavaScript syntax checks: PASS.
- Static implementation checks for floor heights, stair support zones, automatic door hooks, and collision maps: PASS.
- Browser gameplay verification: BLOCKED because the latest Vercel Preview builds are failing with the Vercel build-rate-limit status. Do not treat static checks as gameplay approval.

## Safety

All work remains isolated on `feature/founder-player-prototype`. Do not merge PR #2 or deploy Production without explicit approval. Supabase configuration, database, authentication, RLS, and live integrations are not changed by this prototype.
