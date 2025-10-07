'use client'

import React, { Suspense } from 'react';
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader';

function RefundContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900">
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-white/60 mb-2">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-white/60">{process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</p>
        </div>

        {/* Document Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-white/80 leading-relaxed space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Refund Eligibility</h2>
              <p className="mb-4">
                We want you to be completely satisfied with {process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}. Refunds are available within 30 days of purchase for annual subscriptions only. Monthly subscriptions operate on a pay-as-you-go basis and can be cancelled at any time, but no refunds are provided for partial months already billed.
              </p>
              <p>
                Refunds are processed only for the unused portion of annual plans, calculated on a prorated basis from the date of the refund request. Free trial users are not eligible for refunds as no payment was made during the trial period. Enterprise customers may have different refund terms as specified in their individual service agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Refund Timeline and Process</h2>
              <p className="mb-4">
                All refund requests must be submitted within 30 days of the original purchase date. Once a refund request is received, our billing team will review it within 2 business days. Processing of approved refunds typically takes 5-10 business days from the date of approval.
              </p>
              <p>
                Refunds are issued to the original payment method used for the purchase. Please note that additional processing time may be required by your bank or credit card company, which can add an additional 3-5 business days to the refund timeline. You will receive email confirmation once the refund has been processed and initiated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Non-Refundable Items</h2>
              <p className="mb-4">
                Certain charges and fees are non-refundable under our policy. This includes usage-based charges for API calls, premium AI model usage, or other consumption-based features that have already been utilized. Custom enterprise setup fees, onboarding costs, and professional services are also non-refundable.
              </p>
              <p>
                Third-party service charges, including but not limited to AI model usage fees, cloud storage costs, and external API charges, cannot be refunded as these costs are passed directly to the service providers. Additionally, any purchases made more than 30 days ago and accounts terminated for violation of our terms of service are not eligible for refunds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. How to Request a Refund</h2>
              <p className="mb-4">
                To request a refund, please contact our support team at contact@zeptogpt.com with "Refund Request" in the subject line. Your request should include your account email address, the original purchase date, and a brief explanation of the reason for your refund request.
              </p>
              <p>
                Our billing team will review your request and may ask for additional information or feedback to help us improve our services. Once approved, refunds will be processed automatically to your original payment method. We appreciate your feedback as it helps us enhance our platform for all users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Subscription Cancellation</h2>
              <p className="mb-4">
                You can cancel your subscription at any time through your account settings or by contacting our support team. Cancellations take effect at the end of your current billing period, and you will retain access to all features until that date.
              </p>
              <p>
                For monthly subscriptions, no partial refunds are provided for the current billing period. Annual subscriptions cancelled within the first 30 days may be eligible for a prorated refund based on unused time. After cancellation, you can continue to use the service until the end of your paid period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Special Circumstances</h2>
              <p className="mb-4">
                We understand that exceptional circumstances may arise. Technical issues that prevent normal use of our service for extended periods may qualify for extended refund periods or service credits. Service outages exceeding 24 hours may result in automatic service credits applied to your account.
              </p>
              <p>
                Duplicate charges will be refunded immediately upon verification. Any suspected fraudulent charges should be reported to us immediately for investigation. We reserve the right to make exceptions to this policy on a case-by-case basis, particularly in situations involving technical failures or extraordinary circumstances beyond the user's control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Information</h2>
              <p className="mb-4">
                For all billing inquiries, refund requests, or questions about this policy, please contact us at:
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-white font-medium">{process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'} Billing Support</p>
                <p className="text-white/80">Email: <a href="mailto:contact@zeptogpt.com" className="text-cyan-400 hover:text-cyan-300">contact@zeptogpt.com</a></p>
                <p className="text-white/80">Subject: Refund Request (for refund inquiries)</p>
              </div>
            </section>

          </div>
        </div>
      </div>
      
    </div>
  );
}

export default function Refund() {
  return (
    <Suspense fallback={<SkeletonLoader variant="list" count={8} />}>
      <RefundContent />
    </Suspense>
  );
}
   

