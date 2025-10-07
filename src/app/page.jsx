'use client'

import { Suspense, useState } from 'react'
import LoadingSpinner from '@/main/components/loaders/LoadingSpinner'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'
import { Button } from '@/main/components/ui/button'
import { FileText, Share, Zap, Sparkles, Users, ArrowRight, ShoppingBag, Rocket, TrendingUp, Code, Lightbulb, DollarSign } from 'lucide-react'
import { useAuth } from '@/main/hooks/useAuth'
import { useRouter } from 'next/navigation'
import PromptCategories from '@/main/components/landing/PromptCategories'

function ActualHomeContent() {
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [showInline, setShowInline] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleStartCreating = () => {
    router.push('/coming-soon')
  }

  const handleSignIn = () => {
    router.push('/coming-soon')
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/25 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-[550px] h-[550px] bg-cyan-600/20 rounded-full blur-[110px] animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[90px] animate-pulse delay-3000"></div>
        {/* Premium grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,black_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pb-24 sm:pb-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="inline-flex items-center px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 backdrop-blur-xl mb-4 sm:mb-6 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 mr-2 animate-pulse" />
              <span className="font-semibold text-xs sm:text-sm bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Premium AI Workflows Marketplace</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 sm:mb-8 leading-[1.1] animate-fade-in-up tracking-tight">
            <span className="block bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Premium Workflows,
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl mt-2">
              Instant Results
            </span>
          </h1>
          <p className="text-base sm:text-2xl md:text-3xl text-white/70 mb-10 sm:mb-12 max-w-xl sm:max-w-4xl mx-auto leading-relaxed px-2 sm:px-0 font-light animate-fade-in-up delay-200">
             Get results in <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-bold">zepto seconds</span> with our built-in execution engine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 px-4 sm:px-0 animate-fade-in-up delay-300">
            <Button 
              size="lg" 
              onClick={handleStartCreating}
              className="group w-full sm:w-auto text-sm sm:text-lg font-bold px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 border-0 rounded-2xl shadow-2xl shadow-purple-500/50 transition-all duration-500 hover:shadow-purple-500/80 hover:scale-110 hover:-translate-y-1"
            >
              <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Browse Workflows
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSignIn}
              className="group w-full sm:w-auto text-sm sm:text-lg font-bold px-6 sm:px-10 py-3 sm:py-5 bg-white/5 border-2 border-white/30 text-white hover:bg-white/10 hover:border-purple-400 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            >
              <Rocket className="w-4 h-4 sm:w-6 sm:h-6 mr-2 group-hover:-translate-y-1 transition-transform duration-300" />
              Start Selling
            </Button>
          </div>
          
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-20 px-4 sm:px-0">
          <div className="group text-center p-6 sm:p-10 bg-gradient-to-br from-purple-900/30 via-black/50 to-black/50 backdrop-blur-2xl border border-purple-500/30 rounded-3xl hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 hover:-translate-y-2">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/80 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
              <Zap className="h-7 w-7 sm:h-10 sm:w-10 text-white group-hover:animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">Instant Execution</h3>
            <p className="text-sm sm:text-lg text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
              Buy and execute workflows in one click. No copy-paste needed. Get results in <span className="text-purple-400 font-semibold">zepto seconds</span>.
            </p>
          </div>

          <div className="group text-center p-6 sm:p-10 bg-gradient-to-br from-green-900/30 via-black/50 to-black/50 backdrop-blur-2xl border border-green-500/30 rounded-3xl hover:border-green-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 hover:-translate-y-2">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-green-500/50 group-hover:shadow-green-500/80 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
              <ShoppingBag className="h-7 w-7 sm:h-10 sm:w-10 text-white group-hover:animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-green-300 transition-colors duration-300">Premium Marketplace</h3>
            <p className="text-sm sm:text-lg text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
              Discover curated, high-quality workflows for marketing, coding, writing, and more.
            </p>
          </div>

          <div className="group text-center p-6 sm:p-10 bg-gradient-to-br from-yellow-900/30 via-black/50 to-black/50 backdrop-blur-2xl border border-yellow-500/30 rounded-3xl hover:border-yellow-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/30 hover:scale-105 hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-yellow-500/50 group-hover:shadow-yellow-500/80 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
              <DollarSign className="h-7 w-7 sm:h-10 sm:w-10 text-white group-hover:animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-yellow-300 transition-colors duration-300">Monetize Your Skills</h3>
            <p className="text-sm sm:text-lg text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
              Sell your best workflows and earn. Join thousands of AI creators making money.
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
                Explore our curated marketplace of premium workflows across categories like marketing, coding, and creative writing.
              </p>
            </div>
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Buy & Execute</h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                Purchase workflows starting at $5. Execute them instantly with our built-in AI engine—no copy-paste required.
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20 px-4 sm:px-0">
          <div className="group text-center p-6 sm:p-8 bg-gradient-to-br from-purple-900/40 via-black/40 to-black/40 backdrop-blur-2xl border border-purple-500/40 rounded-3xl hover:border-purple-400/70 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/40">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-500">
              10K+
            </div>
            <p className="text-sm sm:text-base text-white/80 font-semibold group-hover:text-white transition-colors duration-300">Premium Prompts</p>
          </div>
          <div className="group text-center p-6 sm:p-8 bg-gradient-to-br from-green-900/40 via-black/40 to-black/40 backdrop-blur-2xl border border-green-500/40 rounded-3xl hover:border-green-400/70 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/40">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-500">
              5K+
            </div>
            <p className="text-sm sm:text-base text-white/80 font-semibold group-hover:text-white transition-colors duration-300">Active Sellers</p>
          </div>
          <div className="group text-center p-6 sm:p-8 bg-gradient-to-br from-yellow-900/40 via-black/40 to-black/40 backdrop-blur-2xl border border-yellow-500/40 rounded-3xl hover:border-yellow-400/70 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/40">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-500">
              &lt;2s
            </div>
            <p className="text-sm sm:text-base text-white/80 font-semibold group-hover:text-white transition-colors duration-300">Execution Time</p>
          </div>
          <div className="group text-center p-6 sm:p-8 bg-gradient-to-br from-pink-900/40 via-black/40 to-black/40 backdrop-blur-2xl border border-pink-500/40 rounded-3xl hover:border-pink-400/70 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/40">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-500">
              98%
            </div>
            <p className="text-sm sm:text-base text-white/80 font-semibold group-hover:text-white transition-colors duration-300">Satisfaction</p>
          </div>
        </div>

        {/* Categories Section */}
        <PromptCategories />

        {/* CTA */}
        <div className="relative text-center bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-black/50 backdrop-blur-2xl border-2 border-purple-500/50 rounded-3xl sm:rounded-[2rem] shadow-2xl shadow-purple-500/40 p-6 sm:p-12 lg:p-16 mx-4 sm:mx-0 mb-20 sm:mb-0 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center px-5 sm:px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/40 to-blue-500/40 border-2 border-purple-400/60 backdrop-blur-xl mb-4 sm:mb-6 shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 mr-2 animate-pulse" />
                <span className="font-bold text-sm sm:text-base bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Join the marketplace</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
                Ready to Get Started?
              </span>
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 font-light">
              Join thousands of creators and businesses using <span className="text-purple-300 font-semibold">ZepToGPT</span> to supercharge their AI workflows.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <Button 
                size="lg"
                onClick={handleStartCreating}
                className="group w-full sm:w-auto text-sm sm:text-xl font-bold px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 border-0 rounded-2xl shadow-2xl shadow-purple-500/60 transition-all duration-500 hover:shadow-purple-500/90 hover:scale-110 hover:-translate-y-1 max-w-xs sm:max-w-none"
              >
                <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Explore Marketplace
                <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={handleSignIn}
                className="group w-full sm:w-auto text-sm sm:text-xl font-bold px-8 sm:px-12 py-4 sm:py-6 bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 hover:border-purple-400 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/30 max-w-xs sm:max-w-none"
              >
                <Rocket className="w-5 h-5 sm:w-7 sm:h-7 mr-2 group-hover:-translate-y-1 transition-transform duration-300" />
                Start Selling
              </Button>
            </div>
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
      <ActualHomeContent />
    </Suspense>
  )
}

