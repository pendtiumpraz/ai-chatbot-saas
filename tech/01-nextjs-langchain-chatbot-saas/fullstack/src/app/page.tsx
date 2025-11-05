'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Bot,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  MessageSquare,
  FileText,
  BarChart3,
  Users,
  Building2,
  GraduationCap,
  Heart,
  Scale,
  DollarSign,
  Menu,
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Navbar */}
      <nav className="navbar-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Bot className="w-8 h-8 text-purple-600 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-purple-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
              <span className="text-xl font-bold ai-gradient-text">
                Universal AI
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Features
              </Link>
              <Link href="#use-cases" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Use Cases
              </Link>
              <Link href="/pricing" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Docs
              </Link>
            </div>

            {/* CTA + Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <Link href="#features" className="block text-foreground/80 hover:text-foreground">
                Features
              </Link>
              <Link href="#use-cases" className="block text-foreground/80 hover:text-foreground">
                Use Cases
              </Link>
              <Link href="/pricing" className="block text-foreground/80 hover:text-foreground">
                Pricing
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-20 pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Powered by GPT-4 & RAG Technology</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Deploy AI Chatbots for
              <br />
              <span className="ai-gradient-text">Any Industry</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto">
              One platform, unlimited possibilities. From customer service to education, 
              healthcare to finance—your intelligent assistant powered by cutting-edge AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="secondary" className="text-lg">
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-1">
                <div className="text-3xl font-bold ai-gradient-text">10+</div>
                <div className="text-sm text-foreground/60">Industries</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold ai-gradient-text">24/7</div>
                <div className="text-sm text-foreground/60">Availability</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold ai-gradient-text">99.9%</div>
                <div className="text-sm text-foreground/60">Uptime</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-20 relative">
            <div className="glass-card rounded-2xl p-8 scan-line">
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <Bot className="w-32 h-32 text-purple-400 float-animation" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent shimmer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Powerful <span className="ai-gradient-text">AI Features</span>
            </h2>
            <p className="text-xl text-foreground/70">
              Everything you need to build intelligent chatbots
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'RAG Technology',
                description: 'Upload your documents and let AI learn from them. Accurate, context-aware responses every time.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Streaming responses with edge computing. Your users get instant answers without delays.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption, GDPR compliant, and row-level security for multi-tenant isolation.',
              },
              {
                icon: Globe,
                title: 'Multi-Language',
                description: 'Automatic detection and response in Bahasa Indonesia and English. More languages coming soon.',
              },
              {
                icon: FileText,
                title: 'Smart Documents',
                description: 'Upload PDFs, DOCX, TXT files. AI automatically extracts and indexes knowledge.',
              },
              {
                icon: TrendingUp,
                title: 'Analytics Dashboard',
                description: 'Track conversations, popular questions, satisfaction scores, and usage metrics.',
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-500/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Built for <span className="ai-gradient-text">Every Industry</span>
            </h2>
            <p className="text-xl text-foreground/70">
              One platform, unlimited use cases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, title: 'E-Commerce', subtitle: 'Customer Support 24/7' },
              { icon: GraduationCap, title: 'Education', subtitle: 'AI Study Companion' },
              { icon: Heart, title: 'Healthcare', subtitle: 'Patient Pre-Screening' },
              { icon: Building2, title: 'Enterprise', subtitle: 'Internal Knowledge Base' },
              { icon: DollarSign, title: 'Finance', subtitle: 'Product Information' },
              { icon: Scale, title: 'Legal', subtitle: 'Legal Info Assistant' },
              { icon: Users, title: 'HR', subtitle: 'Employee Self-Service' },
              { icon: BarChart3, title: 'Analytics', subtitle: 'Data-Driven Insights' },
            ].map((useCase, i) => (
              <div key={i} className="glass-card p-6 rounded-xl text-center hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <useCase.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">{useCase.title}</h3>
                <p className="text-sm text-foreground/60">{useCase.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/use-cases">
              <Button size="lg" variant="secondary">
                Explore All Use Cases
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Trusted by <span className="ai-gradient-text">Businesses</span>
            </h2>
            <p className="text-xl text-foreground/70">
              Join hundreds of companies automating with AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Cut our customer service costs by 70% while improving response time. Game changer!",
                author: "Sarah Chen",
                role: "CEO, TechCommerce",
                avatar: "SC"
              },
              {
                quote: "Students love having 24/7 access to course materials. Our engagement is up 3x.",
                author: "Dr. Ahmad Rizki",
                role: "Dean, Jakarta University",
                avatar: "AR"
              },
              {
                quote: "The RAG technology is incredible. Our bot answers complex medical questions accurately.",
                author: "Dr. Maria Santos",
                role: "CTO, HealthCare Plus",
                avatar: "MS"
              },
            ].map((testimonial, i) => (
              <div key={i} className="glass-card p-6 rounded-xl">
                <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-sm text-foreground/60">{testimonial.role}</div>
                  </div>
                </div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to <span className="ai-gradient-text">Deploy AI</span>?
              </h2>
              <p className="text-xl text-foreground/70 mb-8">
                Start your free trial today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="text-lg">
                    Start Free Trial
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="secondary" className="text-lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-foreground/60 mt-6">
                Free 14-day trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-6 h-6 text-purple-600" />
                <span className="font-bold ai-gradient-text">Universal AI</span>
              </div>
              <p className="text-sm text-foreground/60">
                AI chatbots for every industry. Powered by GPT-4 and RAG technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Use Cases</Link></li>
                <li><Link href="#" className="hover:text-foreground">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>© 2024 Universal AI Chatbot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
