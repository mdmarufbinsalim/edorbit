/**
 * EdOrbit mark: a planet with a tilted ring that passes behind it at the top
 * and in front of it at the bottom, and a small moon riding the ring.
 */
export function Logo({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g transform="translate(16 16) rotate(-24)">
        <path
          d="M -14 0 A 14 5.2 0 0 1 14 0"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>
      <circle cx="16" cy="16" r="7.2" fill="var(--paper)" stroke="currentColor" strokeWidth={2.2} />
      <path
        d="M 12.2 19.6 A 5 5 0 0 0 19.8 19.8"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.45}
      />
      <g transform="translate(16 16) rotate(-24)">
        <path
          d="M 14 0 A 14 5.2 0 0 1 -14 0"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx="14" cy="0" r="2.6" fill="currentColor" />
      </g>
    </svg>
  );
}
