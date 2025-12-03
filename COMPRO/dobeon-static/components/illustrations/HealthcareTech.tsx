export default function HealthcareTech({ className = '' }: { className?: string }) {
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

      {/* Medical cross with tech elements */}
      <g>
        {/* Main cross */}
        <rect x="270" y="200" width="60" height="200" rx="10" fill="#0066ff" />
        <rect x="200" y="270" width="200" height="60" rx="10" fill="#0052cc" />

        {/* Center circle */}
        <circle cx="300" cy="300" r="40" fill="#3385ff" />
        <circle cx="300" cy="300" r="25" fill="white" opacity="0.3" />
      </g>

      {/* Tech circuit lines */}
      <g opacity="0.4">
        {/* Top right circuit */}
        <path
          d="M400 200 L450 200 L450 250"
          stroke="#0066ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="450" cy="250" r="6" fill="#0066ff" />
        <circle cx="400" cy="200" r="6" fill="#0066ff" />

        {/* Bottom left circuit */}
        <path
          d="M200 400 L150 400 L150 350"
          stroke="#3385ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="150" cy="350" r="6" fill="#3385ff" />
        <circle cx="200" cy="400" r="6" fill="#3385ff" />

        {/* Top left circuit */}
        <path
          d="M200 200 L150 200 L150 250 L180 250"
          stroke="#0052cc"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="150" cy="200" r="6" fill="#0052cc" />
        <circle cx="180" cy="250" r="6" fill="#0052cc" />

        {/* Bottom right circuit */}
        <path
          d="M400 400 L450 400 L450 350 L420 350"
          stroke="#0066ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="450" cy="400" r="6" fill="#0066ff" />
        <circle cx="420" cy="350" r="6" fill="#0066ff" />
      </g>

      {/* Data nodes */}
      <g>
        <circle cx="450" cy="300" r="8" fill="#0066ff" opacity="0.6" />
        <circle cx="150" cy="300" r="8" fill="#3385ff" opacity="0.6" />
        <circle cx="300" cy="150" r="8" fill="#0052cc" opacity="0.6" />
        <circle cx="300" cy="450" r="8" fill="#0066ff" opacity="0.6" />
      </g>

      {/* Pulse rings */}
      <g opacity="0.3">
        <circle cx="300" cy="300" r="120" stroke="#0066ff" strokeWidth="2" fill="none" />
        <circle cx="300" cy="300" r="140" stroke="#3385ff" strokeWidth="2" fill="none" strokeDasharray="10 5" />
      </g>

      {/* Corner accents */}
      <g opacity="0.2">
        <circle cx="480" cy="120" r="30" fill="#0066ff" />
        <circle cx="120" cy="480" r="40" fill="#3385ff" />
        <circle cx="520" cy="480" r="25" fill="#0052cc" />
      </g>
    </svg>
  );
}
