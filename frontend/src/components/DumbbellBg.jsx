/**
 * Subtle 3D dumbbell background decoration.
 * Uses the same dumbbell shape from the DFC logo, rendered as
 * large semi-transparent SVGs scattered across the viewport.
 */
const Dumbbell = ({ style, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 260 90"
    fill="none"
    className={className}
    style={style}
  >
    {/* Left outer plate */}
    <rect x="0" y="1" width="30" height="88" rx="10" fill="currentColor" />
    {/* Left inner plate */}
    <rect x="30" y="12" width="20" height="64" rx="7" fill="currentColor" />
    {/* Bar */}
    <rect x="50" y="33" width="160" height="24" rx="12" fill="currentColor" />
    {/* Right inner plate */}
    <rect x="210" y="12" width="20" height="64" rx="7" fill="currentColor" />
    {/* Right outer plate */}
    <rect x="230" y="1" width="30" height="88" rx="10" fill="currentColor" />
  </svg>
);

const DumbbellBg = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Large dumbbell — top right, rotated */}
      <Dumbbell
        className="absolute hidden lg:block text-primary-500/[0.12] w-[420px]"
        style={{
          top: '8%',
          right: '-3%',
          transform: 'rotate(-25deg)',
        }}
      />

      {/* Medium dumbbell — center left */}
      <Dumbbell
        className="absolute hidden md:block text-secondary-500/[0.10] w-[320px]"
        style={{
          top: '42%',
          left: '-4%',
          transform: 'rotate(15deg)',
        }}
      />

      {/* Small dumbbell — bottom right */}
      <Dumbbell
        className="absolute hidden sm:block text-primary-400/[0.09] w-[260px]"
        style={{
          bottom: '12%',
          right: '6%',
          transform: 'rotate(-40deg)',
        }}
      />

      {/* Extra small — top left */}
      <Dumbbell
        className="absolute hidden md:block text-secondary-400/[0.08] w-[200px]"
        style={{
          top: '18%',
          left: '8%',
          transform: 'rotate(30deg)',
        }}
      />

      {/* Medium — bottom center-left */}
      <Dumbbell
        className="absolute hidden lg:block text-primary-600/[0.08] w-[300px]"
        style={{
          bottom: '30%',
          left: '25%',
          transform: 'rotate(-10deg)',
        }}
      />
    </div>
  );
};

export default DumbbellBg;
