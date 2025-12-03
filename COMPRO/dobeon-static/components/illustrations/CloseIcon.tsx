export default function CloseIcon({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle background */}
      <circle
        cx="35"
        cy="40"
        r="25"
        stroke="#0066ff"
        strokeWidth="3"
        fill="none"
      />

      {/* Large checkmark */}
      <polyline
        points="20,40 32,52 50,28"
        stroke="#0066ff"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Growth arrow */}
      <g>
        <polyline
          points="45,65 55,50 65,55"
          stroke="#3385ff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrow shaft */}
        <line
          x1="55"
          y1="50"
          x2="55"
          y2="70"
          stroke="#3385ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Arrow head */}
        <polyline
          points="48,63 55,70 62,63"
          stroke="#3385ff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Growth chart bars */}
      <g opacity="0.6">
        <rect x="48" y="30" width="5" height="10" rx="1" fill="#0052cc" />
        <rect x="55" y="25" width="5" height="15" rx="1" fill="#0066ff" />
        <rect x="62" y="20" width="5" height="20" rx="1" fill="#3385ff" />
      </g>

      {/* Success indicators */}
      <circle cx="68" cy="15" r="4" fill="#3385ff" opacity="0.6" />
      <circle cx="12" cy="60" r="3" fill="#0066ff" opacity="0.6" />

      {/* Completion ring */}
      <circle
        cx="35"
        cy="40"
        r="30"
        stroke="#0066ff"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
        strokeDasharray="5 3"
      />
    </svg>
  );
}
