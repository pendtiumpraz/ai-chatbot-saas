'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { formatCurrency } from '@/lib/utils'
import {
  Bot,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  Building2,
} from 'lucide-react'
import { useState } from 'react'

const pricingData = {
  free: {
    usd: 0,
    idr: 0,
    messages: '1,000',
    chatbots: 1,
    knowledgeBase: '10 MB',
    support: 'Email',
    features: [
      '1,000 messages/month',
      '1 chatbot',
      '10 MB knowledge base',
      'Basic analytics',
      'Email support',
      'Community access',
    ],
    notIncluded: [
      'Custom branding',
      'API access',
      'Priority support',
      'Advanced analytics',
    ]
  },
  pro: {
    usd: 49,
    idr: 749000,
    messages: '10,000',
    chatbots: 5,
    knowledgeBase: '100 MB',
    support: 'Priority Email',
    features: [
      '10,000 messages/month',
      '5 chatbots',
      '100 MB knowledge base',
      'Advanced analytics',
      'Custom branding',
      'Priority email support',
      'Team collaboration (5 users)',
      'Conversation history',
      'Export data',
    ],
    notIncluded: [
      'API access',
      'White-label',
      'Dedicated support',
    ]
  },
  business: {
    usd: 149,
    idr: 2249000,
    messages: '50,000',
    chatbots: 20,
    knowledgeBase: '500 MB',
    support: 'Priority + Phone',
    features: [
      '50,000 messages/month',
      '20 chatbots',
      '500 MB knowledge base',
      'Everything in Pro, plus:',
      'API access',
      'Webhooks',
      'Phone support',
      'Team collaboration (20 users)',
      'Advanced security',
      'Custom integrations',
      'SLA guarantee',
    ],
    notIncluded: [
      'White-label',
      'Dedicated account manager',
    ]
  },
  enterprise: {
    usd: 'Custom',
    idr: 'Custom',
    messages: 'Unlimited',
    chatbots: 'Unlimited',
    knowledgeBase: 'Unlimited',
    support: 'Dedicated Manager',
    features: [
      'Unlimited everything',
      'Everything in Business, plus:',
      'White-label solution',
      'Custom AI model training',
      'Dedicated infrastructure',
      'Dedicated account manager',
      'SSO integration',
      'Custom contracts',
      '99.99% SLA',
      'On-premise deployment option',
      'Custom features development',
    ],
    notIncluded: []
  },
}

export default function PricingPage() {
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD')
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const getPrice = (plan: keyof typeof pricingData) => {
    const price = pricingData[plan][currency.toLowerCase() as 'usd' | 'idr']
    if (typeof price === 'number') {
      const finalPrice = billingPeriod === 'yearly' ? price * 10 : price // 2 months free on yearly
      return formatCurrency(finalPrice, currency)
    }
    return price
  }

  const getSavings = () => {
    if (billingPeriod === 'yearly') {
      return currency === 'USD' ? '$98' : 'Rp 1,498,000'
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Navbar */}
      <nav className="navbar-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <Bot className="w-8 h-8 text-purple-600 group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold ai-gradient-text">Universal AI</span>
            </Link>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Simple, transparent pricing</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your <span className="ai-gradient-text">AI Plan</span>
          </h1>

          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Start free, scale as you grow. All plans include core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'glass-card'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'glass-card'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currency === 'USD'
                  ? 'bg-purple-600 text-white'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('IDR')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currency === 'IDR'
                  ? 'bg-purple-600 text-white'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              IDR (Rp)
            </button>
          </div>

          {billingPeriod === 'yearly' && getSavings() && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Save {getSavings()} per year! 🎉
            </p>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free Plan */}
            <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-gray-600" />
                <h3 className="text-2xl font-bold">Free</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">{getPrice('free')}</div>
                <div className="text-sm text-foreground/60">Forever free</div>
              </div>
              <Link href="/signup" className="block mb-6">
                <Button variant="outline" className="w-full">
                  Start Free
                </Button>
              </Link>
              <div className="space-y-3">
                {pricingData.free.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                {pricingData.free.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground/40">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 relative border-2 border-purple-600">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold">Pro</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">{getPrice('pro')}</div>
                <div className="text-sm text-foreground/60">per {billingPeriod === 'monthly' ? 'month' : 'year'}</div>
              </div>
              <Link href="/signup?plan=pro" className="block mb-6">
                <Button className="w-full">
                  Start Pro Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <div className="space-y-3">
                {pricingData.pro.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                {pricingData.pro.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground/40">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Plan */}
            <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold">Business</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">{getPrice('business')}</div>
                <div className="text-sm text-foreground/60">per {billingPeriod === 'monthly' ? 'month' : 'year'}</div>
              </div>
              <Link href="/signup?plan=business" className="block mb-6">
                <Button variant="secondary" className="w-full">
                  Start Business Trial
                </Button>
              </Link>
              <div className="space-y-3">
                {pricingData.business.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                {pricingData.business.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground/40">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-cyan-600" />
                <h3 className="text-2xl font-bold">Enterprise</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">Custom</div>
                <div className="text-sm text-foreground/60">Tailored to your needs</div>
              </div>
              <Link href="/contact-sales" className="block mb-6">
                <Button variant="secondary" className="w-full">
                  Contact Sales
                </Button>
              </Link>
              <div className="space-y-3">
                {pricingData.enterprise.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-500/5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked <span className="ai-gradient-text">Questions</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'What happens if I exceed my message quota?',
                a: 'You can purchase additional message packs or upgrade your plan. Your chatbot continues working with overage charges applied.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 14-day money-back guarantee. No questions asked.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. Cancel your subscription anytime with one click. No hidden fees or contracts.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept credit cards, PayPal, and bank transfers for Indonesia customers (via Midtrans).',
              },
              {
                q: 'Do you have a free trial?',
                a: 'Yes! All paid plans include a 14-day free trial. No credit card required to start.',
              },
            ].map((faq, i) => (
              <div key={i} className="glass-card p-6 rounded-xl">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-foreground/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card rounded-2xl p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Still have questions?
              </h2>
              <p className="text-xl text-foreground/70 mb-8">
                Chat with our team or schedule a demo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">
                    Contact Sales
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="secondary">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
