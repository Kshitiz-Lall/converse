// src/pages/exceptions/NotFound.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative rounded-full bg-primary/10 p-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          404
        </h1>

        <p className="mt-2 text-base font-semibold text-primary">Page not found</p>

        <p className="mt-4 text-gray-500">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back home
            </Link>
          </Button>

          <Button asChild>
            <Link to="/help">Get help</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
