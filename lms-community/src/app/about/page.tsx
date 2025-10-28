import FloatingNavbar from '@/components/public/FloatingNavbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <FloatingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            About LMS Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering education through innovative technology and community-driven learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-medium">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To democratize education by providing accessible, high-quality learning
              experiences through a comprehensive learning management system that connects
              educators and learners worldwide.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-medium">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading platform that transforms traditional education by
              leveraging technology, fostering collaboration, and creating opportunities
              for lifelong learning.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 shadow-medium">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals and experienced educators
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Platform</h3>
              <p className="text-gray-600">
                Built with cutting-edge technology for seamless learning experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join a vibrant community of learners and educators
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
