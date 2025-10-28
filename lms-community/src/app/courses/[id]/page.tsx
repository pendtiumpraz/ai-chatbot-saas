import FloatingNavbar from '@/components/public/FloatingNavbar';
import Button from '@/components/shared/Button';
import Link from 'next/link';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <FloatingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="bg-white rounded-2xl p-8 shadow-medium">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Course Details
          </h1>
          <p className="text-gray-600 mb-6">
            Course ID: {params.id}
          </p>
          <Link href="/auth/signin">
            <Button variant="primary">
              Enroll Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
