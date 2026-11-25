# Scientific standards

Every concept must:

- Document its mathematical model and the equations it implements.
- State assumptions and the conditions under which the model is valid.
- Use SI units internally and label units everywhere they are shown.
- Distinguish exaggerated or idealised visuals from physical measurements, on screen.
- Cite reliable references (textbooks, peer-reviewed papers, agency data such as NASA/JPL, IAU, CODATA).
- Include at least one numerical validation test against a known result.

## Numerical integration

Choose an integrator suited to the model and document its stability and timestep limits. Symplectic integrators (Velocity Verlet, leapfrog) are preferred for long-running conservative orbital systems.

_Expanded during Phase 1._
