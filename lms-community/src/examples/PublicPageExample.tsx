'use client';

import React from 'react';
import { FloatingNavbar, Hero, Features, Footer } from '@/components/public';

/**
 * Example: Public Landing Page
 *
 * This example demonstrates how to use the public page components
 * to create a landing page for the LMS system.
 */

const PublicPageExample = () => {
  return (
    <div className="min-h-screen">
      {/* Floating Navigation Bar */}
      <FloatingNavbar
        links={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ]}
        showAuth={true}
      />

      {/* Hero Section */}
      <Hero
        title="Transform Your Learning Journey"
        subtitle="Welcome to LMS Community"
        description="Discover a world of knowledge with our comprehensive learning management system. Learn at your own pace, track your progress, and achieve your goals."
        primaryCTA={{
          label: 'Get Started Free',
          href: '/register',
          onClick: () => console.log('Primary CTA clicked'),
        }}
        secondaryCTA={{
          label: 'Watch Demo',
          href: '#demo',
          onClick: () => console.log('Secondary CTA clicked'),
        }}
      />

      {/* Features Section */}
      <Features
        title="Why Choose LMS Community?"
        subtitle="Everything you need to succeed in your learning journey"
        features={[
          {
            icon: <></>,
            title: 'Expert-Led Courses',
            description: 'Learn from industry professionals with years of experience.',
          },
          {
            icon: <></>,
            title: 'Flexible Learning',
            description: 'Study at your own pace, whenever and wherever you want.',
          },
          {
            icon: <></>,
            title: 'Certificates',
            description: 'Earn recognized certificates to boost your career.',
          },
          {
            icon: <></>,
            title: 'Community Support',
            description: 'Connect with fellow learners and get help when you need it.',
          },
          {
            icon: <></>,
            title: 'Progress Tracking',
            description: 'Monitor your learning journey with detailed analytics.',
          },
          {
            icon: <></>,
            title: 'Lifetime Access',
            description: 'Get unlimited access to all course materials forever.',
          },
        ]}
      />

      {/* Additional content sections can be added here */}

      {/* Footer */}
      <Footer
        sections={[
          {
            title: 'Product',
            links: [
              { label: 'Features', href: '/features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Courses', href: '/courses' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ],
          },
          {
            title: 'Resources',
            links: [
              { label: 'Documentation', href: '/docs' },
              { label: 'Help Center', href: '/help' },
              { label: 'Community', href: '/community' },
            ],
          },
          {
            title: 'Legal',
            links: [
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ],
          },
        ]}
        contactInfo={{
          email: 'info@lmscommunity.com',
          phone: '+1 (555) 123-4567',
          address: '123 Learning Street, Education City',
        }}
      />
    </div>
  );
};

export default PublicPageExample;
