# MounaDev HQ — World Design Blueprint

**Status:** Design baseline for Founder Player Prototype Phase 02  
**Target:** Isolated Preview branch only  
**Branch:** `feature/founder-player-prototype`  
**Production:** No merge or production deployment authorized

## 1. Experience goals

MounaDev HQ should feel like a believable, calm, premium company headquarters—not a dashboard wrapped in a 3D scene. The founder can explore the building in first-person or third-person, visit teams, enter private rooms, and interact with agents. The virtual building is a spatial interface to real company work.

Design priorities:

1. Comfortable visual contrast; no large pure-white surfaces or glaring emissive lighting.
2. Clear navigation and recognizable room identities.
3. Believable scale, sightlines, doorways, stairs/elevator access, and walkable routes.
4. Lightweight rendering suitable for the known Intel HD 620 / 8 GB RAM target.
5. Honest representation of agent activity: no decorative animation that implies an agent is working when it is not.

## 2. Building program

The building is planned as four internal floors plus a rooftop. Floor numbering is conceptual and can be adjusted to the final navigation convention.

| Level | Zone | Rooms and purpose |
|---|---|---|
| Ground / 00 | Public & welcome | Entrance, reception, waiting lounge, coffee corner, visitor meeting room, elevator lobby |
| 01 | Technology | Development, AI & Automation, Technical Support, Design & Creative |
| 02 | Business operations | Sales & Lead Generation, Customer Support, Operations, Finance |
| 03 | Executive | Founder private office, Manager / coordination room, CEO office, boardroom, secure reporting room |
| Roof | Social / reset | Landscaped terrace, shaded seating, small event / informal meeting area |

### Spatial rules

- Each floor has a central circulation spine connecting elevator, stairwell, and the main corridor.
- Team rooms branch off the corridor and remain visually identifiable through signage and restrained accent colors.
- Private offices use controlled entry points; a locked room must not be bypassable by walking through glass or decorative geometry.
- Meeting rooms should have a visible table, seating, display wall, and an interaction point.
- The rooftop is accessed from the executive floor through a clearly marked stair/elevator landing.
- Avoid long featureless corridors. Use windows, wall panels, plants, room signs, and lighting pools as landmarks.

## 3. Visual identity

### Palette direction: warm graphite + muted bronze + natural materials

| Surface / role | Direction | Approximate color |
|---|---|---|
| Main walls | Warm stone / muted greige | `#777873` |
| Secondary walls | Deep graphite | `#30383B` |
| Floors | Smoked oak or medium charcoal stone | `#454746` |
| Metal trim | Brushed muted bronze | `#A88755` |
| Wood | Walnut / smoked oak | `#604A38` |
| Upholstery | Desaturated olive / slate | `#59635D` / `#53616A` |
| Glass | Light smoke tint, moderate transparency | `#78909A` |
| UI panels | Deep charcoal, translucent | `#151B1E` |
| Status: active | Soft green, used sparingly | `#83A98A` |
| Status: attention | Muted amber | `#C49A62` |

Avoid pure white walls, large bright floors, strong blue-white lighting, excessive gold, and high-intensity bloom. Use warm indirect lighting with localized practical fixtures. Keep the scene readable through material contrast rather than brightness.

### Material language

- Reception and executive areas: walnut, bronze details, acoustic wall panels, textured stone.
- Technology areas: graphite, smoked glass, practical task lighting, subtle cable / equipment details.
- Business areas: warm neutral walls, acoustic partitions, plants, durable wood finishes.
- Lounge and rooftop: natural textures, comfortable upholstery, greenery, soft ambient lighting.

## 4. Agent presence and interaction

An agent's real operational state and its virtual avatar position are separate concepts.

- **Working:** show the agent at its assigned workstation only when an authoritative status source confirms active work.
- **Waiting / idle:** agent may appear in a neutral idle pose or a designated break area; do not fabricate work activity.
- **Unavailable / offline:** show a clear unavailable state; do not simulate presence.
- **In a meeting:** show meeting presence only when a real meeting/session exists.
- **Unknown / stale:** label the state as unknown or last updated; never silently treat stale data as live.

