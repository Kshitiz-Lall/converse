// src/pages/exceptions/Maintenance.tsx
import { Button } from '@/components/ui/button';
import { Wrench, RefreshCw } from 'lucide-react';

export default function Maintenance() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative rounded-full bg-blue-100 p-4">
            <Wrench className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Under Maintenance
        </h1>

        <p className="mt-2 text-base font-semibold text-blue-600">We'll be back soon</p>

        <p className="mt-4 text-gray-500">
          We're currently performing scheduled maintenance to improve our services. Please check
          back in a little while.
        </p>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500">
            Estimated completion time: <span className="font-medium">30 minutes</span>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Check again
          </Button>
        </div>
      </div>
    </div>
  );
}
