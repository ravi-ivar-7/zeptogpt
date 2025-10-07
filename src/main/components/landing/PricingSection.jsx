'use client'

import { Check, Zap, Crown, Rocket } from 'lucide-react'
import { Button } from '@/main/components/ui/button'

const plans = [
  {
    name: 'Free',
    icon: Zap,
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the platform',
    features: [
      '5 prompt executions/day',
      'Browse all prompts',
      'Basic execution speed',
      'Community support',
      'Access to free prompts'
    ],
    cta: 'Get Started',
    popular: false,
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '$20',
    period: '/month',
    description: 'For professionals and power users',
    features: [
      'Unlimited executions',
      'Priority execution speed',
      'Access all premium prompts',
      'Save execution history',
      'Priority support',
      'API access',
      'Custom workflows'
    ],
    cta: 'Start Free Trial',
    popular: true,
    gradient: 'from-purple-500 to-blue-500'
  },
  {
    name: 'Seller',
    icon: Rocket,
    price: '20%',
    period: 'commission',
    description: 'Start earning from your prompts',
    features: [
      'Sell unlimited prompts',
      'Set your own pricing',
      'Real-time analytics',
      'Monthly payouts',
      'Featured listings',
      'Seller dashboard',
      'Marketing support'
    ],
    cta: 'Become a Seller',
    popular: false,
    gradient: 'from-green-500 to-emerald-500'
  }
]

export default function PricingSection() {
  return (
    <div className="mb-12 sm:mb-16 px-4 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
          Choose the plan that works for you
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon
          return (
            <div
              key={index}
              className={`relative p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? 'border-purple-500/50 shadow-purple-500/20 scale-105'
                  : 'border-white/10 hover:border-purple-500/30 hover:shadow-purple-500/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl mb-4`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60 ml-2">{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full text-base py-6 rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm">
          All plans include secure payments via Stripe • Cancel anytime • No hidden fees
        </p>
      </div>
    </div>
  )
}
