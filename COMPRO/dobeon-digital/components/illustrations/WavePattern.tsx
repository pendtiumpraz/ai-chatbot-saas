interface WavePatternProps {
  className?: string;
  opacity?: number;
  color?: string;
}

export default function WavePattern({
  className = '',
  opacity = 0.1,
  color = '#0066ff'
}: WavePatternProps) {
  return (
    <svg
      className={className}
      width="100%"
      height="120"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z"
        fill={color}
        opacity={opacity}
      />
      <path
        d="M0,70 C200,100 400,40 600,70 C800,100 1000,40 1200,70 L1200,120 L0,120 Z"
        fill={color}
        opacity={opacity * 0.7}
      />
    </svg>
  );
}
