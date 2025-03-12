// src/pages/exceptions/Unauthorized.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative rounded-full bg-yellow-100 p-4">
            <Lock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          401
        </h1>

        <p className="mt-2 text-base font-semibold text-yellow-600">Unauthorized</p>

        <p className="mt-4 text-gray-500">
          Sorry, you need to login to access this page. Your session may have expired or you don't
          have permission.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/login">Sign in</Link>
          </Button>

          <Button asChild>
            <Link to="/">Return home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
