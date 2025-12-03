'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import FloatingIcons from './FloatingIcons';

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  gradient?: boolean;
  backgroundImage?: string;
}

export default function Hero({
  title,
  subtitle,
  description,
  ctaText = 'Get Started',
  ctaLink = '/contact',
  secondaryCtaText,
  secondaryCtaLink,
  gradient = true,
  backgroundImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80',
}: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={`relative overflow-hidden min-h-[90vh] flex items-center ${gradient ? '' : 'bg-gray-50'} pt-24 pb-20 md:pt-32 md:pb-32`}>
      {/* Background Image */}
      {gradient && (
        <>
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              priority
              className={`object-cover transition-all duration-1000 ${imageLoaded ? 'scale-100' : 'scale-110'}`}
              onLoad={() => setImageLoaded(true)}
              sizes="100vw"
            />
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-blue-600/85 to-cyan-600/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </>
      )}

      {/* Floating Icons */}
      {gradient && <FloatingIcons count={10} />}

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 opacity-0 ${
                mounted ? 'animate-slide-down' : ''
              } ${gradient ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-primary/10 border border-primary/20'}`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${gradient ? 'bg-cyan-300' : 'bg-primary'}`}></span>
              <span className={`text-sm font-semibold uppercase tracking-wider ${gradient ? 'text-white' : 'text-primary'}`}>
                {subtitle}
              </span>
            </div>
          )}

          <h1
            className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight opacity-0 ${
              mounted ? 'animate-fade-in-up stagger-1' : ''
            } ${gradient ? 'text-white drop-shadow-lg' : 'text-gray-900'}`}
          >
            {title}
          </h1>

          <p
            className={`text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed max-w-3xl mx-auto opacity-0 ${
              mounted ? 'animate-fade-in-up stagger-2' : ''
            } ${gradient ? 'text-white/95' : 'text-gray-600'}`}
          >
            {description}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 ${
            mounted ? 'animate-fade-in-up stagger-3' : ''
          }`}>
            <Link
              href={ctaLink}
              className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden ${
                gradient
                  ? 'bg-white text-primary hover:bg-gray-50'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {ctaText}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
            </Link>

            {secondaryCtaText && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 transform hover:scale-105 backdrop-blur-sm ${
                  gradient
                    ? 'border-white/50 text-white hover:bg-white/20 hover:border-white'
                    : 'border-primary text-primary hover:bg-primary/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  {secondaryCtaText}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </Link>
            )}
          </div>

          {/* Trust Badges */}
          {gradient && (
            <div className={`mt-16 opacity-0 ${mounted ? 'animate-fade-in-up stagger-4' : ''}`}>
              <p className="text-white/70 text-sm mb-4">Trusted by industry leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                {['Harvard', 'Google', 'Deloitte', 'IBM'].map((company, i) => (
                  <span key={i} className="text-white font-bold text-lg tracking-wider">{company}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 ${
        mounted ? 'animate-fade-in stagger-4' : ''
      }`}>
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className={`w-6 h-10 rounded-full border-2 flex items-start justify-center p-1 ${
            gradient ? 'border-white/50' : 'border-gray-400'
          }`}>
            <div className={`w-1.5 h-3 rounded-full animate-scroll-down ${
              gradient ? 'bg-white' : 'bg-gray-600'
            }`}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
