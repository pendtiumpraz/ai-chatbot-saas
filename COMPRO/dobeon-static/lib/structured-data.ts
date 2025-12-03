export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dobeon',
  description: 'Healthcare and IT consulting services transforming companies into companies of the future',
  url: 'https://www.dobeon.com',
  logo: 'https://www.dobeon.com/logo.png',
  foundingDate: '2024',
  founders: [
    {
      '@type': 'Person',
      name: 'Soleh Ayubi',
      jobTitle: 'Digital Healthcare & Data Science Expert',
    },
  ],
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Boston',
      addressRegion: 'MA',
      addressCountry: 'US',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'Customer Service',
    email: 'contact@dobeon.com',
    availableLanguage: ['English', 'Indonesian'],
  },
  sameAs: [
    'https://www.linkedin.com/company/dobeon',
    'https://twitter.com/dobeon',
  ],
  areaServed: 'Worldwide',
  serviceType: [
    'Healthcare Consulting',
    'IT Consulting',
    'Digital Transformation',
    'Enterprise Data Management',
    'AI Implementation',
  ],
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const serviceSchema = (service: {
  name: string;
  description: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  provider: {
    '@type': 'Organization',
    name: 'Dobeon',
  },
  areaServed: 'Worldwide',
  url: service.url,
});

export const personSchema = (person: {
  name: string;
  jobTitle: string;
  description: string;
  expertise: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.jobTitle,
  description: person.description,
  worksFor: {
    '@type': 'Organization',
    name: 'Dobeon',
  },
  knowsAbout: person.expertise,
});
