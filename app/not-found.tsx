import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
