import { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Button from '@/components/Button';
import FloatingShapes from '@/components/FloatingShapes';
import FloatingIcons from '@/components/FloatingIcons';
import GlassCard from '@/components/GlassCard';
import Card from '@/components/Card';
import PlaceholderImage from '@/components/PlaceholderImage';

export const metadata: Metadata = {
  title: 'Services - Dobeon Digital',
  description: 'Custom web applications, mobile apps, enterprise systems, and AI-powered solutions for businesses across all industries.',
};

export default function Services() {
  const coreServices = [
    {
      id: 'web-mobile',
      title: 'Web & Mobile Applications',
      tagline: 'Modern Apps for Modern Businesses',
      description: 'Full-stack web applications and cross-platform mobile apps built with cutting-edge technologies.',
      details: [
        'Responsive web applications with Next.js, React, Vue.js',
        'Cross-platform mobile apps with Flutter & React Native',
        'Native iOS and Android development',
        'Progressive Web Apps (PWA) development',
        'Real-time features with WebSocket integration',
        'API development and third-party integrations',
      ],
      outcomes: [
        'Scalable and maintainable applications',
        'Fast time-to-market deployment',
        'Seamless user experience across devices',
        'Robust backend infrastructure',
      ],
    },
    {
      id: 'enterprise',
      title: 'Enterprise Systems (SI)',
      tagline: 'Streamline Your Business Operations',
      description: 'Custom enterprise solutions tailored to your unique business processes and requirements.',
      details: [
        'ERP (Enterprise Resource Planning) systems',
        'CRM (Customer Relationship Management)',
        'HRM & Payroll management systems',
        'Inventory & Supply Chain Management',
        'Document Management Systems',
        'Business Intelligence & Reporting dashboards',
      ],
      outcomes: [
        'Increased operational efficiency',
        'Automated business processes',
        'Real-time data visibility',
        'Better decision making with analytics',
      ],
    },
    {
      id: 'ai-solutions',
      title: 'AI-Powered Solutions',
      tagline: 'Intelligence That Transforms Business',
      description: 'Leverage artificial intelligence to automate, optimize, and innovate your business processes.',
      details: [
        'Custom AI/ML model development',
        'Computer Vision & Image Recognition',
        'Natural Language Processing (NLP)',
        'Chatbots & Virtual Assistants',
        'Predictive Analytics & Forecasting',
        'Generative AI applications (LLM integration)',
      ],
      outcomes: [
        'Automated repetitive tasks',
        'Data-driven insights and predictions',
        'Enhanced customer experience with AI',
        'Competitive advantage through innovation',
      ],
    },
  ];

  const specializations = [
    {
      title: 'Education & E-Learning',
      description: 'LMS, virtual classrooms, online courses, student portals, and educational management systems.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
    },
    {
      title: 'Healthcare & Medical',
      description: 'Hospital systems, telemedicine, clinic apps, EMR/EHR, pharmacy, and healthcare automation.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      ),
    },
    {
      title: 'Finance & Fintech',
      description: 'Banking apps, payment gateways, trading platforms, accounting, and financial management.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
    },
    {
      title: 'Retail & E-Commerce',
      description: 'Online stores, marketplace platforms, POS systems, inventory, and omnichannel solutions.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      title: 'Manufacturing & Logistics',
      description: 'Production management, supply chain, warehouse systems, and IoT integration.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      ),
    },
    {
      title: 'Government & Public Sector',
      description: 'E-government portals, public services, citizen apps, and administrative systems.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
        </svg>
      ),
    },
  ];

  const industries = [
    'Education',
    'Healthcare',
    'Finance',
    'Retail',
    'Manufacturing',
    'Logistics',
    'Real Estate',
    'Hospitality',
    'Agriculture',
    'Government',
    'Media',
    'Startups',
  ];

  return (
    <>
      <Hero
        subtitle="Our Services"
        title="Build Powerful Digital Solutions for Your Business"
        description="From web and mobile apps to enterprise systems and AI solutions, we deliver custom software that drives results across every industry."
        ctaText="Start Your Project"
        ctaLink="/contact"
        backgroundImage="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80"
      />

      {/* Core Services Framework */}
      <Section
        subtitle="What We Build"
        title="Complete Digital Development Services"
        description="We offer end-to-end development services to transform your ideas into powerful applications."
        className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        <FloatingShapes count={3} colors={['#0066ff', '#7C3AED', '#EC4899']} />

        <div className="space-y-16 relative z-10">
          {coreServices.map((service, index) => {
            return (
              <div
                key={service.id}
                id={service.id}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className="inline-block px-4 py-2 gradient-blue text-white font-semibold rounded-full mb-4 shadow-lg">
                    Service {index + 1}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-xl text-gradient-blue mb-4 font-semibold">{service.tagline}</p>
                  <p className="text-lg text-gray-600 mb-6">{service.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What We Deliver:</h4>
                    <ul className="space-y-2">
                      {service.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start">
                          <svg className="w-6 h-6 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {service.outcomes.map((outcome, outcomeIndex) => (
                        <li key={outcomeIndex} className="flex items-start">
                          <svg className="w-6 h-6 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <PlaceholderImage
                    type="service"
                    aspectRatio="4/3"
                    className="shadow-2xl"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Specializations */}
      <Section
        dark
        subtitle="Industry Expertise"
        title="Solutions for Every Sector"
        description="We have deep experience building applications across diverse industries."
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-1/3 left-1/3 w-[32rem] h-[32rem] bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl blob-shape"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {specializations.map((spec, index) => {
            const glassGradients: ('blue' | 'purple' | 'orange' | 'cyan' | 'pink')[] = ['blue', 'purple', 'orange', 'cyan', 'pink', 'blue'];
            return (
              <GlassCard
                key={index}
                gradient={glassGradients[index]}
                variant="dark"
                delay={index * 100}
              >
                <div className="text-primary mb-4">{spec.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{spec.title}</h3>
                <p className="text-gray-300">{spec.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </Section>

      {/* Industries Served */}
      <Section
        subtitle="All Industries"
        title="We Build for Every Business"
        description="No matter your industry, we have the expertise to deliver solutions that fit your needs."
        className="relative"
      >
        <FloatingShapes count={2} colors={['#0066ff', '#06B6D4']} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="p-6 bg-white border-2 border-gray-200 rounded-lg text-center hover:border-primary hover:shadow-xl transition-all card-gradient-border hover:scale-105 duration-300"
            >
              <span className="font-semibold text-gray-900">{industry}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="gradient-hero relative overflow-hidden">
        <FloatingIcons count={10} />

        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-white rounded-full blur-3xl blob-shape"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center text-white relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Build Your Next Application?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/95">
            Let&apos;s discuss your project requirements and turn your ideas into reality.
          </p>
          <Button href="/contact" variant="secondary" size="lg" className="shadow-2xl hover:shadow-white/50">
            Get a Free Consultation
          </Button>
        </div>
      </Section>
    </>
  );
}
