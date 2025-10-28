import Link from 'next/link';
import Button from '@/components/shared/Button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link href="/">
          <Button variant="primary">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
