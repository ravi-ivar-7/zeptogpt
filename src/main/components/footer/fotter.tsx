'use client'
import React from 'react';
import { Instagram, Twitter, Youtube, Github, Zap, Heart, Users, TrendingUp, ArrowRight, Sparkles, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-zinc-950 text-white relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-600/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-violet-600/7 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-10 sm:py-14">
          {/* Top Section - Brand & Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 sm:mb-14">
            {/* Brand Section */}
            <div className="space-y-5">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4 rounded-2xl shadow-2xl">
                  <Zap className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight">OpenModel Studio</h3>
                  <p className="text-white/60 text-lg font-medium">Personalized AI Creation Platform</p>
                </div>
              </div>
              
              <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-lg">
                Create stunning, personalized images and videos from just 10–20 of your own photos or clips — or use professionally crafted prebuilt models.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span className="text-2xl sm:text-3xl font-black text-white">50K+</span>
                  </div>
                  <p className="text-white/60 font-semibold">Active Creators</p>
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    <span className="text-2xl sm:text-3xl font-black text-white">1M+</span>
                  </div>
                  <p className="text-white/60 font-semibold">Models Trained</p>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-5 sm:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <h4 className="text-2xl sm:text-3xl font-black text-white">Stay Updated</h4>
              </div>
              
              <p className="text-white/70 text-lg mb-5 leading-relaxed">
                Get the latest AI models, features, and creator spotlights delivered to your inbox.
              </p>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-lg"
                  />
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 justify-center">
                    <span>Subscribe</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-white/50 text-sm">
                  Join 50,000+ creators. No spam, unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-14">
            {/* Product */}
            <div>
              <h4 className="text-xl sm:text-2xl font-black mb-3 text-yellow-400 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Product</span>
              </h4>
              <ul className="space-y-2">
                {[
                  "Prebuilt Models",
                  "Upload Your Style", 
                  "Real-time Generation",
                  "API Access"
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors text-base sm:text-lg hover:text-yellow-400 flex items-center space-x-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Use Cases */}
            <div>
              <h4 className="text-xl sm:text-2xl font-black mb-3 text-purple-400 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Use Cases</span>
              </h4>
              <ul className="space-y-2">
                {[
                  "Portraits",
                  "Stylized Reels",
                  "Custom Avatars",
                  "Brand Assets",
                  "Experimental Art"
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors text-base sm:text-lg hover:text-purple-400 flex items-center space-x-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Learn */}
            <div>
              <h4 className="text-xl sm:text-2xl font-black mb-3 text-cyan-400 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Learn</span>
              </h4>
              <ul className="space-y-2">
                {[
                  "Getting Started",
                  "How It Works",
                  "LoRA Guide",
                  "Tutorials"
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors text-base sm:text-lg hover:text-cyan-400 flex items-center space-x-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-xl sm:text-2xl font-black mb-3 text-pink-400 flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Company</span>
              </h4>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Blog",
                  "Careers",
                  "Contact"
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors text-base sm:text-lg hover:text-pink-400 flex items-center space-x-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 mb-10 sm:mb-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-2xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-lg">Email Us</h5>
                  <p className="text-white/60">hello@openmodel.studio</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-2xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-lg">Support</h5>
                  <p className="text-white/60">24/7 Creator Support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-lg">Location</h5>
                  <p className="text-white/60">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar - FIXED RESPONSIVE LAYOUT */}
        <div className="border-t border-white/10 bg-gradient-to-r from-black/50 via-gray-900/50 to-black/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6">
            {/* Mobile Layout (Stacked) */}
            <div className="flex flex-col space-y-4 lg:hidden">
              {/* Copyright */}
              <div className="text-center">
                <p className="text-white/50 text-sm sm:text-base mb-1">
                  © 2025 OpenModel Studio. All rights reserved.
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-white/40 text-sm">Built with</span>
                  <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                  <span className="text-white/40 text-sm">for creators</span>
                </div>
              </div>
              
              {/* Social Icons */}
              <div className="flex justify-center space-x-3">
                <a href="#" className="group bg-gradient-to-r from-pink-600/20 to-purple-700/20 backdrop-blur-xl border border-pink-500/30 p-2 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25">
                  <Instagram className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />
                </a>
                <a href="#" className="group bg-gradient-to-r from-blue-600/20 to-cyan-700/20 backdrop-blur-xl border border-blue-500/30 p-2 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                  <Twitter className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                </a>
                <a href="#" className="group bg-gradient-to-r from-gray-700/20 to-gray-800/20 backdrop-blur-xl border border-gray-500/30 p-2 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-gray-500/25">
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
                </a>
                <a href="#" className="group bg-gradient-to-r from-red-600/20 to-pink-700/20 backdrop-blur-xl border border-red-500/30 p-2 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                  <Youtube className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                </a>
              </div>
              
              {/* Legal Links */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm sm:text-base hover:text-purple-400">
                  Privacy Policy
                </a>
                <span className="text-white/30 hidden sm:inline">•</span>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm sm:text-base hover:text-purple-400">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Desktop Layout (Three Columns) */}
            <div className="hidden lg:flex items-center justify-between">
              {/* Left - Copyright */}
              <div className="flex flex-col xl:flex-row items-start xl:items-center space-y-1 xl:space-y-0 xl:space-x-3">
                <p className="text-white/50 text-base">
                  © 2025 OpenModel Studio. All rights reserved.
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-white/40 text-sm">Built with</span>
                  <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                  <span className="text-white/40 text-sm">for creators</span>
                </div>
              </div>
              
              {/* Center - Social Icons */}
              <div className="flex space-x-3">
                <a href="#" className="group bg-gradient-to-r from-pink-600/20 to-purple-700/20 backdrop-blur-xl border border-pink-500/30 p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25">
                  <Instagram className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />
                </a>
                <a href="#" className="group bg-gradient-to-r from-blue-600/20 to-cyan-700/20 backdrop-blur-xl border border-blue-500/30 p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                  <Twitter className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                </a>
                <a href="#" className="group bg-gradient-to-r from-gray-700/20 to-gray-800/20 backdrop-blur-xl border border-gray-500/30 p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-gray-500/25">
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
                </a>
                <a href="#" className="group bg-gradient-to-r from-red-600/20 to-pink-700/20 backdrop-blur-xl border border-red-500/30 p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                  <Youtube className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                </a>
              </div>
              
              {/* Right - Legal Links */}
              <div className="flex items-center space-x-5">
                <a href="#" className="text-white/60 hover:text-white transition-colors text-base hover:text-purple-400">
                  Privacy Policy
                </a>
                <span className="text-white/30">•</span>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-base hover:text-purple-400">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}