export default function Innovation({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circles */}
      <circle cx="300" cy="300" r="250" fill="#0066ff" opacity="0.05" />
      <circle cx="300" cy="300" r="180" fill="#3385ff" opacity="0.08" />

      {/* Lightbulb */}
      <g transform="translate(300, 250)">
        {/* Glow effect */}
        <circle cx="0" cy="0" r="90" fill="#0066ff" opacity="0.1" />
        <circle cx="0" cy="0" r="70" fill="#3385ff" opacity="0.15" />

        {/* Bulb */}
        <circle cx="0" cy="0" r="50" fill="#0066ff" opacity="0.3" />
        <path
          d="M-30,-20 Q-35,20 -25,50 L25,50 Q35,20 30,-20 Q15,-45 0,-50 Q-15,-45 -30,-20 Z"
          fill="#0066ff"
        />

        {/* Filament */}
        <path
          d="M-15,0 Q0,-15 15,0 Q0,15 -15,0"
          stroke="#3385ff"
          strokeWidth="3"
          fill="none"
        />
        <line x1="0" y1="-25" x2="0" y2="15" stroke="#3385ff" strokeWidth="3" />

        {/* Base */}
        <rect x="-20" y="50" width="40" height="15" rx="3" fill="#0052cc" />
        <rect x="-20" y="65" width="40" height="8" rx="2" fill="#0052cc" opacity="0.8" />
        <rect x="-15" y="73" width="30" height="10" rx="2" fill="#0052cc" opacity="0.6" />

        {/* Light rays */}
        <g opacity="0.4">
          <line x1="-70" y1="-40" x2="-55" y2="-30" stroke="#0066ff" strokeWidth="3" strokeLinecap="round" />
          <line x1="-80" y1="0" x2="-60" y2="0" stroke="#0066ff" strokeWidth="3" strokeLinecap="round" />
          <line x1="-70" y1="40" x2="-55" y2="30" stroke="#0066ff" strokeWidth="3" strokeLinecap="round" />

          <line x1="70" y1="-40" x2="55" y2="-30" stroke="#0066ff" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="0" x2="60" y2="0" stroke="#0066ff" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="40" x2="55" y2="30" stroke="#0066ff" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* Gears - Left */}
      <g transform="translate(180, 400)">
        <circle cx="0" cy="0" r="40" fill="#0052cc" opacity="0.6" />
        <circle cx="0" cy="0" r="25" fill="white" opacity="0.1" />
        {/* Gear teeth */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 35;
          const y1 = Math.sin(angle) * 35;
          const x2 = Math.cos(angle) * 45;
          const y2 = Math.sin(angle) * 45;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0052cc"
              strokeWidth="8"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Gears - Right */}
      <g transform="translate(420, 400)">
        <circle cx="0" cy="0" r="35" fill="#3385ff" opacity="0.6" />
        <circle cx="0" cy="0" r="22" fill="white" opacity="0.1" />
        {/* Gear teeth */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 30;
          const y1 = Math.sin(angle) * 30;
          const x2 = Math.cos(angle) * 40;
          const y2 = Math.sin(angle) * 40;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#3385ff"
              strokeWidth="8"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Connecting mechanism */}
      <g opacity="0.5">
        <line x1="220" y1="400" x2="380" y2="400" stroke="#0066ff" strokeWidth="4" strokeDasharray="8 4" />
        <circle cx="300" cy="400" r="8" fill="#0066ff" />
      </g>

      {/* Innovation nodes/connections */}
      <g opacity="0.4">
        <circle cx="150" cy="200" r="6" fill="#0066ff" />
        <circle cx="450" cy="200" r="6" fill="#3385ff" />
        <circle cx="120" cy="320" r="6" fill="#0052cc" />
        <circle cx="480" cy="320" r="6" fill="#0066ff" />

        <line x1="150" y1="200" x2="230" y2="220" stroke="#0066ff" strokeWidth="2" />
        <line x1="450" y1="200" x2="370" y2="220" stroke="#3385ff" strokeWidth="2" />
      </g>

      {/* Spark effects */}
      <g opacity="0.5">
        <path d="M500 150 L495 165 L510 170 L495 175 L500 190" stroke="#0066ff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 150 L105 165 L90 170 L105 175 L100 190" stroke="#3385ff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Decorative corner elements */}
      <circle cx="520" cy="500" r="30" fill="#0066ff" opacity="0.15" />
      <circle cx="80" cy="100" r="35" fill="#3385ff" opacity="0.15" />
    </svg>
  );
}
