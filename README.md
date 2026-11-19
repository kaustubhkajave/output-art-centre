# OUTPUT: Contemporary Art Centre Website & Project Hub

Prototype: a UX/UI website project presented as client work, for a contemporary art centre in a former power station.

- **`index.html`: the website.** What's on (with sound, light and time-needed tags), a pinned horizontal tour of the building, a visit planner that builds a route around the time you have, timed-ticket booking and an access & sensory guide.
- **`project.html`: the project hub.** Brief, research (entries-per-hour heatmap, intercepts, access panel), personas, information architecture before and after, wireframes, visual system, usability testing and handoff.

> Research figures and test results in the project hub are illustrative: they show the method, not real data.

## Design direction

Inspired by current Awwwards Sites of the Day, and a deliberate break from the warm, rounded style of the earlier projects:

- **Two colours and a signal.** Paper `#ECEBE6`, ink `#0D0D0D`, and acid `#D4FF3A`, which appears only on ink or behind ink text.
- **Oversized expanded type.** Archivo at 112–125% width, with a full-bleed wordmark sized to fill the screen, plus IBM Plex Mono for labels.
- **Square corners and visible rules.** Black-and-white photography that turns to colour on hover.
- **Signature interactions.** A cursor-following preview on the exhibition list, a pinned horizontal scroll through the building, and a live route drawn on a building cross-section.

## UX highlights

| Problem | Solution |
|---|---|
| Weekend queues at the door | Timed slots described in words ("Quiet", "Busy", "12 left") |
| "Is it loud? Is there strobe?" calls | Warning tags on every listing, a "Hide loud or flashing" filter, and a sensory guide |
| "We only have 90 minutes" | A planner that picks and orders stops, with step-free, calm and children options |
| Child-only and member bookings failing | Clear rules with an error summary that says how to fix each problem |

## Accessibility (WCAG 2.2 AA)

- **Contrast:** every text pair is checked and noted in `styles.css`. The heatmap uses five fixed steps so each cell's text passes AA.
- **Controls:** native radios and checkboxes, 44px targets, visible focus (an ink ring with a signal halo), and focusable scroll regions.
- **Reduced motion:** the marquee stops, the horizontal scroll falls back to a normal swipe row, and the hero zoom is removed.
- **Without the mouse:** the route is a real ordered list, and the map is supporting art with a `<desc>`.

## Credits

Photography from [Unsplash](https://unsplash.com/license) (free licence), stored locally in `img/`.

## Files

```
index.html     website
project.html   project hub
styles.css     tokens + website styles
project.css    hub styles
js/app.js      status, what's on, building scroll, planner, tickets
js/project.js  heatmap + phase nav
img/           photography (Unsplash)
```
