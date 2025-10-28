'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Button from '../shared/Button';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  image?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = 'Welcome to LMS Community',
  subtitle = 'Learn. Grow. Succeed.',
  description = 'Transform your learning journey with our comprehensive Learning Management System. Access courses, track progress, and achieve your goals.',
  primaryCTA = { label: 'Get Started', href: '/register' },
  secondaryCTA = { label: 'Watch Demo', href: '#demo' },
  image,
  className,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700',
        className
      )}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                {subtitle}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-xl"
            >
              {description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                rightIcon={<FiArrowRight />}
                className="bg-white text-primary-600 hover:bg-gray-100"
                onClick={primaryCTA.onClick}
              >
                {primaryCTA.label}
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<FiPlay />}
                className="border-white text-white hover:bg-white/10"
                onClick={secondaryCTA.onClick}
              >
                {secondaryCTA.label}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              {[
                { value: '10K+', label: 'Students' },
                { value: '500+', label: 'Courses' },
                { value: '95%', label: 'Success Rate' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative">
              {/* Floating cards animation */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 right-0 w-64 h-40 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-hard"
              >
                <div className="h-3 bg-white/30 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-white/30 rounded w-1/2"></div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-0 left-0 w-64 h-40 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-hard"
              >
                <div className="h-3 bg-white/30 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-white/30 rounded w-4/5"></div>
              </motion.div>

              {image ? (
                <img
                  src={image}
                  alt="Hero"
                  className="relative z-10 w-full h-auto rounded-2xl shadow-hard"
                />
              ) : (
                <div className="relative z-10 w-96 h-96 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                  <div className="text-6xl">📚</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
