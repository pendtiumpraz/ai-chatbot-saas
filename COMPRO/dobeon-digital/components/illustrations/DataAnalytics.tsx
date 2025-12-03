export default function DataAnalytics({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#0066ff" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="600" height="600" fill="url(#grid)" />

      {/* Background circles */}
      <circle cx="300" cy="300" r="240" fill="#0066ff" opacity="0.05" />

      {/* Main chart area */}
      <rect x="150" y="150" width="300" height="300" rx="20" fill="white" opacity="0.05" />

      {/* Bar chart */}
      <g>
        <rect x="190" y="280" width="40" height="140" rx="8" fill="#0066ff" opacity="0.8" />
        <rect x="250" y="220" width="40" height="200" rx="8" fill="#3385ff" opacity="0.8" />
        <rect x="310" y="250" width="40" height="170" rx="8" fill="#0052cc" opacity="0.8" />
        <rect x="370" y="200" width="40" height="220" rx="8" fill="#0066ff" opacity="0.8" />
      </g>

      {/* Line graph overlay */}
      <path
        d="M180 350 L240 280 L300 310 L360 240 L420 260"
        stroke="#0066ff"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Data points on line */}
      <circle cx="180" cy="350" r="8" fill="#0066ff" />
      <circle cx="240" cy="280" r="8" fill="#3385ff" />
      <circle cx="300" cy="310" r="8" fill="#0052cc" />
      <circle cx="360" cy="240" r="8" fill="#0066ff" />
      <circle cx="420" cy="260" r="8" fill="#3385ff" />

      {/* Data point halos */}
      <circle cx="360" cy="240" r="15" fill="#0066ff" opacity="0.2" />
      <circle cx="420" cy="260" r="15" fill="#3385ff" opacity="0.2" />

      {/* Pie chart in corner */}
      <g transform="translate(450, 180)">
        <circle cx="0" cy="0" r="50" fill="#0066ff" opacity="0.3" />
        <path
          d="M 0,0 L 0,-50 A 50,50 0 0,1 43.3,-25 Z"
          fill="#0066ff"
          opacity="0.6"
        />
        <path
          d="M 0,0 L 43.3,-25 A 50,50 0 0,1 43.3,25 Z"
          fill="#3385ff"
          opacity="0.6"
        />
        <path
          d="M 0,0 L 43.3,25 A 50,50 0 0,1 0,50 Z"
          fill="#0052cc"
          opacity="0.6"
        />
      </g>

      {/* Growth arrow */}
      <g opacity="0.5">
        <path
          d="M120 450 L200 370"
          stroke="#0066ff"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M200 370 L180 375 L200 370 L195 390"
          fill="#0066ff"
          stroke="#0066ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Floating data indicators */}
      <g opacity="0.4">
        <rect x="480" y="350" width="60" height="8" rx="4" fill="#0066ff" />
        <rect x="480" y="370" width="80" height="8" rx="4" fill="#3385ff" />
        <rect x="480" y="390" width="50" height="8" rx="4" fill="#0052cc" />
      </g>

      {/* Decorative elements */}
      <circle cx="500" cy="450" r="35" fill="#0066ff" opacity="0.15" />
      <circle cx="120" cy="200" r="25" fill="#3385ff" opacity="0.15" />
    </svg>
  );
}
