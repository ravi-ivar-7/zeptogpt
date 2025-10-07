'use client'
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-white mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Contact Email */}
          <div className="text-sm text-gray-400">
            Contact: <a href="mailto:contact@zeptogpt.com" className="text-white hover:text-purple-400 transition-colors">contact@zeptogpt.com</a>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © 2025 ZeptoGPT. All rights reserved.
          </div>
          
       
        </div>
      </div>
    </footer>
  );
}