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
import Image from 'next/image';
import { organizationSchema} from '@/lib/structured-data';
import { useInView, getAnimationClasses } from '@/lib/animations';

export default function Home() {
  const { ref: ctaRef, isInView: ctaInView } = useInView();
  const services = [
    {
      title: 'Assess Readiness',
      description: 'Comprehensive evaluation of your organization\'s digital maturity, infrastructure capabilities, and readiness for transformation into a company of the future.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      ),
    },
    {
      title: 'Identify Gaps',
      description: 'Expert analysis to pinpoint critical gaps in technology, processes, skills, and organizational structure that prevent you from achieving your transformation goals.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      ),
    },
    {
      title: 'Close Gaps',
      description: 'Strategic implementation roadmap and hands-on support to bridge identified gaps through proven methodologies, cutting-edge technology, and expert guidance.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      ),
    },
  ];

  const features = [
    {
      title: 'Healthcare Innovation',
      description: 'Digital therapeutics, precision medicine, and healthcare interoperability solutions powered by industry-leading expertise.',
    },
    {
      title: 'Enterprise Data & AI',
      description: 'Advanced analytics, AI/ML implementation, and enterprise data management solutions for data-driven decision making.',
    },
    {
      title: 'Digital Transformation',
      description: 'End-to-end transformation strategy from assessment to implementation, leveraging global best practices.',
    },
    {
      title: 'Cloud Architecture',
      description: 'Scalable cloud solutions and modern architecture design for future-ready technology infrastructure.',
    },
  ];

  return (
    <>
      <StructuredData data={organizationSchema} />
      {/* Hero Section */}
      <Hero
        subtitle="Healthcare & IT Consulting"
        title="Transform Your Organization Into a Company of the Future"
        description="Expert consulting services combining healthcare innovation, digital transformation, and cutting-edge technology to prepare your organization for tomorrow's challenges."
        ctaText="Start Your Journey"
        ctaLink="/contact"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        backgroundImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80"
      />

      {/* Services Overview */}
      <Section
        id="services"
        subtitle="Our Approach"
        title="Three-Step Transformation Framework"
        description="We guide organizations through a proven methodology to achieve sustainable transformation and lasting competitive advantage."
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
        subtitle="Why Choose Dobeon"
        title="World-Class Expertise Meets Innovation"
        description="Our team brings together decades of experience from leading global healthcare organizations, technology companies, and academic institutions."
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
        subtitle="Our Impact in Numbers"
        title="Measurable Results, Real Transformation"
        description="Data-driven outcomes that demonstrate our commitment to excellence"
        className="bg-gray-50"
      >
        <FloatingShapes count={2} colors={['#0066ff', '#7C3AED']} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <StatCounter
            end={100}
            suffix="+"
            label="Years Combined Experience"
            description="In healthcare transformation, AI implementation, and digital health innovation"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            }
          />
          <StatCounter
            end={9}
            label="Industry Leaders"
            description="From Harvard, Google, Deloitte, Gavi, and leading healthcare systems"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            }
          />
          <StatCounter
            end={50}
            suffix="+"
            label="Global Organizations"
            description="Partnered with Fortune 500 companies and government agencies worldwide"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }
          />
        </div>
      </Section>

      {/* Social Proof */}
      <Section
        subtitle="Our Impact"
        title="Trusted by Industry Leaders"
        description="Our experts have worked with and advised leading organizations worldwide."
        className="bg-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'Harvard Medical School', logo: '/logo/Harvard.png', width: 140, height: 50 },
            { name: 'Boston Children\'s Hospital', logo: '/logo/Boston.png', width: 140, height: 50 },
            { name: 'Bio Farma', logo: '/logo/Biofarma.png', width: 140, height: 50 },
            { name: 'Deloitte', logo: '/logo/Deloitte.png', width: 140, height: 40 },
            { name: 'Google', logo: '/logo/Google.png', width: 120, height: 40 },
            { name: 'IBM', logo: '/logo/IBM_logo.svg.png', width: 100, height: 40 },
            { name: 'Novo Nordisk', logo: '/logo/Novo.png', width: 140, height: 40 },
            { name: 'White House', logo: '/logo/Harvard.png', width: 140, height: 50 },
          ].map((org, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 hover:border-primary rounded-xl opacity-80 hover:opacity-100 min-h-[120px] flex items-center justify-center p-6 transition-all duration-300 hover:shadow-lg card-gradient-border animate-fade-in-up"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="w-full h-full flex items-center justify-center group">
                <Image
                  src={org.logo}
                  alt={org.name}
                  width={org.width}
                  height={org.height}
                  className="w-auto h-auto max-w-full max-h-[60px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
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
            Ready to Transform Your Organization?
          </h2>
          <p className={`text-xl md:text-2xl mb-10 text-white/95 ${getAnimationClasses('fadeIn', ctaInView)}`}
             style={{ transitionDelay: '100ms' }}>
            Let&apos;s discuss how we can help you become a company of the future.
          </p>
          <div className={`flex flex-col sm:flex-row gap-6 justify-center ${getAnimationClasses('slideUp', ctaInView)}`}
               style={{ transitionDelay: '200ms' }}>
            <Button href="/contact" variant="secondary" size="lg" className="shadow-2xl hover:shadow-white/50">
              Get in Touch
            </Button>
            <Button href="/about" variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary shadow-xl">
              Meet Our Team
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
