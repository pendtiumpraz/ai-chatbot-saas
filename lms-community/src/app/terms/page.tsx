import FloatingNavbar from '@/components/public/FloatingNavbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <FloatingNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="bg-white rounded-2xl p-12 shadow-medium">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-8">
            Last updated: October 28, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 mb-4">
              By accessing and using LMS Community platform, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree to these terms,
              please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Use License
            </h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily access the materials (courses, information,
              or software) on LMS Community for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide accurate, complete, and
              current information. Failure to do so constitutes a breach of the Terms, which
              may result in immediate termination of your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Course Content
            </h2>
            <p className="text-gray-600 mb-4">
              All course materials, including but not limited to videos, documents, and
              assessments, are the intellectual property of LMS Community or its content
              providers. You may not reproduce, distribute, or create derivative works
              without explicit permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Payment and Refunds
            </h2>
            <p className="text-gray-600 mb-4">
              Payment for courses is processed securely through our payment partners. Refund
              requests must be submitted within 30 days of purchase and are subject to our
              refund policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. User Conduct
            </h2>
            <p className="text-gray-600 mb-4">
              You agree not to use the platform for any unlawful purpose or in any way that
              could damage, disable, overburden, or impair the platform. You shall not attempt
              to gain unauthorized access to any portion of the platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4">
              In no event shall LMS Community be liable for any damages arising out of the use
              or inability to use the materials on our platform, even if we have been notified
              of the possibility of such damage.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              8. Changes to Terms
            </h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of
              any material changes via email or through the platform. Your continued use of the
              platform after such modifications constitutes acceptance of the updated terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at
              legal@lmscommunity.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
