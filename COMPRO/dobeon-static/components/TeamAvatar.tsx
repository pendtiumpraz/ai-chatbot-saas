import React from 'react';

interface TeamAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export default function TeamAvatar({ name, size = 200, className = '' }: TeamAvatarProps) {
  // Extract initials
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate unique color and pattern based on name
  const avatars: { [key: string]: React.ReactElement } = {
    'Soleh Ayubi': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="#0066ff" />
        <circle cx="100" cy="80" r="35" fill="#3385ff" />
        <path d="M50 150 Q100 120 150 150 L150 200 L50 200 Z" fill="#3385ff" />
        <circle cx="100" cy="100" r="60" fill="white" opacity="0.1" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          SA
        </text>
      </svg>
    ),
    'Sai Prasad': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="#3385ff" />
        <polygon points="100,40 160,100 100,160 40,100" fill="#0066ff" />
        <circle cx="100" cy="100" r="50" fill="white" opacity="0.15" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          SP
        </text>
      </svg>
    ),
    'John Brownstein': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="#0052cc" />
        <rect x="50" y="50" width="100" height="100" rx="20" fill="#0066ff" />
        <circle cx="100" cy="100" r="55" fill="white" opacity="0.1" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          JB
        </text>
      </svg>
    ),
    'Gajen Sunthara': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="#3385ff" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#grad1)" />
        <circle cx="100" cy="100" r="60" fill="white" opacity="0.15" />
        <path d="M100 50 L130 90 L170 90 L140 115 L155 155 L100 130 L45 155 L60 115 L30 90 L70 90 Z" fill="#0052cc" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          GS
        </text>
      </svg>
    ),
    'Kerrie Holley': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="#1a75ff" />
        <circle cx="100" cy="100" r="70" fill="#0066ff" />
        <circle cx="100" cy="100" r="50" fill="#3385ff" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          KH
        </text>
      </svg>
    ),
    'Paul Nielsen': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="#0066ff" />
        <rect x="30" y="30" width="140" height="140" rx="30" fill="#3385ff" />
        <circle cx="100" cy="100" r="55" fill="white" opacity="0.15" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          PN
        </text>
      </svg>
    ),
    'Seth Berkeley': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052cc" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#grad2)" />
        <polygon points="100,30 170,85 140,160 60,160 30,85" fill="#3385ff" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          SB
        </text>
      </svg>
    ),
    'Ivan Sini': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="#3385ff" />
        <circle cx="60" cy="60" r="40" fill="#0066ff" opacity="0.7" />
        <circle cx="140" cy="140" r="40" fill="#0052cc" opacity="0.7" />
        <circle cx="100" cy="100" r="60" fill="white" opacity="0.1" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          IS
        </text>
      </svg>
    ),
    'Salman Subakat': (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="#0052cc" />
        <rect x="40" y="40" width="120" height="120" rx="60" fill="#0066ff" />
        <circle cx="100" cy="100" r="55" fill="white" opacity="0.15" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
          SS
        </text>
      </svg>
    ),
  };

  // Return specific avatar or default
  return (
    <div className={className}>
      {avatars[name] || (
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
          <rect width="200" height="200" fill="#0066ff" />
          <circle cx="100" cy="100" r="60" fill="white" opacity="0.1" />
          <text x="100" y="110" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="sans-serif">
            {initials}
          </text>
        </svg>
      )}
    </div>
  );
}
