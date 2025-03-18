// frontend/src/components/api-tester/HistoryPanel.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Clock, ArrowRight } from 'lucide-react';
import { HistoryItem } from '@/types/apiTester';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoadRequest: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryPanel = ({ history, onLoadRequest, onClearHistory }: HistoryPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Filter history based on search term
  const filteredHistory = history.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.url.toLowerCase().includes(searchLower) ||
      item.method.toLowerCase().includes(searchLower)
    );
  });

  // Get method badge color
  const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-500';
      case 'POST':
        return 'bg-green-500';
      case 'PUT':
        return 'bg-yellow-500';
      case 'DELETE':
        return 'bg-red-500';
      case 'PATCH':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status badge color
  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-blue-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="p-4 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Request History</h3>
        <Button variant="outline" size="sm" onClick={onClearHistory} className="text-gray-500">
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search requests"
          className="pl-8"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Clock className="h-8 w-8 mb-2" />
            <p className="text-center">
              {history.length === 0 ? 'No request history yet' : 'No matching requests found'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map(item => (
              <div
                key={item.id}
                className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onLoadRequest(item)}
              >
                <div className="flex justify-between items-start mb-1">
                  <Badge className={`${getMethodColor(item.method)} text-white`}>
                    {item.method}
                  </Badge>
                  {item.response && (
                    <Badge className={`${getStatusColor(item.response.status)}`}>
                      {item.response.status}
                    </Badge>
                  )}
                </div>
                <div className="mb-1 truncate text-sm font-medium">{item.url}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
