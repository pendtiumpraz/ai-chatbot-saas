interface AbstractShapesProps {
  className?: string;
  variant?: 'circles' | 'squares' | 'mixed';
}

export default function AbstractShapes({
  className = '',
  variant = 'mixed'
}: AbstractShapesProps) {
  const renderCircles = () => (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="150" cy="150" r="80" fill="#0066ff" opacity="0.08" />
      <circle cx="650" cy="200" r="120" fill="#3385ff" opacity="0.06" />
      <circle cx="700" cy="600" r="100" fill="#0052cc" opacity="0.08" />
      <circle cx="200" cy="650" r="90" fill="#0066ff" opacity="0.07" />
      <circle cx="400" cy="400" r="60" fill="#3385ff" opacity="0.05" />
    </svg>
  );

  const renderSquares = () => (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="100" y="100" width="120" height="120" rx="20" fill="#0066ff" opacity="0.08" transform="rotate(15 160 160)" />
      <rect x="600" y="150" width="100" height="100" rx="15" fill="#3385ff" opacity="0.06" transform="rotate(-20 650 200)" />
      <rect x="620" y="550" width="130" height="130" rx="20" fill="#0052cc" opacity="0.08" transform="rotate(25 685 615)" />
      <rect x="150" y="600" width="110" height="110" rx="18" fill="#0066ff" opacity="0.07" transform="rotate(-15 205 655)" />
    </svg>
  );

  const renderMixed = () => (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circles */}
      <circle cx="150" cy="150" r="70" fill="#0066ff" opacity="0.08" />
      <circle cx="700" cy="600" r="90" fill="#3385ff" opacity="0.06" />

      {/* Squares */}
      <rect x="600" y="120" width="100" height="100" rx="15" fill="#0052cc" opacity="0.08" transform="rotate(20 650 170)" />
      <rect x="120" y="580" width="110" height="110" rx="18" fill="#0066ff" opacity="0.07" transform="rotate(-20 175 635)" />

      {/* Triangles */}
      <polygon points="400,100 460,200 340,200" fill="#3385ff" opacity="0.06" />
      <polygon points="350,650 420,750 280,750" fill="#0052cc" opacity="0.08" />

      {/* Small accent shapes */}
      <circle cx="500" cy="300" r="30" fill="#0066ff" opacity="0.05" />
      <rect x="280" y="380" width="50" height="50" rx="10" fill="#3385ff" opacity="0.05" transform="rotate(45 305 405)" />
    </svg>
  );

  switch (variant) {
    case 'circles':
      return renderCircles();
    case 'squares':
      return renderSquares();
    case 'mixed':
    default:
      return renderMixed();
  }
}
