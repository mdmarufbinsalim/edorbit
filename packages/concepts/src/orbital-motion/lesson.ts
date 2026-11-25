import type { LessonDefinition } from "@edorbit/core";

export const lesson: LessonDefinition = {
  story: [
    {
      id: "cannon",
      title: "Fire a cannon. Really, really hard.",
      body: [
        "Imagine a cannon on a mountain so tall it pokes out of the air. Fire a ball and it curves down and lands.",
        "Fire faster and it lands farther away. But Earth is round. Go fast enough and **the ground curves away as fast as you fall**. You never land. That's an orbit.",
      ],
      widget: "cannon",
      quiz: {
        question: "So is the space station floating, or falling?",
        choices: ["Floating. There's no gravity up there", "Falling, all the time"],
        answerIndex: 1,
        why: "Gravity at the ISS is still about 90% as strong as on the ground. Astronauts feel weightless because they and the station are falling together, like everyone in a dropping lift.",
      },
    },
    {
      id: "ovals",
      title: "Closer means faster",
      body: [
        "Most orbits aren't circles. They're ovals (ellipses), with Earth off to one side.",
        "Each dot below is dropped after **the same amount of time**. Near Earth the dots spread out because the satellite is zooming. Far away they bunch up because it's crawling. The shaded slices all have the same area. That's Kepler's 2nd law.",
      ],
      widget: "equal-times",
      quiz: {
        question: "Where on an oval orbit is a satellite fastest?",
        choices: ["Farthest from Earth", "Closest to Earth", "Same speed everywhere"],
        answerIndex: 1,
        why: "Falling inward, gravity speeds it up. Climbing back out, gravity slows it down. It's like a skateboarder in a half-pipe, fastest at the bottom.",
      },
    },
    {
      id: "years",
      title: "Bigger loops, longer years",
      body: [
        "Planets follow the same rules around the Sun. Planets farther out have bigger loops **and** move slower, so their years get long fast.",
        "Kepler spotted the pattern 400 years ago: $T^2 \\propto a^3$. Drag your planet out and see.",
      ],
      widget: "kepler-years",
      quiz: {
        question: "A planet twice as far from the Sun as Earth. How long is its year?",
        choices: ["2 years", "about 2.8 years", "4 years", "8 years"],
        answerIndex: 1,
        why: "$T \\propto a^{3/2}$, so $2^{1.5} \\approx 2.83$ years. The loop is twice as big and it moves slower too.",
      },
    },
  ],
  limitations: [
    "Earth is a perfect ball that never moves, and the satellite is a tiny dot.",
    "No air drag, no Moon, no Sun tugging. Real satellites slowly drift because of these.",
    "You launch instantly at full speed. Real rockets climb through the air first.",
    "Distances are to scale. The satellite dot and arrows are drawn bigger so you can see them.",
    "The computer steps time forward 5 seconds at a time (velocity Verlet), so tiny errors creep in on extreme orbits.",
  ],
};
