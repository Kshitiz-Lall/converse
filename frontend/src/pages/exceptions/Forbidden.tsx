// src/pages/exceptions/Forbidden.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative rounded-full bg-orange-100 p-4">
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          403
        </h1>

        <p className="mt-2 text-base font-semibold text-orange-600">Access Forbidden</p>

        <p className="mt-4 text-gray-500">
          Sorry, you don't have permission to access this page. If you believe this is an error,
          please contact support.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">Return home</Link>
          </Button>

          <Button asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
