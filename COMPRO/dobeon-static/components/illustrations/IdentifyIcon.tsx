export default function IdentifyIcon({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Target circles */}
      <circle
        cx="40"
        cy="40"
        r="30"
        stroke="#0066ff"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="40"
        cy="40"
        r="22"
        stroke="#0066ff"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="40"
        cy="40"
        r="14"
        stroke="#3385ff"
        strokeWidth="2"
        fill="none"
      />

      {/* Center bullseye */}
      <circle
        cx="40"
        cy="40"
        r="6"
        fill="#0066ff"
      />

      {/* Crosshair lines */}
      <line
        x1="40"
        y1="8"
        x2="40"
        y2="18"
        stroke="#0066ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="62"
        x2="40"
        y2="72"
        stroke="#0066ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="40"
        x2="18"
        y2="40"
        stroke="#0066ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="62"
        y1="40"
        x2="72"
        y2="40"
        stroke="#0066ff"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Analysis chart lines */}
      <g opacity="0.7">
        <polyline
          points="15,60 25,50 35,55 45,45 55,50 65,40"
          stroke="#3385ff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        <circle cx="25" cy="50" r="2" fill="#3385ff" />
        <circle cx="35" cy="55" r="2" fill="#3385ff" />
        <circle cx="45" cy="45" r="2" fill="#3385ff" />
        <circle cx="55" cy="50" r="2" fill="#3385ff" />
      </g>

      {/* Corner scan markers */}
      <g stroke="#0052cc" strokeWidth="2" strokeLinecap="round">
        <path d="M10,15 L10,10 L15,10" />
        <path d="M65,10 L70,10 L70,15" />
        <path d="M70,65 L70,70 L65,70" />
        <path d="M15,70 L10,70 L10,65" />
      </g>
    </svg>
  );
}
