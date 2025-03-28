// frontend/src/pages/ApiRequestTesterPage.tsx
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Folder, History, Home, RefreshCw, Save, Send, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import components
import CollectionsPanel from '@/components/api-tester/CollectionsPanel';
import EnvironmentsPanel from '@/components/api-tester/EnvironmentsPanel';
import HistoryPanel from '@/components/api-tester/HistoryPanel';
import RequestForm from '@/components/api-tester/RequestForm';
import ResponseViewer from '@/components/api-tester/ResponseViewer';

// Types
import { ApiRequest, ApiResponse, Collection, Environment, HistoryItem } from '@/types/apiTester';

// API Services
import { clearHistory, executeRequest, getHistory } from '@/services/apiTesterService';

export default function ApiRequestTesterPage() {
  // Main states
  const [request, setRequest] = useState<ApiRequest>({
    url: '',
    method: 'GET',
    headers: {},
    params: {},
    body: null,
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sidebar states
  const [activeTab, setActiveTab] = useState<string>('request');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [collections] = useState<Collection[]>([]);
  const [environments] = useState<Environment[]>([]);
  const [activeEnvironment] = useState<Environment | null>(null);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Execute API request
  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await executeRequest(request);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during request execution');
    } finally {
      setIsLoading(false);
      // Refresh history after request
      fetchHistory();
    }
  };

  // Fetch history
  const fetchHistory = async () => {
    try {
      const historyItems = await getHistory();
      setHistory(historyItems);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  // Clear history
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  // Load request from history
  const loadFromHistory = (historyItem: HistoryItem) => {
    setRequest({
      url: historyItem.url,
      method: historyItem.method,
      headers: historyItem.headers || {},
      params: historyItem.params || {},
      body: historyItem.body || null,
    });

    // Switch to request tab
    setActiveTab('request');
  };

  // Reset request
  const resetRequest = () => {
    setRequest({
      url: '',
      method: 'GET',
      headers: {},
      params: {},
      body: null,
    });
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/dashboard"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">API Request Tester</h1>
          <Link
            to="/api-tester/docs"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <span>Documentation</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="p-0">
                <div className="bg-white rounded-lg shadow-md p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Request</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetRequest}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        onClick={handleExecuteRequest}
                        disabled={isLoading || !request.url}
                        className="bg-primary"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <RequestForm request={request} setRequest={setRequest} isLoading={isLoading} />
                </div>
              </TabsContent>

              <TabsContent value="response" className="p-0">
                <div className="bg-white rounded-lg shadow-md p-5 min-h-[600px]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Response</h2>
                    {response && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            /* TODO: Copy response */
                          }}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            /* TODO: Save response */
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>

                  <ResponseViewer response={response} error={error} isLoading={isLoading} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white rounded-lg shadow-md">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="collections">
                  <Folder className="h-4 w-4 mr-2" />
                  Collections
                </TabsTrigger>
                <TabsTrigger value="environments">
                  <Settings className="h-4 w-4 mr-2" />
                  Env
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="p-0">
                <HistoryPanel
                  history={history}
                  onLoadRequest={loadFromHistory}
                  onClearHistory={handleClearHistory}
                />
              </TabsContent>

              <TabsContent value="collections" className="p-0">
                <CollectionsPanel collections={collections} onLoadRequest={loadFromHistory} />
              </TabsContent>

              <TabsContent value="environments" className="p-0">
                <EnvironmentsPanel
                  environments={environments}
                  activeEnvironment={activeEnvironment}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
