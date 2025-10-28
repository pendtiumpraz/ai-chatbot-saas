'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  FiBook,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiVideo,
  FiMessageCircle,
} from 'react-icons/fi';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  className?: string;
}

const defaultFeatures: Feature[] = [
  {
    icon: <FiBook size={32} />,
    title: 'Comprehensive Courses',
    description: 'Access a wide range of courses designed by industry experts to help you master new skills.',
  },
  {
    icon: <FiUsers size={32} />,
    title: 'Collaborative Learning',
    description: 'Connect with fellow learners, share knowledge, and grow together in a supportive community.',
  },
  {
    icon: <FiAward size={32} />,
    title: 'Certifications',
    description: 'Earn recognized certificates upon course completion to showcase your achievements.',
  },
  {
    icon: <FiTrendingUp size={32} />,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and progress reports.',
  },
  {
    icon: <FiVideo size={32} />,
    title: 'Video Lessons',
    description: 'Learn through engaging video content, interactive quizzes, and hands-on projects.',
  },
  {
    icon: <FiMessageCircle size={32} />,
    title: '24/7 Support',
    description: 'Get help whenever you need it with our responsive support team and community forums.',
  },
];

const Features: React.FC<FeaturesProps> = ({
  title = 'Why Choose Us',
  subtitle = 'Everything you need to succeed in your learning journey',
  features = defaultFeatures,
  className,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className={cn('py-20 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
