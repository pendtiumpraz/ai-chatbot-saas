import FloatingNavbar from '@/components/public/FloatingNavbar';
import Link from 'next/link';

export default function CoursesPage() {
  // Mock courses data
  const courses = [
    {
      id: '1',
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      price: 'Free',
      level: 'Beginner',
      duration: '4 weeks',
      students: 1234,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Advanced React & Next.js',
      description: 'Master modern React and Next.js development',
      price: 'Rp 499,000',
      level: 'Advanced',
      duration: '8 weeks',
      students: 856,
      rating: 4.9,
    },
    {
      id: '3',
      title: 'UI/UX Design Principles',
      description: 'Create beautiful and user-friendly interfaces',
      price: 'Rp 399,000',
      level: 'Intermediate',
      duration: '6 weeks',
      students: 672,
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <FloatingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover a wide range of courses designed to help you achieve your learning goals
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            All Courses
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            Development
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            Design
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            Business
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-medium hover:shadow-hard transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-400" />

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {course.level}
                  </span>
                  <span className="text-sm text-gray-500">{course.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {course.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <span>⭐</span>
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{course.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{course.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
