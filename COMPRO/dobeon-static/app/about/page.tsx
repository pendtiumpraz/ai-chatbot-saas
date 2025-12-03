import { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import TeamMemberCard from '@/components/TeamMemberCard';
import FloatingShapes from '@/components/FloatingShapes';
import GlassCard from '@/components/GlassCard';
import StatCounter from '@/components/StatCounter';
import PlaceholderImage from '@/components/PlaceholderImage';

export const metadata: Metadata = {
  title: 'About Us - Dobeon',
  description: 'Meet our world-class team of experts in healthcare innovation, digital transformation, and enterprise technology.',
};

export default function About() {
  const teamMembers = [
    {
      name: 'Soleh Ayubi, PhD',
      role: 'Digital Healthcare & Data Science Expert',
      bio: 'PhD in Health Sciences with extensive global healthcare experience. Currently Vice President Director at PT Bio Farma (Persero), former Director Head of Digital Therapeutics and Data Science at Novo Nordisk. Digital Health Entrepreneurship advisor at Harvard University with two US patents in healthcare innovation.',
      expertise: ['Digital Healthcare', 'Data Science', 'Healthcare Innovation', 'Digital Therapeutics'],
      image: '/photo/Soleh Ayubi.png',
    },
    {
      name: 'Sai Prasad',
      role: 'Enterprise Data & AI Specialist',
      bio: 'Specialist Leader at Deloitte focusing on Engineering, AI & Data. Expert in enterprise data management, analytics, AI implementation, and business intelligence platforms with deep experience in Life Sciences & Healthcare.',
      expertise: ['Enterprise Data Management', 'AI & Analytics', 'Solution Architecture', 'Conversational AI'],
      image: '/photo/Sai Prasad.jpg',
    },
    {
      name: 'John Brownstein, PhD',
      role: 'Chief Innovation Officer & Epidemiologist',
      bio: 'Professor at Harvard Medical School and Chief Innovation Officer at Boston Children\'s Hospital. Pioneer in Computational Epidemiology, founder of HealthMap, and advisor to CDC, WHO, and White House on real-time public health surveillance.',
      expertise: ['Computational Epidemiology', 'Digital Health Innovation', 'Public Health Surveillance', 'Healthcare Systems'],
      image: '/photo/John Brownstein.png',
    },
    {
      name: 'Gajen Sunthara, MSc IT',
      role: 'Healthcare Interoperability Expert',
      bio: 'Former White House Presidential Innovation Fellow and tech-architect for President Obama\'s Precision Medicine Initiative. Founder of 1upHealth, Inc., pioneered early EHR systems at Boston Children\'s Hospital. Currently CTO/tech-cofounder and Senior Advisor for Harvard Medical School.',
      expertise: ['Healthcare Interoperability', 'FHIR Standards', 'Electronic Health Records', 'Precision Medicine'],
      image: '/photo/Gajen.png',
    },
    {
      name: 'Kerrie Holley, JD',
      role: 'AI & Cloud Architecture Thought Leader',
      bio: 'US National Academy of Engineering member, former executive at Google and Senior VP at Optum (UnitedHealth Group). IBM Fellow Emeritus, author of "AI First Healthcare" and "LLMs and Generative AI for Healthcare". Pioneer in Service-Oriented Architecture.',
      expertise: ['AI & Machine Learning', 'Cloud Architecture', 'Healthcare Technology', 'Enterprise Transformation'],
      image: '/photo/Kerrie Holley.jpg',
    },
    {
      name: 'Paul Nielsen',
      role: 'Governance & Cyber Security Advisor',
      bio: 'Harvard University graduate with certifications as Certified Mergers & Acquisitions Advisor (CM&AA) and Certified Cyber Security Risk Advisor (CCSRA). Former Director and Chair of COSBOA. Specializes in certified risk mitigation advice for organizations.',
      expertise: ['Business Governance', 'Cyber Security Risk', 'Mergers & Acquisitions', 'Risk Mitigation'],
      image: '/photo/Paul Nielsen.jpg',
    },
    {
      name: 'Seth Berkeley, MD',
      role: 'Global Health & Vaccines Leader',
      bio: 'Former CEO of Gavi, the Vaccine Alliance (2011-2023), co-founder of COVAX. Founder and former CEO of International AIDS Vaccine Initiative (IAVI). Extensive experience with CDC and Rockefeller Foundation in global health initiatives.',
      expertise: ['Global Health', 'Vaccines & Immunization', 'Infectious Disease Preparedness', 'Healthcare Leadership'],
      image: '/photo/Seth Berkeley 2.jpeg',
    },
    {
      name: 'Dr. Ivan Sini, MD, Sp.OG, MMIS',
      role: 'Healthcare Leadership & Innovation',
      bio: 'President Commissioner of PT Bundamedik Healthcare System (BMHS). Fellow of the Royal Australian and NZ College of Obstetricians and Gynecologists. Master of Minimally Invasive Surgery from University of Adelaide. Founder of Morula IVF.',
      expertise: ['Healthcare System Management', 'Minimally Invasive Surgery', 'Medical Innovation', 'Healthcare Leadership'],
      image: '/photo/Ivan Sini 2.jpg',
    },
    {
      name: 'Salman Subakat',
      role: 'Corporate Transformation & Leadership',
      bio: 'CEO of PT Paragon Technology and Innovation, leading a company with over 10,000 employees. Alumnus of Electrical Engineering from Bandung Institute of Technology (ITB). Focuses on corporate transformation, leadership development, and innovation culture.',
      expertise: ['Corporate Transformation', 'Leadership Development', 'Innovation Culture', 'Business Strategy'],
      image: '/photo/Salman Subakat.jpg',
    },
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We deliver world-class expertise from leaders who have shaped healthcare at Harvard, Google, WHO, and the White House.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We pioneer breakthrough solutions in AI, FHIR interoperability, and digital health, backed by US patents and published research.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      ),
    },
    {
      title: 'Collaboration',
      description: 'We integrate seamlessly with your teams, bringing experience from advising CDC, WHO, and leading multinational enterprises.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      title: 'Impact',
      description: 'We drive measurable outcomes, from scaling global vaccine distribution to transforming Fortune 500 healthcare enterprises.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <Hero
        subtitle="About Dobeon"
        title="World-Class Experts Driving Healthcare & Technology Transformation"
        description="We unite industry-leading professionals from Harvard Medical School, Google, Deloitte, and global health organizations with proven track records in transforming healthcare and technology enterprises."
        ctaText="Meet Our Team"
        ctaLink="#team"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
      />

      {/* Mission & Vision */}
      <Section
        subtitle="Our Mission"
        title="Transforming Companies Into Companies of the Future"
        description="We partner with healthcare and technology organizations to architect their digital transformation journey. Through rigorous assessment frameworks, strategic gap analysis, and proven implementation methodologies, we position enterprises for sustained competitive advantage in the digital age. Our experts have led transformations at Fortune 500 companies, government agencies, and global health organizations."
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

      {/* Team Section */}
      <Section
        id="team"
        dark
        subtitle="Our Team"
        title="Meet the Experts"
        description="Our team unites exceptional leaders who have pioneered healthcare innovations at Harvard Medical School, led global health initiatives at Gavi and WHO, architected enterprise AI at Google and Deloitte, and advised the White House on precision medicine. Together, we bring unparalleled expertise in transforming healthcare and technology organizations."
        className="relative overflow-hidden"
      >
        {/* Simplified background decoration */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-1/3 right-1/3 w-[35rem] h-[35rem] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl blob-shape"></div>
        </div>

        {/* Bento Grid Layout for 9 Team Members */}
        <div className="bento-grid relative z-10">
          {teamMembers.map((member, index) => {
            const gradients: ('blue' | 'purple' | 'orange' | 'pink' | 'cyan' | 'green')[] = [
              'blue', 'purple', 'orange', 'pink', 'cyan', 'green', 'blue', 'purple', 'orange'
            ];
            // Featured member (first one - Soleh Ayubi)
            const featured = index === 0;

            return (
              <TeamMemberCard
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                expertise={member.expertise}
                image={member.image}
                featured={featured}
                gradient="blue"
                delay={index * 100}
              />
            );
          })}
        </div>
      </Section>

      {/* Experience Highlights */}
      <Section
        subtitle="Our Experience"
        title="Trusted by Leading Organizations Worldwide"
        className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
      >
        <FloatingShapes count={2} colors={['#7C3AED', '#EC4899']} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <StatCounter
            end={100}
            suffix="+"
            label="Years Combined Experience"
            description="In healthcare transformation, AI implementation, and digital health innovation"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }
          />
          <StatCounter
            end={50}
            suffix="+"
            label="Global Health Impact"
            description="From COVAX vaccine distribution to White House precision medicine initiatives"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }
          />
          <StatCounter
            end={9}
            label="Industry Leaders"
            description="From Harvard, Google, Deloitte, Gavi, and leading Indonesian healthcare systems"
            gradient="blue"
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            }
          />
        </div>
      </Section>
    </>
  );
}
