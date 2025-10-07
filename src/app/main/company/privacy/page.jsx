'use client'

import React, { Suspense } from 'react';
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader';

function PrivacyContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900">
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/60 mb-2">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-white/60">{process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="text-white/80 leading-relaxed space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                At {process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}, we collect information that you provide directly to us when you create an account, use our services, or communicate with us. This includes personal information such as your name, email address, and any profile information you choose to provide. We also automatically collect certain information about your device and how you interact with our platform, including your IP address, browser type, operating system, referring URLs, access times, and pages viewed.
              </p>
              <p>
                Additionally, we use cookies and similar tracking technologies to collect information about your browsing activities and preferences to enhance your user experience and provide personalized content. When you use our AI-powered features, we may collect and process the content you input, generate, or interact with to provide our services and improve our algorithms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services and Data Sharing</h2>
              <p className="mb-4">
                {process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'} integrates with various third-party services to provide our comprehensive AI platform. We may share your information with trusted service providers who assist us in operating our platform, processing payments, providing customer support, and analyzing platform usage. These third parties include cloud infrastructure providers, AI model providers, authentication services, and analytics platforms.
              </p>
              <p>
                All third-party service providers are contractually bound to protect your information and use it only for the specific purposes for which it was shared. We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may disclose your information if required by law, legal process, or government request, or if we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or the public. In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to the same privacy protections outlined in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We may also retain certain information as required by law or for legitimate business purposes, such as fraud prevention and ensuring the security of our platform. When we no longer need your personal information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will update the effective date at the top of this policy and notify you through our platform or via email if the changes are material. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
              <p className="mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-white font-medium">{process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</p>
                <p className="text-white/80">Email: <a href="mailto:contact@{(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/^https?:\/\//, '')}" className="text-cyan-400 hover:text-cyan-300">contact@{(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/^https?:\/\//, '')}</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
      
    </div>
  );
}

export default function Privacy() {
  return (
    <Suspense fallback={<SkeletonLoader variant="list" count={8} />}>
      <PrivacyContent />
    </Suspense>
  );
}
