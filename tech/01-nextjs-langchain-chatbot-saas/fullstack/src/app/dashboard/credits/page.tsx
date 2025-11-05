'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  CreditCard,
  Zap,
  Loader2,
  Check
} from 'lucide-react'

interface Credits {
  balance: number
  total_purchased: number
  total_used: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  balance_after: number
  description: string
  created_at: string
  metadata?: any
}

const CREDIT_PACKAGES = [
  { amount: 10, tokens: '100K', popular: false, bonus: 0 },
  { amount: 25, tokens: '300K', popular: false, bonus: 50000 },
  { amount: 50, tokens: '600K', popular: true, bonus: 100000 },
  { amount: 100, tokens: '1.5M', popular: false, bonus: 300000 },
]

export default function CreditsPage() {
  const [credits, setCredits] = useState<Credits | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)

  useEffect(() => {
    fetchCredits()
    fetchTransactions()
  }, [])

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits')
      const data = await response.json()
      
      if (response.ok) {
        setCredits(data.credits)
      }
    } catch (err) {
      console.error('Failed to load credits')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/credits?type=transactions&limit=20')
      const data = await response.json()
      
      if (response.ok) {
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error('Failed to load transactions')
    }
  }

  const handlePurchase = async (amount: number) => {
    setPurchasing(true)
    setSelectedPackage(amount)

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount,
          paymentMethod: 'card' 
        }),
      })

      if (response.ok) {
        // Refresh credits
        await fetchCredits()
        await fetchTransactions()
        alert('Credits purchased successfully!')
      } else {
        alert('Purchase failed. Please try again.')
      }
    } catch (err) {
      alert('Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
      setSelectedPackage(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'usage':
        return <TrendingDown className="w-5 h-5 text-red-600" />
      case 'bonus':
        return <Zap className="w-5 h-5 text-yellow-600" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Credits & Billing</h1>
          <p className="text-foreground/60">
            Purchase AI credits or use your own API keys
          </p>
        </div>

        {/* Current Balance Card */}
        <div className="glass-card p-8 rounded-2xl mb-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-600/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-foreground/60 mb-2">Current Balance</p>
              <h2 className="text-5xl font-bold ai-gradient-text">
                ${credits?.balance.toFixed(2) || '0.00'}
              </h2>
            </div>
            <div className="p-4 rounded-full bg-purple-600/20">
              <DollarSign className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <p className="text-sm text-foreground/60 mb-1">Total Purchased</p>
              <p className="text-2xl font-bold">${credits?.total_purchased.toFixed(2) || '0.00'}</p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <p className="text-sm text-foreground/60 mb-1">Total Used</p>
              <p className="text-2xl font-bold">${credits?.total_used.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Purchase Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.amount}
                className={`glass-card p-6 rounded-xl relative overflow-hidden transition-all hover:scale-105 ${
                  pkg.popular ? 'border-2 border-purple-600' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="text-4xl font-bold ai-gradient-text mb-2">
                    ${pkg.amount}
                  </div>
                  <div className="text-sm text-foreground/60">{pkg.tokens} tokens</div>
                  {pkg.bonus > 0 && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      +{(pkg.bonus / 1000).toFixed(0)}K bonus!
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.amount)}
                  disabled={purchasing}
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  {purchasing && selectedPackage === pkg.amount ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Purchase
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-sm text-foreground/60">
            <p>💳 Secure payment via Stripe • Instant credit delivery</p>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {transactions.length === 0 ? (
            <div className="glass-card p-8 rounded-xl text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
              <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
              <p className="text-foreground/60">
                Purchase credits above to get started
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-accent/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
                      <th className="px-6 py-3 text-right text-sm font-medium">Amount</th>
                      <th className="px-6 py-3 text-right text-sm font-medium">Balance After</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-accent/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(transaction.type)}
                            <span className="capitalize font-medium">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground/60">
                          {transaction.description}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium ${
                          transaction.type === 'purchase' || transaction.type === 'bonus'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'purchase' || transaction.type === 'bonus' ? '+' : '-'}
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          ${transaction.balance_after.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground/60">
                          {new Date(transaction.created_at).toLocaleDateString()} {new Date(transaction.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 glass-card p-6 rounded-xl border-l-4 border-blue-600">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            How Credits Work
          </h3>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li>• <strong>1 Credit = $1 USD</strong> of AI usage</li>
            <li>• Credits are deducted based on actual token usage</li>
            <li>• OpenAI GPT-4: ~$0.03 per 1K tokens</li>
            <li>• If you have your own API key, use that instead (unlimited & free)</li>
            <li>• Unused credits never expire</li>
            <li>• Larger packages come with bonus tokens!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
