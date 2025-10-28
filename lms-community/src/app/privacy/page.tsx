import FloatingNavbar from '@/components/public/FloatingNavbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <FloatingNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="bg-white rounded-2xl p-12 shadow-medium">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">
            Last updated: October 28, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              We collect information that you provide directly to us, including name, email
              address, phone number, and payment information when you register for an account,
              enroll in courses, or contact us for support.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Communicate about courses, features, and events</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell or rent your personal information to third parties. We may share
              your information with service providers who perform services on our behalf, such
              as payment processing and data analytics.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Cookies and Tracking
            </h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to track activity on our platform
              and hold certain information. You can instruct your browser to refuse all cookies
              or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-600 mb-4">
              Our services are not intended for children under 13 years of age. We do not
              knowingly collect personal information from children under 13. If you become
              aware that a child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              8. Changes to Privacy Policy
            </h2>
            <p className="text-gray-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the "Last
              updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at
              privacy@lmscommunity.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
