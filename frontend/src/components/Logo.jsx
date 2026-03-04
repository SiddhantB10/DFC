const Logo = ({ size = 40, className = '' }) => {
  const id = 'dfc' + Math.random().toString(36).slice(2, 7);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      <defs>
        {/* Main gradient */}
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        {/* Subtle glass overlay */}
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id={`${id}-shadow`} x="-10%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#0d9488" floodOpacity="0.3" />
        </filter>

        {/* Clip */}
        <clipPath id={`${id}-clip`}>
          <rect x="8" y="8" width="184" height="184" rx="44" />
        </clipPath>
      </defs>

      {/* Background with shadow */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="8" y="8" width="184" height="184" rx="44" fill={`url(#${id}-bg)`} />
      </g>

      {/* Clipped content */}
      <g clipPath={`url(#${id}-clip)`}>
        {/* Gentle top glass highlight */}
        <rect x="8" y="8" width="184" height="184" fill={`url(#${id}-glass)`} />

        {/* Dumbbell icon */}
        <g transform="translate(100, 62)">
          {/* Left outer plate */}
          <rect x="-50" y="-18" width="12" height="36" rx="4" fill="white" fillOpacity="0.95" />
          {/* Left inner plate */}
          <rect x="-38" y="-13" width="8" height="26" rx="3" fill="white" fillOpacity="0.8" />
          {/* Bar */}
          <rect x="-30" y="-5" width="60" height="10" rx="5" fill="white" fillOpacity="0.9" />
          {/* Right inner plate */}
          <rect x="30" y="-13" width="8" height="26" rx="3" fill="white" fillOpacity="0.8" />
          {/* Right outer plate */}
          <rect x="38" y="-18" width="12" height="36" rx="4" fill="white" fillOpacity="0.95" />
        </g>

        {/* DFC text - bold and clear */}
        <text
          x="100"
          y="132"
          fontFamily="'Plus Jakarta Sans', 'Inter', Arial, sans-serif"
          fontWeight="800"
          fontSize="54"
          fill="white"
          textAnchor="middle"
          letterSpacing="2"
        >
          DFC
        </text>

        {/* Tagline - compact spacing so it fits */}
        <text
          x="100"
          y="156"
          fontFamily="'Inter', Arial, sans-serif"
          fontWeight="600"
          fontSize="12"
          fill="white"
          fillOpacity="0.75"
          textAnchor="middle"
          letterSpacing="2"
        >
          HEALTH &amp; HARMONY
        </text>

        {/* Thin accent line */}
        <rect x="60" y="164" width="80" height="1.5" rx="0.75" fill="white" fillOpacity="0.25" />

        {/* Subtle inner border */}
        <rect
          x="9"
          y="9"
          width="182"
          height="182"
          rx="43"
          fill="none"
          stroke="white"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

export default Logo;
