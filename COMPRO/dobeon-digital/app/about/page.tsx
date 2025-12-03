import { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import FloatingShapes from '@/components/FloatingShapes';
import GlassCard from '@/components/GlassCard';
import StatCounter from '@/components/StatCounter';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: 'About Us - Dobeon Digital',
  description: 'A passionate team of developers, designers, and tech experts building powerful digital solutions for businesses worldwide.',
};

export default function About() {
  const values = [
    {
      title: 'Quality First',
      description: 'We deliver clean, maintainable code with modern best practices. Every project is built to last and scale.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We stay ahead with the latest technologies - React, Next.js, Flutter, AI/ML - to build cutting-edge solutions.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      ),
    },
    {
      title: 'Partnership',
      description: 'We work closely with clients as partners, understanding your business to deliver solutions that truly fit.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      title: 'Results',
      description: 'We measure success by your success. Every project is focused on delivering real business value and ROI.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
        </svg>
      ),
    },
  ];

  const techStack = [
    { category: 'Frontend', techs: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'TypeScript'] },
    { category: 'Mobile', techs: ['Flutter', 'React Native', 'iOS (Swift)', 'Android (Kotlin)'] },
    { category: 'Backend', techs: ['Node.js', 'Python', 'Go', 'PHP Laravel', 'PostgreSQL', 'MongoDB'] },
    { category: 'AI/ML', techs: ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Computer Vision'] },
    { category: 'Cloud', techs: ['AWS', 'Google Cloud', 'Vercel', 'Docker', 'Kubernetes'] },
    { category: 'Tools', techs: ['Git', 'CI/CD', 'Figma', 'Jira', 'Agile/Scrum'] },
  ];

  return (
    <>
      <Hero
        subtitle="About Dobeon Digital"
        title="Your Trusted Partner for Digital Solutions"
        description="We are a team of passionate developers and tech enthusiasts dedicated to building powerful, scalable, and innovative digital solutions. From startups to enterprises, we help businesses transform their ideas into reality."
        ctaText="Start Your Project"
        ctaLink="/contact"
        backgroundImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
      />

      {/* Our Values */}
      <Section
        subtitle="Our Values"
        title="What Drives Us"
        description="We believe in building not just software, but lasting partnerships with our clients."
        className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50"
      >
        <FloatingShapes count={3} colors={['#0066ff', '#7C3AED', '#00D9FF']} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 relative z-10">
          {values.map((value, index) => {
            const gradients: ('blue' | 'purple' | 'orange' | 'cyan')[] = ['blue', 'purple', 'orange', 'cyan'];
            return (
              <GlassCard
                key={index}
                gradient={gradients[index]}
                variant="light"
                animationVariant="scaleIn"
                delay={index * 100}
              >
                <div className="text-primary mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </Section>

      {/* Tech Stack */}
      <Section
        dark
        subtitle="Technology Stack"
        title="Modern Tools for Modern Solutions"
        description="We use the latest and most reliable technologies to build robust applications."
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-1/3 right-1/3 w-[35rem] h-[35rem] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl blob-shape"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {techStack.map((stack, index) => {
            const gradients: ('blue' | 'purple' | 'orange' | 'cyan' | 'pink')[] = ['blue', 'purple', 'orange', 'cyan', 'pink', 'blue'];
            return (
              <GlassCard
                key={index}
                gradient={gradients[index]}
                variant="dark"
                delay={index * 100}
              >
                <h3 className="text-xl font-bold mb-4 text-white">{stack.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.techs.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </Section>

      {/* Stats */}
      <Section
        subtitle="Our Track Record"
        title="Numbers That Speak"
        className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
      >
        <FloatingShapes count={2} colors={['#7C3AED', '#EC4899']} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <StatCounter
            end={150}
            suffix="+"
            label="Projects Completed"
            description="Web apps, mobile apps, and enterprise systems delivered successfully"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            }
          />
          <StatCounter
            end={50}
            suffix="+"
            label="Happy Clients"
            description="From startups to enterprises across various industries"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            }
          />
          <StatCounter
            end={25}
            suffix="+"
            label="Industries Served"
            description="Education, healthcare, finance, retail, and many more"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            }
          />
        </div>
      </Section>

      {/* CTA */}
      <Section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-white rounded-full blur-3xl blob-shape"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center text-white relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Let&apos;s Build Something Amazing Together
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/95">
            Ready to start your project? We&apos;re here to help turn your vision into reality.
          </p>
          <Button href="/contact" variant="secondary" size="lg" className="shadow-2xl hover:shadow-white/50">
            Get in Touch
          </Button>
        </div>
      </Section>
    </>
  );
}
