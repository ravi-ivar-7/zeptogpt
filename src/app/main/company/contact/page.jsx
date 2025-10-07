'use client'

import React, { Suspense } from 'react';
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader';
import { Mail, MessageCircle } from 'lucide-react';

const contactMethods = [
  {
    icon: <Mail className="w-8 h-8" />,
    title: "Email Us", 
    contact: "contact@zeptogpt.com", 
    gradient: "from-blue-600 to-cyan-600",
    action: "mailto:contact@zeptogpt.com"
  },
];

function ContactContent() {

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
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-xl border border-cyan-500/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-xs sm:text-sm">Get in Touch</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h1>
          
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Have questions? Need help? Want to partner with us? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Method */}
        <div className="max-w-2xl mx-auto">
          {contactMethods.map((method, index) => (
            <a 
              key={index} 
              href={method.action}
              className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-12 text-center hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer block"
            >
              <div className={`bg-gradient-to-r ${method.gradient} p-6 rounded-2xl inline-block mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-12 h-12 sm:w-16 sm:h-16">
                  {React.cloneElement(method.icon, { className: "w-full h-full" })}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">{method.title}</h2>
              <div className="space-y-2">
                <p className="text-cyan-400 font-semibold text-lg sm:text-xl">{method.contact}</p> 
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<SkeletonLoader variant="form" count={5} />}>
      <ContactContent />
    </Suspense>
  )
}