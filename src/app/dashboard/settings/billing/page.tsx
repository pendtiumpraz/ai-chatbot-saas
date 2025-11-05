'use client';

import Link from 'next/link';
import { ArrowLeft, CreditCard, Download, Check } from 'lucide-react';

export default function BillingSettingsPage() {
  const currentPlan = 'Pro';
  const billingCycle = 'Monthly';
  const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['1 Chatbot', '100 Messages/month', 'Basic Support', '1GB Storage'],
      current: false
    },
    {
      name: 'Pro',
      price: 49,
      features: ['10 Chatbots', '10,000 Messages/month', 'Priority Support', '10GB Storage', 'Custom Branding'],
      current: true
    },
    {
      name: 'Enterprise',
      price: 199,
      features: ['Unlimited Chatbots', 'Unlimited Messages', '24/7 Support', 'Unlimited Storage', 'Custom Branding', 'White Label', 'API Access'],
      current: false
    }
  ];

  const invoices = [
    {id: 'INV-2025-001', date: '2025-01-05', amount: 49, status: 'Paid'},
    {id: 'INV-2024-012', date: '2024-12-05', amount: 49, status: 'Paid'},
    {id: 'INV-2024-011', date: '2024-11-05', amount: 49, status: 'Paid'},
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>

        <h1 className="text-3xl font-bold mb-2">Billing & Plans</h1>
        <p className="text-muted-foreground mb-8">Manage your subscription and payment methods</p>

        {/* Current Plan */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
          <div className="flex items-center justify-between p-4 border border-purple-500/30 rounded-lg bg-purple-500/10 dark:bg-purple-500/5">
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currentPlan} Plan</div>
              <div className="text-sm text-purple-600/80 dark:text-purple-400/80">Billed {billingCycle}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">$49</div>
              <div className="text-sm text-purple-600/80 dark:text-purple-400/80">per month</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Next billing date: {nextBillingDate.toLocaleDateString()}
          </div>
        </div>

        {/* Available Plans */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border-2 rounded-lg p-6 ${
                  plan.current
                    ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/5'
                    : 'border-border bg-accent'
                }`}
              >
                <div className="text-xl font-bold mb-2">{plan.name}</div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.current}
                  className={`w-full py-2 rounded-lg font-medium ${
                    plan.current
                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Payment Methods
          </h3>
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-gray-600">Expires 12/2026</div>
              </div>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700">
              Update
            </button>
          </div>
          <button className="mt-4 text-sm text-purple-600 hover:text-purple-700">
            + Add Payment Method
          </button>
        </div>

        {/* Billing History */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Billing History</h3>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium">{invoice.id}</div>
                  <div className="text-sm text-gray-600">{invoice.date}</div>
                </div>
                <div className="flex-1 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {invoice.status}
                  </span>
                </div>
                <div className="flex-1 text-right">
                  <div className="font-medium">${invoice.amount}.00</div>
                  <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 ml-auto">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
