import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, InfoIcon } from 'lucide-react';
import { ApiRequest, HttpMethod } from '@/types/apiTester';

interface RequestFormProps {
  request: ApiRequest;
  setRequest: React.Dispatch<React.SetStateAction<ApiRequest>>;
  isLoading: boolean;
}

const HttpMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

const RequestForm = ({ request, setRequest, isLoading }: RequestFormProps) => {
  const [activeTab, setActiveTab] = useState('params');
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  const [bodyFormat, setBodyFormat] = useState<'json' | 'text' | 'form'>('json');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequest(prev => ({ ...prev, url: e.target.value }));
  };

  // Handle method change
  const handleMethodChange = (value: string) => {
    setRequest(prev => ({ ...prev, method: value as HttpMethod }));
  };

  // Add new header
  const addHeader = () => {
    if (!newHeaderKey.trim()) return;

    const headers = { ...request.headers };
    headers[newHeaderKey] = newHeaderValue;

    setRequest(prev => ({ ...prev, headers }));
    setNewHeaderKey('');
    setNewHeaderValue('');
  };

  // Remove header
  const removeHeader = (key: string) => {
    const headers = { ...request.headers };
    delete headers[key];

    setRequest(prev => ({ ...prev, headers }));
  };

  // Add new parameter
  const addParam = () => {
    if (!newParamKey.trim()) return;

    const params = { ...request.params };
    params[newParamKey] = newParamValue;

    setRequest(prev => ({ ...prev, params }));
    setNewParamKey('');
    setNewParamValue('');
  };

  // Remove parameter
  const removeParam = (key: string) => {
    const params = { ...request.params };
    delete params[key];

    setRequest(prev => ({ ...prev, params }));
  };

  // Handle body change
  const handleBodyChange = (value: string) => {
    setJsonError(null);

    if (bodyFormat === 'json') {
      try {
        // Try to parse as JSON
        if (value.trim()) {
          const jsonObj = JSON.parse(value);
          setRequest(prev => ({ ...prev, body: jsonObj }));
        } else {
          setRequest(prev => ({ ...prev, body: null }));
        }
      } catch (error) {
        setJsonError('Invalid JSON format');
        setRequest(prev => ({ ...prev, body: value }));
      }
    } else {
      setRequest(prev => ({ ...prev, body: value }));
    }
  };

  // Format JSON
  const formatJson = () => {
    if (typeof request.body === 'string') {
      try {
        const parsed = JSON.parse(request.body);
        const formatted = JSON.stringify(parsed, null, 2);
        setRequest(prev => ({ ...prev, body: parsed }));
        return formatted;
      } catch (e) {
        return request.body;
      }
    } else if (request.body) {
      return JSON.stringify(request.body, null, 2);
    }
    return '';
  };

  // Get body content based on format
  const getBodyContent = () => {
    if (bodyFormat === 'json') {
      return formatJson();
    }
    return typeof request.body === 'string'
      ? request.body
      : request.body
        ? JSON.stringify(request.body)
        : '';
  };

  return (
    <div className="space-y-6">
      {/* URL and Method */}
      <div className="flex gap-3">
        <div className="w-32">
          <Label htmlFor="method">Method</Label>
          <Select value={request.method} onValueChange={handleMethodChange} disabled={isLoading}>
            <SelectTrigger id="method" className="w-full">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {HttpMethods.map(method => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="https://api.example.com/endpoint"
            value={request.url}
            onChange={handleUrlChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Tabs for Parameters, Headers, Body */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="params">Query Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        {/* Parameters Tab */}
        <TabsContent value="params" className="border rounded-md p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="param-key">Key</Label>
                <Input
                  id="param-key"
                  placeholder="parameter name"
                  value={newParamKey}
                  onChange={e => setNewParamKey(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="param-value">Value</Label>
                <Input
                  id="param-value"
                  placeholder="value"
                  value={newParamValue}
                  onChange={e => setNewParamValue(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={addParam}
                  disabled={isLoading || !newParamKey.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Params List */}
            <div className="space-y-2">
              {Object.entries(request.params || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 border rounded-md p-2">
                  <div className="flex-1 font-medium text-sm">{key}</div>
                  <div className="flex-1 text-sm truncate">{value}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParam(key)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
              {Object.keys(request.params || {}).length === 0 && (
                <div className="text-sm text-gray-500 italic text-center py-2">
                  No query parameters added
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Headers Tab */}
        <TabsContent value="headers" className="border rounded-md p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="header-key">Key</Label>
                <Input
                  id="header-key"
                  placeholder="Content-Type"
                  value={newHeaderKey}
                  onChange={e => setNewHeaderKey(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="header-value">Value</Label>
                <Input
                  id="header-value"
                  placeholder="application/json"
                  value={newHeaderValue}
                  onChange={e => setNewHeaderValue(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={addHeader}
                  disabled={isLoading || !newHeaderKey.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Headers List */}
            <div className="space-y-2">
              {Object.entries(request.headers || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 border rounded-md p-2">
                  <div className="flex-1 font-medium text-sm">{key}</div>
                  <div className="flex-1 text-sm truncate">{value}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(key)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
              {Object.keys(request.headers || {}).length === 0 && (
                <div className="text-sm text-gray-500 italic text-center py-2">
                  No headers added
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Body Tab */}
        <TabsContent value="body" className="border rounded-md p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={bodyFormat === 'json' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBodyFormat('json')}
                  disabled={isLoading}
                >
                  JSON
                </Button>
                <Button
                  variant={bodyFormat === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBodyFormat('text')}
                  disabled={isLoading}
                >
                  Text
                </Button>
                <Button
                  variant={bodyFormat === 'form' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBodyFormat('form')}
                  disabled={isLoading || true} // Form format not implemented yet
                >
                  Form (Soon)
                </Button>
              </div>
              {bodyFormat === 'json' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBodyChange(formatJson())}
                  disabled={isLoading}
                >
                  Format
                </Button>
              )}
            </div>

            {/* If method doesn't have a body, show a message */}
            {['GET', 'HEAD'].includes(request.method) ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="flex flex-col items-center">
                  <InfoIcon className="h-8 w-8 mb-2" />
                  <p>The {request.method} method typically doesn't include a request body.</p>
                </div>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder={bodyFormat === 'json' ? '{\n  "key": "value"\n}' : 'Request body...'}
                  className="min-h-[200px] font-mono"
                  value={getBodyContent()}
                  onChange={e => handleBodyChange(e.target.value)}
                  disabled={isLoading}
                />
                {jsonError && <p className="text-sm text-red-500">{jsonError}</p>}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestForm;
