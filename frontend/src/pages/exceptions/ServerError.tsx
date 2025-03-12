// src/pages/exceptions/ServerError.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, Server } from 'lucide-react';

export default function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative rounded-full bg-red-100 p-4">
            <Server className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          500
        </h1>

        <p className="mt-2 text-base font-semibold text-red-600">Server error</p>

        <p className="mt-4 text-gray-500">
          Sorry, something went wrong on our server. We're working on fixing the problem and will be
          back soon.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh page
          </Button>

          <Button asChild>
            <Link to="/">Return home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
