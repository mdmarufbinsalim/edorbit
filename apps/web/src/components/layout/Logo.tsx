import { useId } from "react";

/** Ring in the planet's tilted frame: centre, rotation and semi-axes shared by every stroke. */
const RING = "translate(966 958) rotate(-41.7)";
const BACK = "M -780 0 A 780 230 0 0 0 780 0";
/** The front of the ring, split so a gap opens just before the moon. */
const FRONT = ["M 780 0 A 780 230 0 0 0 342 -207", "M 176 -224 A 780 230 0 0 0 -780 0"];

/**
 * EdOrbit mark: a planet with a tilted ring that passes behind it, then in
 * front of it, with a moon riding the ring. Paper-coloured gaps separate the
 * front of the ring from the planet's outline.
 */
export function Logo({ size = 30, className = "" }: { size?: number; className?: string }) {
  const clip = useId();
  return (
    <svg
      viewBox="330 330 1270 1270"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={38}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="965" cy="950" r="600" />
        </clipPath>
      </defs>
      <path transform={RING} d={BACK} />
      <circle cx="965" cy="950" r="535" fill="var(--paper)" />
      <g clipPath={`url(#${clip})`}>
        <g transform={RING} stroke="var(--paper)" strokeWidth={100} strokeLinecap="butt">
          {FRONT.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      <g transform={RING}>
        {FRONT.map((d) => (
          <path key={d} d={d} />
        ))}
        <circle cx="176" cy="-224" r="68" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
