'use client'

import React, { Suspense } from 'react';
import { Zap, Target, Users, Lightbulb, Heart, Rocket } from 'lucide-react';
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader';

const aboutSections = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Our Mission",
    content: [
      "Democratize access to premium AI prompts for everyone",
      "Empower prompt engineers to monetize their expertise",
      "Deliver instant AI results without the copy-paste hassle",
      "Build the fastest AI prompt execution platform in the world"
    ]
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "What We Offer",
    content: [
      "10,000+ curated premium prompts across all categories",
      "One-click execution with sub-2 second response times",
      "Multi-model support: GPT-4, Claude, Gemini, and more",
      "Fair marketplace for creators to earn from their prompts"
    ]
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Our Community",
    content: [
      "5,000+ active prompt engineers and sellers",
      "50,000+ satisfied users across 100+ countries",
      "98% satisfaction rate with our execution engine",
      "Growing ecosystem of AI enthusiasts and professionals"
    ]
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Why ZepToGPT?",
    content: [
      "Instant execution - no more copy-pasting prompts",
      "Quality curation - only the best prompts make it through",
      "Fair pricing - transparent fees and creator earnings",
      "Lightning fast - zepto-second execution speeds"
    ]
  }
];

function AboutContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-xl border border-cyan-500/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <Heart className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-xs sm:text-sm">About Us</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight">
            About ZepToGPT
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              The Future of AI Prompts
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto">
            We're building the world's fastest AI prompt marketplace. Buy premium prompts, execute them instantly, and get results in zepto seconds.
          </p>
        </div>

        {/* About Sections */}
        <div className="space-y-6 sm:space-y-8">
          {aboutSections.map((section, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-cyan-600/20 p-3 rounded-xl flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-3">{section.title}</h2>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-white/70 text-sm sm:text-base leading-relaxed flex items-start">
                        <span className="text-cyan-400 mr-2 mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-3">Join Our Marketplace</h2>
          <p className="text-white/70 text-sm sm:text-base mb-4">
            Ready to buy premium prompts or start selling your own? Join thousands of creators and users today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 text-sm"
            >
              <span>Browse Prompts</span>
            </a>
            <a 
              href="/company/contact"
              className="inline-flex items-center justify-center space-x-2 bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm"
            >
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <Suspense fallback={<SkeletonLoader variant="card" count={6} />}>
      <AboutContent />
    </Suspense>
  );
}
