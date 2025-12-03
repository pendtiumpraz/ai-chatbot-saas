'use client';

import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StructuredData from '@/components/StructuredData';
import FloatingShapes from '@/components/FloatingShapes';
import FloatingIcons from '@/components/FloatingIcons';
import GlassCard from '@/components/GlassCard';
import StatCounter from '@/components/StatCounter';
import PlaceholderImage from '@/components/PlaceholderImage';
import ImageCarousel from '@/components/ImageCarousel';
import { organizationSchema} from '@/lib/structured-data';
import { useInView, getAnimationClasses } from '@/lib/animations';

export default function Home() {
  const { ref: ctaRef, isInView: ctaInView } = useInView();
  const services = [
    {
      title: 'Web & Mobile Apps',
      description: 'Full-stack web applications and native/cross-platform mobile apps built with modern frameworks like React, Next.js, Flutter, and React Native.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      ),
    },
    {
      title: 'Enterprise Systems',
      description: 'Custom ERP, CRM, HRM, and business management systems tailored to your organization needs. Scalable solutions for any industry.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      ),
    },
    {
      title: 'AI-Powered Solutions',
      description: 'Intelligent applications powered by Machine Learning, Computer Vision, NLP, and Generative AI. Transform your business with cutting-edge AI technology.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
    },
  ];

  const features = [
    {
      title: 'Education & E-Learning',
      description: 'LMS platforms, virtual classrooms, online courses, and educational apps with interactive learning experiences.',
    },
    {
      title: 'Healthcare & Medical',
      description: 'Hospital management, telemedicine, clinic apps, medical records, and healthcare automation systems.',
    },
    {
      title: 'Finance & Fintech',
      description: 'Payment gateways, banking apps, trading platforms, accounting systems, and financial management solutions.',
    },
    {
      title: 'Retail & E-Commerce',
      description: 'Online stores, marketplace platforms, POS systems, inventory management, and omnichannel retail solutions.',
    },
  ];

  return (
    <>
      <StructuredData data={organizationSchema} />
      {/* Hero Section */}
      <Hero
        subtitle="Digital Solutions Partner"
        title="Build Powerful Apps & Systems for Any Industry"
        description="We develop custom web applications, mobile apps, enterprise systems, and AI-powered solutions. From startups to enterprises, we transform your ideas into reality."
        ctaText="Start Your Project"
        ctaLink="/contact"
        secondaryCtaText="Our Services"
        secondaryCtaLink="/services"
        backgroundImage="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80"
      />

      {/* Services Overview */}
      <Section
        id="services"
        subtitle="What We Build"
        title="Complete Digital Solutions"
        description="From concept to deployment, we build scalable and modern applications tailored to your business needs across any industry."
        className="relative"
      >
        {/* Floating decorative shapes - reduced and simplified */}
        <FloatingShapes count={3} colors={['#0066ff', '#7C3AED', '#00D9FF']} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {services.map((service, index) => (
            <Card
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              gradient={index === 0 ? 'blue' : false}
              delay={index * 100}
            />
          ))}
        </div>
        <div className="text-center mt-12 relative z-10">
          <Button href="/services" size="lg">
            Explore Our Services
          </Button>
        </div>
      </Section>

      {/* Image Carousel Section */}
      <Section className="bg-gray-50">
        <ImageCarousel />
      </Section>

      {/* Value Proposition */}
      <Section
        subtitle="Industries We Serve"
        title="Solutions for Every Sector"
        description="We have experience building applications across diverse industries, delivering customized solutions that address unique business challenges."
        className="bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              title={feature.title}
              description={feature.description}
              hover={true}
              className="bg-white border-gray-200 hover:border-primary"
              delay={index * 100}
            />
          ))}
        </div>
      </Section>

      {/* Stats Section with Animated Counters */}
      <Section
        subtitle="Our Track Record"
        title="Delivering Excellence in Every Project"
        description="Numbers that reflect our commitment to quality and client satisfaction"
        className="bg-gray-50"
      >
        <FloatingShapes count={2} colors={['#0066ff', '#7C3AED']} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <StatCounter
            end={150}
            suffix="+"
            label="Projects Delivered"
            description="Web apps, mobile apps, enterprise systems, and AI solutions across industries"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            }
          />
          <StatCounter
            end={25}
            suffix="+"
            label="Industries Served"
            description="Education, Healthcare, Finance, Retail, Manufacturing, and more"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            }
          />
          <StatCounter
            end={50}
            suffix="+"
            label="Happy Clients"
            description="Startups, SMEs, and enterprises trusting us with their digital transformation"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            }
          />
        </div>
      </Section>

      {/* Tech Stack */}
      <Section
        subtitle="Technology Stack"
        title="Built with Modern Technologies"
        description="We use cutting-edge frameworks and tools to deliver robust, scalable solutions."
        className="bg-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'Next.js', label: 'Next.js' },
            { name: 'React', label: 'React' },
            { name: 'Flutter', label: 'Flutter' },
            { name: 'Node.js', label: 'Node.js' },
            { name: 'Python', label: 'Python' },
            { name: 'TensorFlow', label: 'TensorFlow' },
            { name: 'PostgreSQL', label: 'PostgreSQL' },
            { name: 'AWS', label: 'AWS' },
          ].map((tech, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 hover:border-primary rounded-xl min-h-[120px] flex items-center justify-center p-6 transition-all duration-300 hover:shadow-lg card-gradient-border animate-fade-in-up"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="w-full h-full flex items-center justify-center group">
                <span className="text-xl font-bold text-gray-700 group-hover:text-primary transition-colors">
                  {tech.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="gradient-hero relative overflow-hidden">
        {/* Elegant Floating Icons */}
        <FloatingIcons count={10} />

        {/* Simplified background decoration */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-white rounded-full blur-3xl blob-shape"></div>
        </div>

        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className="max-w-3xl mx-auto text-center text-white relative z-10"
        >
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${getAnimationClasses('fadeIn', ctaInView)}`}>
            Ready to Build Your Next Digital Solution?
          </h2>
          <p className={`text-xl md:text-2xl mb-10 text-white/95 ${getAnimationClasses('fadeIn', ctaInView)}`}
             style={{ transitionDelay: '100ms' }}>
            Let&apos;s discuss your project and turn your ideas into powerful applications.
          </p>
          <div className={`flex flex-col sm:flex-row gap-6 justify-center ${getAnimationClasses('slideUp', ctaInView)}`}
               style={{ transitionDelay: '200ms' }}>
            <Button href="/contact" variant="secondary" size="lg" className="shadow-2xl hover:shadow-white/50">
              Start Your Project
            </Button>
            <Button href="/services" variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary shadow-xl">
              View Our Services
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
