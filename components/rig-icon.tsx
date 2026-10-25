/**
 * One line drawing per activity, each drawn from the rig itself: rings under a beam, a rope bridge,
 * a climbing tower with lit holds, a cable with a handle, a strength tester, a target...
 * Drawn on a 48x48 grid in a single stroke colour (currentColor) so they sit on ink squares like the step numbers do.
 *
 * Parts marked sway / slide / glow move when a parent with the `group` class is hovered (see globals.css).
 */

const ICONS: Record<string, React.ReactNode> = {
  // Rings hanging from a beam, mat below
  ninja: (
    <>
      <path d="M6 8h36" />
      <g className="sway">
        <path d="M16 8v10.5" />
        <circle cx="16" cy="23" r="4.5" />
      </g>
      <g className="sway sway-b">
        <path d="M32 8v10.5" />
        <circle cx="32" cy="23" r="4.5" />
      </g>
      <rect x="6" y="37" width="36" height="5" rx="1.5" />
    </>
  ),
  // Rope bridge between two posts: hand rope, walkway and the uprights between them
  "rope-park": (
    <>
      <path d="M8 8v34M40 8v34" />
      <path d="M8 14Q24 24 40 14" />
      <path d="M8 30Q24 40 40 30" />
      <path d="M16 17.75v16M24 19v16M32 17.75v16" />
    </>
  ),
  // Tower with holds, a few of them lit
  climbing: (
    <>
      <path d="M14 42V12h20v30" />
      <path d="M11 9h26" />
      <path d="M10 42h28" />
      <circle cx="21" cy="19" r="2.2" className="glow" />
      <circle cx="28" cy="25" r="2.2" />
      <circle cx="21" cy="31" r="2.2" className="glow" />
      <circle cx="28" cy="37" r="2.2" />
    </>
  ),
  // Cable running downhill between two posts, with a handle sliding along it
  zipline: (
    <>
      <path d="M6 10v30M42 26v14" />
      <path d="M6 12 42 28" />
      <g className="slide">
        <circle cx="16" cy="16.4" r="2.2" />
        <path d="M16 19v5M12 32l4-8 4 8z" />
      </g>
    </>
  ),
  // Strength tester: a tall tube with a scale, and the puck at the bottom
  mma: (
    <>
      <rect x="18" y="5" width="9" height="32" rx="4.5" />
      <path d="M31 11h5M31 17h5M31 23h5M31 29h5" />
      <circle cx="22.5" cy="31" r="2.5" className="glow" />
      <rect x="11" y="39" width="23" height="4" rx="2" />
    </>
  ),
  // Target
  shooting: (
    <>
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="9" />
      <circle cx="24" cy="24" r="3" className="glow" />
      <path d="M24 4v5M24 39v5M4 24h5M39 24h5" />
    </>
  ),
  // Jump tower with a dashed jump into the cushion
  "extreme-attractions": (
    <>
      <path d="M10 6v36M18 6v36" />
      <path d="M10 40l8-8-8-8 8-8-8-8" />
      <path d="M20 10Q36 2 38 28" strokeDasharray="2 3.5" />
      <path d="m34 25 4 4 3.5-4.5" />
      <rect x="27" y="36" width="17" height="6" rx="3" />
    </>
  ),
  // Tug of war: rope with a marker flag in the middle, start lines on the ground
  "team-building": (
    <>
      <path d="M5 26h38" />
      <path d="M24 26V12" />
      <path d="M24 12l9 3.5-9 3.5" className="glow" />
      <path d="M6 40h36M16 34v8M32 34v8" />
    </>
  ),
}

export function RigIcon({ id, className = "" }: { id: string; className?: string }) {
  const parts = ICONS[id]
  if (!parts) return null
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`rig-icon ${className}`}
    >
      {parts}
    </svg>
  )
}
