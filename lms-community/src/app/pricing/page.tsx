import FloatingNavbar from '@/components/public/FloatingNavbar';
import Button from '@/components/shared/Button';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 'Rp 0',
      period: '/forever',
      description: 'Perfect for getting started',
      features: [
        'Access to free courses',
        'Basic course materials',
        'Community forums',
        'Email support',
        'Certificate of completion',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 'Rp 199,000',
      period: '/month',
      description: 'Best for serious learners',
      features: [
        'Access to all courses',
        'Premium course materials',
        'Priority support',
        'Downloadable resources',
        'Advanced certificates',
        'Live Q&A sessions',
        'Course completion badges',
      ],
      cta: 'Start Pro Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Custom course creation',
        'Dedicated account manager',
        'Advanced analytics',
        'Team management',
        'API access',
        'Custom integrations',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <FloatingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-8 ${
                plan.highlighted
                  ? 'ring-4 ring-primary-500 shadow-hard transform scale-105'
                  : 'shadow-medium'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold px-4 py-2 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600">{plan.period}</span>
              </div>

              <Button
                variant={plan.highlighted ? 'primary' : 'outline'}
                className="w-full mb-8"
              >
                {plan.cta}
              </Button>

              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
