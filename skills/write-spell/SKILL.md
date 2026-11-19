---
name: write-spell
description: Write a spell, a short phrase the model already knows from training that carries a wide concept and stands in for instructions. Use when phrasing reusable guidance for agents, or when asked to write or check a spell.
---

# Write a spell

> "It's LeviOsa, not LevioSA." (Hermione Granger)

A spell is a phrase that was already in the model's training data and captures a wide concept,
such as "spark joy" or "shotgun surgery". A good spell activates an existing part of latent space,
which can be more succinct than writing out the equivalent instructions.

A spell can be the phrase alone, or the phrase followed by a line that says how to read it here:
"No shotgun surgery. Here it applies to the data model itself, not only to code." It can also sit
in brackets beside wording that is already there, as a pointer: "What's the causality chain
behind this happening? (5 Whys)".

Where no known phrase carries the concept, don't make up a spell. It won't work. Describe the
thing plainly instead.

Write down in ordinary words what the guidance is: what to do, what not to do, how to do it and
why. Existing jargon and named experts can be useful. You need this however the entry ends up,
because it is what you test a candidate phrase against, and it is the text itself if no phrase
fits.

Guidance that is a single fact or procedure has no wide concept behind it. Write it as a
description and skip the search for a phrase.

A phrase is a spell when the answer to all three of these is yes.

- **Is it in wide use?** Name where it comes from and what it means there. It should be clear and
  obvious from training data alone.
- **Does it mean what you want?** The reader brings the whole of the source meaning, including the
  parts you did not want. The line after the phrase can narrow that meaning or add to it. If it
  would have to take back part of what the phrase means, describe the thing plainly instead.
- **Is it succinct and meaning-dense?** If there's a simpler way to say it, it's probably not a
  spell.

A phrase you have just written sounds familiar to you, so always get a cold read before you keep
it. Give a fresh agent that has none of your context only the bare phrase, without your own words
around it, and the kind of task. Tell it to rely on training data and not web search, and ask
where the phrase comes from, what it means, and what it would do differently because of it. Where more than one
model family will read the entry, get a read from each. Keep the phrase only if every reader
knows it as an established phrase, and it means to them what you mean and does not steer them
away from it. Otherwise describe the thing plainly.
