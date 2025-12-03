'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  autoPlayInterval?: number;
  className?: string;
}

export default function ImageCarousel({
  autoPlayInterval = 5000,
  className = ''
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80',
      title: 'Healthcare Innovation',
      description: 'Transform your healthcare organization with cutting-edge digital solutions and expert guidance',
      tag: 'Healthcare'
    },
    {
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
      title: 'Enterprise Technology',
      description: 'Leverage world-class expertise in AI, data analytics, and cloud architecture',
      tag: 'Technology'
    },
    {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80',
      title: 'Data-Driven Insights',
      description: 'Make informed decisions with advanced analytics and AI-powered intelligence',
      tag: 'Analytics'
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
      title: 'Strategic Consulting',
      description: 'Expert advisors guiding your digital transformation journey every step of the way',
      tag: 'Consulting'
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, slides.length, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Slides */}
        <div className="relative h-[450px] md:h-[550px] lg:h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === currentIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority={index === 0}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end">
                <div className="p-8 md:p-12 lg:p-16 w-full max-w-3xl">
                  <span className="inline-block px-4 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4 shadow-lg">
                    {slide.tag}
                  </span>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {slide.title}
                  </h3>
                  <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-12 h-3 bg-gradient-to-r from-primary to-cyan-500 shadow-lg'
                : 'w-3 h-3 bg-gray-300 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail Preview */}
      <div className="hidden lg:flex justify-center gap-4 mt-6">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentIndex
                ? 'ring-2 ring-primary ring-offset-2 scale-110'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
