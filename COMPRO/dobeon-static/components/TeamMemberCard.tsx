'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  image?: string;
  featured?: boolean;
  gradient?: 'blue';
  delay?: number;
}

export default function TeamMemberCard({
  name,
  role,
  bio,
  expertise,
  image,
  featured = false,
  gradient = 'blue',
  delay = 0,
}: TeamMemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`
        relative group rounded-lg overflow-hidden
        bg-white/95 backdrop-blur-md
        border-2 border-blue-400/50
        shadow-[0_0_20px_rgba(59,130,246,0.3)]
        hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]
        hover:border-blue-500
        transition-all duration-700
        hover:-translate-y-2
        ${featured ? 'bento-featured' : ''}
        animate-fade-in-up
      `}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* HUD Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>

      {/* Animated scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line"></div>
      </div>
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-6 md:p-8">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300 rounded-full blur-2xl animate-float-gentle"></div>
        </div>

        {/* Decorative dots pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id={`dots-${name}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#dots-${name})`} />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Profile photo/avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority={featured}
                />
              ) : (
                <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
          </div>

          {/* Name */}
          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
            {name}
          </h3>

          {/* Featured Badge */}
          {featured && (
            <div className="flex justify-center mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Featured Expert
              </span>
            </div>
          )}

          {/* Role */}
          <p className="text-center text-white/95 text-sm md:text-base font-medium px-4">
            {role}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white relative">
        {/* Bio Section - Collapsed by default */}
        <div className={`mb-3 transition-all duration-500 ${isExpanded ? 'mb-4' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">About</h4>
          </div>
          <div
            className={`
              text-gray-600 leading-relaxed text-xs overflow-hidden transition-all duration-500 relative
              ${isExpanded ? 'max-h-96' : 'max-h-12'}
            `}
          >
            {bio}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>

        {/* Divider */}
        {isExpanded && <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-3"></div>}

        {/* Expertise Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Expertise</h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {expertise.slice(0, isExpanded ? expertise.length : 2).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all duration-300 font-medium"
              >
                {skill}
              </span>
            ))}
            {!isExpanded && expertise.length > 2 && (
              <span className="px-2 py-1 text-gray-500 text-xs font-medium">
                +{expertise.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="flex justify-center pt-1">
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <span>{isExpanded ? 'Less' : 'More'}</span>
            <svg
              className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 blur-xl pointer-events-none"></div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
