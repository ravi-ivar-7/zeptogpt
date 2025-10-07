'use client'

import React, { Suspense } from 'react';
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader';

function TermsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-white/60 mb-2">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-white/60">{process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</p>
        </div>

        {/* Document Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-white/80 leading-relaxed space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using ZepToGPT's marketplace and prompt execution services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services. We reserve the right to update these terms at any time without prior notice. Your continued use of our services following the posting of changes constitutes acceptance of those changes.
              </p>
              <p>
                You must be at least 18 years old to use our services, or have parental consent if you are between 13 and 18 years old. By using our services, you represent and warrant that you meet these age requirements and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="mb-4">
                ZepToGPT provides an AI prompt marketplace where users can buy, sell, and execute premium prompts. Our platform includes prompt browsing, secure payment processing via Stripe, instant prompt execution across multiple AI models (GPT-4, Claude, Gemini), seller tools, and API access for developers.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, with or without notice. Service availability may vary by geographic region and is subject to technical limitations, maintenance requirements, and other factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities and Conduct</h2>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality and security of your account credentials, including your username and password. You agree to notify us immediately of any unauthorized use of your account or any other breach of security. You are fully responsible for all activities that occur under your account.
              </p>
              <p>
                You agree not to use our services for any unlawful, harmful, or unauthorized purposes. This includes, but is not limited to, creating content that violates intellectual property rights, generating harmful or offensive material, engaging in harassment or spam, or attempting to circumvent our security measures or usage limitations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property Rights</h2>
              <p className="mb-4">
                Sellers retain ownership of the prompts they create and upload to our marketplace. Buyers receive a license to use purchased prompts for their personal or commercial projects. We retain all rights, title, and interest in our platform, software, execution engine, and proprietary technologies. Our services, including all content, features, and functionality, are owned by ZepToGPT and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                By selling prompts on our marketplace, you grant us a worldwide, non-exclusive, royalty-free license to display, execute, and distribute your prompts to buyers. You represent and warrant that you have all necessary rights to sell your prompts and that they do not infringe upon the intellectual property rights of any third party. Plagiarism or copyright infringement will result in immediate account termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Prohibited Uses</h2>
              <p className="mb-4">
                You may not upload, sell, or execute prompts that are illegal, harmful, threatening, abusive, defamatory, vulgar, obscene, or otherwise objectionable. You may not plagiarize prompts from other sources or infringe upon the intellectual property rights of others. Sellers may not misrepresent the quality or capabilities of their prompts.
              </p>
              <p>
                Additionally, you may not attempt to gain unauthorized access to our systems, interfere with the proper functioning of our services, use automated means to access our services without permission, or engage in any activity that could damage, disable, or impair our infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p className="mb-4">
                Our services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p>
                To the fullest extent permitted by law, ZepToGPT shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our marketplace or execution services. Our total liability to you for all claims shall not exceed the amount you paid us for our services in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service. Upon termination, your right to use our services will cease immediately, and we may delete your account and all associated data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which ZepToGPT operates, without regard to conflict of law principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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

export default function Terms() {
  return (
    <Suspense fallback={<SkeletonLoader variant="list" count={8} />}>
      <TermsContent />
    </Suspense>
  );
}

