export default function TeamCollaboration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="300" cy="300" r="250" fill="#0066ff" opacity="0.05" />
      <circle cx="300" cy="300" r="180" fill="#3385ff" opacity="0.08" />

      {/* Connection lines between people */}
      <g opacity="0.3">
        <line x1="220" y1="280" x2="380" y2="280" stroke="#0066ff" strokeWidth="2" />
        <line x1="220" y1="280" x2="300" y2="400" stroke="#3385ff" strokeWidth="2" />
        <line x1="380" y1="280" x2="300" y2="400" stroke="#0052cc" strokeWidth="2" />
        <line x1="300" y1="180" x2="220" y2="280" stroke="#0066ff" strokeWidth="2" strokeDasharray="5 5" />
        <line x1="300" y1="180" x2="380" y2="280" stroke="#3385ff" strokeWidth="2" strokeDasharray="5 5" />
      </g>

      {/* Person 1 - Top Center */}
      <g transform="translate(300, 180)">
        <circle cx="0" cy="0" r="45" fill="#0066ff" opacity="0.2" />
        <circle cx="0" cy="-10" r="20" fill="#0066ff" />
        <ellipse cx="0" cy="15" rx="25" ry="30" fill="#0066ff" />
      </g>

      {/* Person 2 - Left */}
      <g transform="translate(220, 280)">
        <circle cx="0" cy="0" r="45" fill="#3385ff" opacity="0.2" />
        <circle cx="0" cy="-10" r="20" fill="#3385ff" />
        <ellipse cx="0" cy="15" rx="25" ry="30" fill="#3385ff" />
      </g>

      {/* Person 3 - Right */}
      <g transform="translate(380, 280)">
        <circle cx="0" cy="0" r="45" fill="#0052cc" opacity="0.2" />
        <circle cx="0" cy="-10" r="20" fill="#0052cc" />
        <ellipse cx="0" cy="15" rx="25" ry="30" fill="#0052cc" />
      </g>

      {/* Person 4 - Bottom Center */}
      <g transform="translate(300, 400)">
        <circle cx="0" cy="0" r="45" fill="#0066ff" opacity="0.2" />
        <circle cx="0" cy="-10" r="20" fill="#0066ff" />
        <ellipse cx="0" cy="15" rx="25" ry="30" fill="#0066ff" />
      </g>

      {/* Central collaboration symbol */}
      <g transform="translate(300, 300)">
        <circle cx="0" cy="0" r="50" fill="white" opacity="0.1" />
        <circle cx="0" cy="0" r="35" fill="#0066ff" opacity="0.3" />

        {/* Handshake/connection icon */}
        <path
          d="M-15,-5 L-10,-10 L0,-5 L10,-10 L15,-5 L10,0 L0,-5 L-10,0 Z"
          fill="#0066ff"
          opacity="0.6"
        />

        {/* Small circles around center */}
        <circle cx="0" cy="-25" r="4" fill="#0066ff" />
        <circle cx="18" cy="-18" r="4" fill="#3385ff" />
        <circle cx="25" cy="0" r="4" fill="#0052cc" />
        <circle cx="18" cy="18" r="4" fill="#0066ff" />
        <circle cx="0" cy="25" r="4" fill="#3385ff" />
        <circle cx="-18" cy="18" r="4" fill="#0052cc" />
        <circle cx="-25" cy="0" r="4" fill="#0066ff" />
        <circle cx="-18" cy="-18" r="4" fill="#3385ff" />
      </g>

      {/* Idea bubbles/communication symbols */}
      <g opacity="0.5">
        <circle cx="160" cy="200" r="15" fill="#0066ff" opacity="0.3" />
        <circle cx="150" cy="190" r="10" fill="#0066ff" opacity="0.3" />
        <circle cx="145" cy="180" r="6" fill="#0066ff" opacity="0.3" />

        <circle cx="440" cy="200" r="15" fill="#3385ff" opacity="0.3" />
        <circle cx="450" cy="190" r="10" fill="#3385ff" opacity="0.3" />
        <circle cx="455" cy="180" r="6" fill="#3385ff" opacity="0.3" />
      </g>

      {/* Document/project icons */}
      <g opacity="0.4">
        <rect x="420" y="380" width="40" height="50" rx="4" fill="#0066ff" />
        <line x1="430" y1="395" x2="450" y2="395" stroke="white" strokeWidth="2" />
        <line x1="430" y1="405" x2="450" y2="405" stroke="white" strokeWidth="2" />
        <line x1="430" y1="415" x2="445" y2="415" stroke="white" strokeWidth="2" />

        <rect x="140" y="380" width="40" height="50" rx="4" fill="#3385ff" />
        <line x1="150" y1="395" x2="170" y2="395" stroke="white" strokeWidth="2" />
        <line x1="150" y1="405" x2="170" y2="405" stroke="white" strokeWidth="2" />
        <line x1="150" y1="415" x2="165" y2="415" stroke="white" strokeWidth="2" />
      </g>

      {/* Decorative corner elements */}
      <circle cx="500" cy="120" r="30" fill="#0066ff" opacity="0.15" />
      <circle cx="100" cy="480" r="35" fill="#3385ff" opacity="0.15" />
    </svg>
  );
}
