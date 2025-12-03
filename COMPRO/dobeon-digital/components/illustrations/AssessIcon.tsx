export default function AssessIcon({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Magnifying glass circle */}
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke="#0066ff"
        strokeWidth="3"
        fill="none"
      />

      {/* Magnifying glass handle */}
      <line
        x1="46"
        y1="46"
        x2="58"
        y2="58"
        stroke="#0066ff"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Checklist document */}
      <rect
        x="35"
        y="15"
        width="35"
        height="50"
        rx="3"
        stroke="#0066ff"
        strokeWidth="2"
        fill="white"
        opacity="0.9"
      />

      {/* Checklist items */}
      <g opacity="0.8">
        {/* Check 1 */}
        <circle cx="42" cy="25" r="3" fill="#0066ff" />
        <line x1="47" y1="25" x2="63" y2="25" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" />

        {/* Check 2 */}
        <circle cx="42" cy="35" r="3" fill="#0066ff" />
        <line x1="47" y1="35" x2="63" y2="35" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" />

        {/* Check 3 */}
        <circle cx="42" cy="45" r="3" fill="#0066ff" />
        <line x1="47" y1="45" x2="58" y2="45" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" />

        {/* Check 4 */}
        <circle cx="42" cy="55" r="3" fill="#0066ff" />
        <line x1="47" y1="55" x2="63" y2="55" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Checkmarks on checklist */}
      <g stroke="#3385ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polyline points="40,24 41.5,25.5 44,23" />
        <polyline points="40,34 41.5,35.5 44,33" />
      </g>
    </svg>
  );
}
