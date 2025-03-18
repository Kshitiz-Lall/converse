// frontend/src/components/api-tester/ResponseViewer.tsx
import { useState } from 'react';
import { ApiResponse } from '@/types/apiTester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResponseViewerProps {
  response: ApiResponse | null;
  error: string | null;
  isLoading: boolean;
}

const ResponseViewer = ({ response, error, isLoading }: ResponseViewerProps) => {
  const [activeTab, setActiveTab] = useState('body');
  const [copied, setCopied] = useState(false);

  // Format JSON for display
  const formatJson = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return typeof data === 'string' ? data : String(data);
    }
  };

  // Copy response to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Copy current tab content
  const handleCopy = () => {
    if (!response) return;

    if (activeTab === 'body') {
      copyToClipboard(formatJson(response.data));
    } else if (activeTab === 'headers') {
      const headerText = Object.entries(response.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      copyToClipboard(headerText);
    }
  };

  // Download response as JSON
  const handleDownload = () => {
    if (!response) return;

    const content =
      activeTab === 'body'
        ? JSON.stringify(response.data, null, 2)
        : JSON.stringify(response.headers, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'body' ? 'response-body.json' : 'response-headers.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Determine status color
  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-blue-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Request Error</h3>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  // No response yet
  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <p className="text-xl mb-2">No Response Yet</p>
          <p>Send a request to see the response here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status and Info Bar */}
      <div className="flex justify-between items-center border rounded-md p-3 bg-gray-50">
        <div className="flex items-center space-x-4">
          <Badge className={`${getStatusColor(response.status)} text-white`}>
            {response.status} {response.statusText}
          </Badge>
          <span className="text-sm">
            Time: <span className="font-semibold">{response.responseTime}ms</span>
          </span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm text-green-600">Request Successful</span>
        </div>
      </div>

      {/* Response Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                'Copied!'
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>

        {/* Body Tab */}
        <TabsContent value="body" className="p-0">
          <div className="border rounded-md p-4 bg-gray-50 overflow-auto max-h-[400px]">
            <pre className="font-mono text-sm whitespace-pre-wrap">{formatJson(response.data)}</pre>
          </div>
        </TabsContent>

        {/* Headers Tab */}
        <TabsContent value="headers" className="p-0">
          <div className="border rounded-md p-4 bg-gray-50 overflow-auto max-h-[400px]">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-sm pb-2">Name</th>
                  <th className="text-left font-semibold text-sm pb-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.headers).map(([key, value]) => (
                  <tr key={key} className="border-t">
                    <td className="py-2 pr-4 font-mono text-sm font-medium">{key}</td>
                    <td className="py-2 font-mono text-sm break-all">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseViewer;
