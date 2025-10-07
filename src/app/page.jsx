'use client'

import { Suspense, useState, lazy } from 'react'
import LoadingSpinner from '@/main/components/loaders/LoadingSpinner'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'
import InlineSpinner from '@/main/components/loaders/InlineSpinner'
import { Button } from '@/main/components/ui/button'
import { FileText, Share, Zap, Sparkles, Users, ArrowRight, ShoppingBag, Rocket, TrendingUp, Code, Lightbulb, DollarSign } from 'lucide-react'
import { useAuth } from '@/main/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Footer from '@/main/components/footer/fotter'
import PromptCategories from '@/main/components/landing/PromptCategories'
import Testimonials from '@/main/components/landing/Testimonials'
import PricingSection from '@/main/components/landing/PricingSection'

// Create a delayed component to test skeleton loader
const DelayedHomeContent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ default: ActualHomeContent })
    }, 3000) // 3 second delay
  })
})

function ActualHomeContent() {
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [showInline, setShowInline] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleStartCreating = () => {
    router.push('/')
  }

  const handleSignIn = () => {
    router.push('/account/login')
  }

  const testFullScreenLoader = () => {
    setShowFullScreen(true)
    setTimeout(() => setShowFullScreen(false), 5000)
  }

  const testInlineLoader = () => {
    setShowInline(true)
    setTimeout(() => setShowInline(false), 3000)
  }

  if (showFullScreen) {
    return (
      <LoadingSpinner 
        fullScreen={true} 
        text="Testing Full Screen Loader" 
        animationType="particles"
        tips={["This is a full-screen loader", "With animated particles", "And helpful tips"]}
      />
    )
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mr-2" />
              <span className="text-white/80 text-xs sm:text-sm">Premium AI Prompts Marketplace</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
            Premium Prompts,<br />Instant Results
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Buy, sell, and execute AI prompts in one platform. Get results in zepto seconds with our built-in execution engine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Button 
              size="lg" 
              onClick={handleStartCreating}
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 rounded-2xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Browse Prompts
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleSignIn}
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 rounded-2xl backdrop-blur-sm transition-all duration-300"
              >
                Start Selling
              </Button>
            )}
          </div>
          
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-4 sm:px-0">
          <div className="text-center p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-purple-500/30">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Instant Execution</h3>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Buy and execute prompts in one click. No copy-paste needed. Get results in zepto seconds.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-green-500/30">
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Premium Marketplace</h3>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Discover curated, high-quality prompts for marketing, coding, writing, and more.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-yellow-500/30">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Monetize Your Skills</h3>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Sell your best prompts and earn. Join thousands of prompt engineers making money.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12 sm:mb-16 px-4 sm:px-0">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              Three simple steps to get AI-powered results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <Lightbulb className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Browse & Discover</h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                Explore our curated marketplace of premium prompts across categories like marketing, coding, and creative writing.
              </p>
            </div>
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Buy & Execute</h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                Purchase prompts starting at $5. Execute them instantly with our built-in AI engine—no copy-paste required.
              </p>
            </div>
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <Rocket className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Get Results</h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                Receive high-quality AI outputs in seconds. Save, refine, and use them in your projects immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4 sm:px-0">
          <div className="text-center p-4 sm:p-6 bg-gradient-to-b from-white/5 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <p className="text-xs sm:text-sm text-white/70">Premium Prompts</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-gradient-to-b from-white/5 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
              5K+
            </div>
            <p className="text-xs sm:text-sm text-white/70">Active Sellers</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-gradient-to-b from-white/5 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent mb-2">
              &lt;2s
            </div>
            <p className="text-xs sm:text-sm text-white/70">Avg. Execution Time</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-gradient-to-b from-white/5 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <p className="text-xs sm:text-sm text-white/70">Satisfaction Rate</p>
          </div>
        </div>

        {/* Categories Section */}
        <PromptCategories />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Pricing Section */}
        {/* <PricingSection /> */}

        {/* CTA */}
        <div className="text-center bg-gradient-to-b from-white/10 via-purple-900/20 to-white/10 backdrop-blur-2xl border border-purple-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/20 p-6 sm:p-8 lg:p-12 mx-4 sm:mx-0">
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 backdrop-blur-sm mb-3 sm:mb-4">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 mr-2" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">Join the marketplace</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-sm sm:max-w-xl mx-auto leading-relaxed px-4 sm:px-0">
            Join thousands of creators and businesses using ZepToGPT to supercharge their AI workflows.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button 
              size="lg"
              onClick={handleStartCreating}
              className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 rounded-2xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 max-w-xs sm:max-w-none"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Explore Marketplace
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={handleSignIn}
              className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 rounded-2xl backdrop-blur-sm transition-all duration-300 max-w-xs sm:max-w-none"
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start Selling
            </Button>
          </div>
        </div>
      </div>
    </div>
    {/* <Footer/> */}
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<SkeletonLoader variant="canvas" count={8} />}>
      <DelayedHomeContent />
    </Suspense>
  )
}

