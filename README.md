# Piper

Proposal: A cross between classic computer puzzle game pipe dream and a sliding puzzle. Gameplay involves moving pieces around to connect as long a line of pipe as possible before .

##Implementation

I plan to primarily use basic JavaScript with jQuery. There are two main steps to rendering the game. Rendering individual pieces and rendering the material that travels through the pipes (henceforth 'sludge') and acts as a timer. For the first, I expect to use simple images that can be moved and rotated using jQuery. For the sludge I plan to overlay a canvas element with a path and extend that path at each time interval.

No backend needed.

#Wireframes

![wireframes]

[wireframes](/docs/piperframes.png)

#Timeline

Day 1: Basic pipe pieces, manipulation.

Day 2: Sludge mechanics and timing.

Day 3: Game logic.
