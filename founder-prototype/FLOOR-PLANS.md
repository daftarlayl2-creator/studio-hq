# MounaDev HQ — Architectural Greybox Plan

**Revision:** 1.0  
**Implementation target:** Founder Player Prototype / Preview branch  
**Coordinate convention:** X = west/east, Z = north/south, Y = vertical  
**Design footprint:** 30 m × 24 m per floor; clear floor-to-floor height 4.2 m  
**Important:** This is the spatial specification for the next greybox pass. The current playable room remains a single-floor prototype until navigation, collision, and vertical movement are implemented and tested.

## 1. Building grid

- Building footprint: 30 m east-west × 24 m north-south.
- Main public entrance: south facade, centered.
- Main circulation core: slightly east of center; elevator, stairs, and service riser grouped together.
- Main corridor: minimum 2.2 m clear width.
- Secondary corridors: minimum 1.8 m clear width.
- Main doors: 1.1 m clear width; meeting / accessible doors target 1.4 m.
- Keep at least 1.0 m clear around desks, meeting chairs, and interaction hotspots.
- Avoid narrow dead ends and glass corners in primary player routes.

## 2. Vertical stack

| Level | Elevation | Clear height | Primary purpose |
|---|---:|---:|---|
| Ground / 00 | 0.0 m | 4.2 m | Reception, lounge, visitor meeting |
| Technology / 01 | 4.2 m | 4.2 m | Development, AI, support, creative |
| Business / 02 | 8.4 m | 4.2 m | Sales, customer support, operations, finance |
| Executive / 03 | 12.6 m | 4.2 m | Founder, CEO, manager, boardroom |
| Rooftop | 16.8 m | Open air | Terrace, shaded seating, informal meetings |

The elevator and stair core must align vertically on every level. Floor transitions must be explicit interactions; do not silently teleport the player or imply that floors are connected before the elevator / stairs are functional.

## 3. Shared circulation core

Reserve a 6 m × 7 m zone near the east-central portion of the footprint for:

- Elevator shaft and landing.
- Enclosed stairwell with visible up/down direction.
- Small wayfinding panel showing the current floor.
- Service / utility closet (non-interactive in the first pass).

The player route from the entrance to the elevator must remain unobstructed. The elevator landing must have a clear turning radius and must not open directly into a wall, desk, or glass partition.

## 4. Ground floor / welcome

| Zone | Approximate location | Design content |
|---|---|---|
| Entrance vestibule | South-central | Double-height impression, entrance mat, MounaDev identity wall |
| Reception | South-west | Reception desk, logo wall, visitor check-in point |
| Waiting lounge | South-east | Sofas, low table, plants, warm indirect light |
| Visitor meeting room | North-west | 6-seat table, display, acoustic glass |
| Coffee / informal area | North-east | Counter, stools, water / coffee station |
| Elevator lobby | East-central | Elevator, stairs, floor directory |

**Greybox acceptance:** a visitor can enter, identify reception, reach the lounge and meeting room, and find the elevator without crossing furniture or clipping through partitions.

## 5. Technology floor / 01

| Zone | Approximate location | Design content |
|---|---|---|
| Development | West wing | Shared desks, dual-monitor props, small review table |
| AI & Automation | North wing | Focus desks, workflow display wall |
| Technical Support | East wing | Support stations, quiet troubleshooting booth |
| Design & Creative | South wing | Large shared table, moodboard wall, material shelf |
| Shared collaboration | Near core | Small stand-up table and writable wall |

Keep team workstations visually grouped but preserve a continuous corridor loop. Do not use transparent glass as an invisible collision barrier.

## 6. Business floor / 02

| Zone | Approximate location | Design content |
|---|---|---|
| Sales & Lead Generation | West wing | Sales desks, lead pipeline display |
| Customer Support | North wing | Support desks, acoustic call booths |
| Operations | East wing | Operations desks, planning wall |
| Finance | South wing | Smaller controlled-access room, secure document props |
| Shared meeting | Near core | 6-seat collaboration room |

Finance and other sensitive spaces may be visually visible but must use a clearly signposted access state. Visual locks are not security; real access control requires server-side authorization in a separately approved phase.

## 7. Executive floor / 03

| Zone | Approximate location | Design content |
|---|---|---|
| Founder private office | West / south-west | Private desk, guest seating, view wall, founder-only control point |
| CEO office | East / south-east | Separate executive office with CEO role context |
| Manager / coordination | North-west | Team status wall, approvals and escalation workspace |
| Boardroom | North-east | 8-seat table, shared presentation wall |
| Reporting room | Adjacent to core | Compact, restricted reporting space |

Founder and CEO rooms must be distinct. Rihab's CEO role does not imply founder-level permissions. The visual scene must never be treated as the authority for access to tasks, data, or controls.

## 8. Rooftop

- Landscaped perimeter planters.
- Shaded pergola with seating.
- Open central area for informal gatherings.
- Small quiet corner for one-to-one conversations.
- Safety parapet around all exposed edges.
- Clear route back to the elevator / stair core.

No rooftop access until the stair/elevator connection and edge collision are verified.

## 9. Visual / material standards

| Element | Material direction |
|---|---|
| Public floor | Smoked oak / muted charcoal stone |
| Main walls | Warm greige / stone |
| Feature walls | Graphite acoustic panels |
| Joinery | Walnut / smoked oak |
| Metal | Brushed bronze, used as a fine accent |
| Glass | Light smoke tint with visible frame and collision-safe mullions |
| Lighting | Warm indirect cove + low-glare practical fixtures |
| Planting | Desaturated natural greens |

No pure-white floors or walls, no high-intensity bloom, no bright emissive strips, and no cold blue-white ambient wash. Keep important signs readable without relying on luminous white text across large surfaces.

## 10. Greybox build order

1. Build one consistent footprint and floor slab per level.
2. Add aligned elevator and stair core.
3. Add exterior walls, internal partitions, door openings, and guardrails.
4. Add simple room labels and floor directory.
5. Add collision volumes that match visible walls, doors, and glass frames.
6. Test every route with the player before adding furniture.
7. Add furniture as low-poly placeholders only after route clearance passes.
8. Replace placeholders with optimized licensed assets after scale and performance checks.

## 11. Acceptance checks

- Every room has one obvious entrance and an unobstructed exit.
- All corridors preserve the specified clear width.
- Elevator and stairs align across all levels.
- Glass panels have visible frames and matching collision volumes.
- No furniture blocks the shortest route between the entrance and circulation core.
- Player cannot become trapped in corners or between a door and furniture.
- Floor changes occur only through an explicit, functioning transition.
- The scene remains legible at Low quality on Intel HD 620; performance must be measured rather than assumed.
- Current camera and movement defects remain open until tested and verified in the browser.