Selecting an agent opens a compact interaction panel with identity, role, current status, last update, permitted chat/voice actions, and relevant task context. Group meeting interactions are a later capability and must be backed by real session state.

## 5. Founder and executive spaces

- Founder private office: largest private room, direct view or access to a small private meeting space, personal control panel, and explicit founder-only controls.
- CEO office: separate private room for Rihab, with CEO-level tools only; CEO must not inherit founder-only permissions.
- Manager / coordination room: team overview, approvals queue, escalations, and reports, limited by backend authorization.
- Boardroom: group meeting space with a shared display and clear join / leave interaction.

The visual design does not grant permissions. Any future account, room access, task action, or data access must be enforced server-side with explicit role checks.

## 6. Navigation and interaction model

- First-person and third-person camera modes remain available.
- Arrow keys are the primary movement controls; WASD is an alternative.
- Mouse controls camera look; Shift runs; Space jumps; V switches camera; Escape releases pointer lock.
- Elevator opens a floor selector and moves the player only after selecting an accessible destination.
- Room doors should have visible open/closed states and usable interaction zones.
- Context interactions appear near the relevant object or agent, not as a permanent cluttered HUD.
- A small floor map / wayfinding panel should show the current floor, player location, elevator, stairs, and key destinations.

## 7. Performance budget and asset strategy

Known target hardware: Intel Core i5-7200U, 8 GB RAM, Intel HD 620 integrated graphics.

- Keep the initial target to a modest draw-call and polygon budget; use instancing for repeated furniture, lights, plants, and architectural details.
- Use optimized, licensed GLB assets with compressed textures and simple rigs.
- Load only the current floor plus limited adjacent-floor context; lazy-load other floors.
- Use baked lighting or simple ambient lighting before considering real-time shadows.
- Provide Low / Balanced / High quality presets; default to Low or Balanced on integrated graphics.
- Pause distant agent animations and nonessential effects.
- Measure actual frame time, memory, and loading time on the target PC before setting a performance claim.

## 8. Delivery sequence

### Phase 02A — Design and greybox
1. Establish floor dimensions, vertical circulation, room adjacency, and collision-safe walkways.
2. Build a low-detail multi-floor greybox with consistent scale.
3. Confirm doors, elevator, stairs, room access, and sightlines before decoration.

### Phase 02B — Visual environment
1. Apply the eye-comfort palette and material language.
2. Add reception, team rooms, executive rooms, and rooftop in priority order.
3. Add signage, wayfinding, and lighting with restrained visual effects.

### Phase 02C — Character and interaction
1. Select and validate a properly licensed realistic avatar asset.
2. Validate skeleton, scale, animation clips, and performance in Three.js r128.
3. Add doors, elevator, room interaction, agent detail panel, and context prompts.

### Phase 02D — Live systems (separate approval required)
1. Define the authoritative agent-presence contract.
2. Define authenticated APIs and role-based permissions.
3. Add chat/voice and meeting sessions through a secure backend.
4. Consider private multiplayer only after authorization, data isolation, and synchronization design are reviewed.

## 9. Explicitly deferred issues

The following user-reported issues remain open and must be tested/fixed before treating the movement prototype as complete:

- Character can become stuck against the glass divider / obstacle collision.
- First-person camera orientation can appear inverted or incorrect.
- Movement direction does not consistently match the pressed arrow.
- Current procedural character is not the final realistic avatar.

Do not mark these as fixed based only on a successful deployment. They require browser-based gameplay verification.

## 10. Scope and safety boundaries

This blueprint is documentation only. It does not authorize or perform:

- Changes to `main`, production, Supabase, Auth, RLS, or database data.
- Hermes, Vapi, n8n, telephony, or live agent integrations.
- Account creation, purchases, subscriptions, or external provider setup.
- Private multiplayer backend or permission changes.
- PR merge or production deployment.

All future implementation remains isolated to `feature/founder-player-prototype` and Preview until separately reviewed and explicitly approved.
