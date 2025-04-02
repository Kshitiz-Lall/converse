import { apiCollections, apiEnvironments } from '@/services/ApiTesting';
import { resolveEnvVariables } from '@/lib/resolveEnv';
import { clearHistory, executeRequest, getHistory } from '@/services/testServiceApi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ApiRequest, ApiResponse, Collection, Environment, HistoryItem } from '@/types/apiTester';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Folder, History, Home, RefreshCw, Send, Settings } from 'lucide-react';

import CollectionsPanel from '@/components/api-tester/CollectionsPanel';
import EnvironmentsPanel from '@/components/api-tester/EnvironmentsPanel';
import HistoryPanel from '@/components/api-tester/HistoryPanel';
import RequestForm from '@/components/api-tester/RequestForm';
import ResponseViewer from '@/components/api-tester/ResponseViewer';

export default function ApiRequestTesterPage() {
  const [request, setRequest] = useState<ApiRequest>({
    url: '',
    method: 'GET',
    headers: {},
    params: {},
    body: null,
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('request');

  const [collections, setCollections] = useState<Collection[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvironment, setActiveEnvironment] = useState<Environment | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [coll, envs, active, hist] = await Promise.all([
        apiCollections.getAll(),
        apiEnvironments.getAll(),
        apiEnvironments.getActive(),
        getHistory(),
      ]);
      setCollections(coll.data);
      setEnvironments(envs.data);
      setActiveEnvironment(active.data);
      setHistory(hist);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const resolvedRequest = {
        ...request,
        url: resolveEnvVariables(request.url, activeEnvironment?.variables || {}),
      };

      const result = await executeRequest(resolvedRequest);
      setResponse(result);
      setActiveTab('response');
      const updatedHistory = await getHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setRequest({
      url: item.url,
      method: item.method,
      headers: item.headers || {},
      params: item.params || {},
      body: item.body || null,
    });
    setActiveTab('request');
  };

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
    <div className="min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/dashboard" className="flex items-center text-primary">
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">API Request Tester</h1>
          <Link to="/api-tester/docs" className="flex items-center text-primary">
            <span>Documentation</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Panel */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>

              <TabsContent value="request">
                <div className="bg-white rounded-lg shadow p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Request</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={resetRequest} disabled={isLoading}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button onClick={handleExecuteRequest} disabled={!request.url || isLoading}>
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                            Sending...
                          </div>
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

              <TabsContent value="response">
                <div className="bg-white rounded-lg shadow p-5 min-h-[500px]">
                  <ResponseViewer response={response} error={error} isLoading={isLoading} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white rounded-lg shadow">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-1" />
                  History
                </TabsTrigger>
                <TabsTrigger value="collections">
                  <Folder className="h-4 w-4 mr-1" />
                  Collections
                </TabsTrigger>
                <TabsTrigger value="environments">
                  <Settings className="h-4 w-4 mr-1" />
                  Env
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <HistoryPanel
                  history={history}
                  onLoadRequest={loadFromHistory}
                  onClearHistory={handleClearHistory}
                />
              </TabsContent>

              <TabsContent value="collections">
                <CollectionsPanel collections={collections} onLoadRequest={loadFromHistory} />
              </TabsContent>

              <TabsContent value="environments">
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
