import type { LessonDefinition } from "@orbital/core";

export const lesson: LessonDefinition = {
  introduction:
    "Throw a ball sideways and it curves to the ground. Throw it faster and it lands farther away. Newton realised that at a high enough speed, the ground curves away beneath the ball as fast as the ball falls towards it. The ball never lands. It is in orbit.",
  whyItMatters:
    "Every satellite, space station, moon and planet follows the same few equations. Understanding them explains GPS, weather satellites, the Moon's month and Earth's year.",
  realWorldExamples: [
    "The ISS circles Earth every ~93 minutes at about 7.66 km/s.",
    "Geostationary satellites at 42 164 km from Earth's centre take one sidereal day per orbit, so they hover over one spot.",
    "Molniya communication satellites use highly eccentric orbits that linger over high latitudes near apoapsis.",
    "Earth's own orbit around the Sun is a slightly eccentric ellipse (e ≈ 0.017).",
  ],
  learningObjectives: [
    "Explain an orbit as continuous free fall around a central body.",
    "Use Newton's law of gravitation to compute gravitational force and acceleration.",
    "Relate speed, distance and orbit size with the vis-viva equation.",
    "Predict orbital periods with Kepler's third law.",
    "Identify periapsis, apoapsis, semi-major axis and eccentricity.",
    "Explain Kepler's second law as conservation of angular momentum.",
  ],
  sections: [
    {
      id: "free-fall",
      heading: "An orbit is free fall that keeps missing",
      body: [
        "Gravity pulls the orbiter towards Earth's centre at every instant. If the orbiter had no sideways velocity, it would fall straight down. With sideways velocity, its path curves.",
        "At one particular speed, $v_c = \\sqrt{\\mu/r}$, the curvature of the path matches the curvature of a circle around Earth. The orbiter falls continuously yet stays at the same height.",
      ],
      equationIds: ["gravitation", "acceleration", "circular-speed"],
    },
    {
      id: "ellipses",
      heading: "Kepler's first law: orbits are ellipses",
      body: [
        "Launch faster or slower than $v_c$ and the path becomes an ellipse with Earth's centre at one focus. The closest point is periapsis and the farthest is apoapsis.",
        "The ellipse is described by its semi-major axis $a$ (its size) and eccentricity $e$ (its shape). Above escape speed the path opens into a parabola ($e = 1$) or hyperbola ($e > 1$) and never returns.",
      ],
      equationIds: ["apsides"],
    },
    {
      id: "energy",
      heading: "Energy decides the size of the orbit",
      body: [
        "Specific orbital energy $\\varepsilon = v^2/2 - \\mu/r$ stays constant along the orbit. Kinetic energy is traded for potential energy as the orbiter climbs, and back again as it falls.",
        "That constant energy fixes the semi-major axis: $\\varepsilon = -\\mu/2a$. Combining the two expressions gives the vis-viva equation, which gives the speed anywhere on the orbit.",
      ],
      equationIds: ["energy", "vis-viva"],
    },
    {
      id: "areas",
      heading: "Kepler's second law: equal areas in equal times",
      body: [
        "Gravity always points along the radius, so it produces no torque, and angular momentum $\\vec h = \\vec r \\times \\vec v$ is conserved.",
        "The area swept per unit time is $h/2$, so the orbiter must move fastest when it is closest. Planets move fastest at perihelion.",
      ],
      equationIds: ["angular-momentum"],
    },
    {
      id: "periods",
      heading: "Kepler's third law: bigger orbits take longer",
      body: [
        "The period depends only on the semi-major axis: $T = 2\\pi\\sqrt{a^3/\\mu}$. An eccentric orbit and a circle with the same $a$ have the same period.",
        "Larger orbits are both longer and slower, so their periods grow faster than their size: $T \\propto a^{3/2}$.",
      ],
      equationIds: ["kepler-third"],
    },
  ],
  limitations: [
    "Restricted two-body model: Earth is a fixed point mass and the orbiter has negligible mass.",
    "Ignores Earth's oblateness ($J_2$), atmospheric drag, the Moon and Sun, solar radiation pressure and relativity.",
    "Launch is instantaneous at the chosen distance. There is no rocket ascent through the atmosphere.",
    "Numerical integration uses velocity Verlet with a 5 s step. Very low-periapsis, high-eccentricity orbits show small energy drift.",
    "The orbiter marker and vector lengths are not to scale. Earth and orbit distances are to scale.",
  ],
};
