# Content standards

EdOrbit explains things to teens and early learners. It must be **fun, short and correct**, in that order of visibility and the reverse order of importance.

## Every concept

- **Short.** Story chapters are 1–3 sentences per paragraph. Two to four chapters. If a chapter needs more, it needs a widget instead.
- **Plain words first.** Define every term the first time it appears. Jargon goes in "For the curious".
- **Every claim is backed.** A number or fact on the page either comes from a tested model (STEM) or a cited source (all subjects). Story claims, quiz answers and mission hints are covered by tests.
- **State the simplifications.** Every concept lists what it leaves out, in friendly language, on the page.
- **Interactive, not decorative.** Widgets respond to a real model or real data. No animation pretends to be a result.
- **No emojis** in content or UI.
- **Inclusive and kind.** Examples should work for readers anywhere. Avoid stereotypes. Humour must never punch down.

## Numerical and STEM concepts

- Document the model, its equations and its assumptions.
- Use SI units internally; convert only for display.
- Include at least one validation test against a known result (e.g. the ISS period, Earth's year).
- Choose numerical methods deliberately and document their limits (see below).

### Integrators available in `@edorbit/physics`

| Integrator       | Order | Symplectic | Notes                                                                        |
| ---------------- | ----- | ---------- | ---------------------------------------------------------------------------- |
| `velocityVerlet` | 2     | yes        | Default for orbital propagation; bounded, oscillating energy error.          |
| `leapfrog` (KDK) | 2     | yes        | Equivalent to Verlet for velocity-independent forces.                        |
| `rk4`            | 4     | no         | Accurate per step, but energy drifts over long runs. Use for short horizons. |

Keep at least ~500 steps per period for second-order methods, and more near the closest point of very squished orbits. The engine uses a fixed timestep regardless of frame rate. A faster time scale runs more steps, never bigger ones.

## History, social science and humanities concepts

- **Cite sources** for every factual claim. Prefer primary sources and reputable secondary scholarship, and mark which is which.
- **Dates and places** must be specific and sourced. Flag uncertain or approximate dates ("c. 1450").
- **Contested topics.** Say that there is debate, and present the main views fairly. Do not present one interpretation as settled fact.
- **Quotations** must be exact, attributed and cited. Translations must name the translator or note that they are paraphrased.
- **Images and maps** need a licence compatible with MIT redistribution; record them in [assets.md](assets.md).
- **Interactive "what if" widgets** must label themselves as thought experiments, not history.

## Review

Accuracy is part of code review. A reviewer with relevant knowledge should check the content, the tests or sources, and the stated simplifications before a concept is merged.
