// frontend/src/components/api-tester/CollectionsPanel.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  createCollection,
  deleteCollection,
  exportCollection,
  getCollections,
} from '@/services/apiTesterService';
import { Collection } from '@/types/apiTester';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  File,
  Folder,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface CollectionsPanelProps {
  collections: Collection[];
  onLoadRequest: (item: any) => void;
}

const CollectionsPanel = ({
  collections: propCollections,
  onLoadRequest,
}: CollectionsPanelProps) => {
  const [collections, setCollections] = useState<Collection[]>(propCollections);
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Load collections on mount
  useEffect(() => {
    fetchCollections();
  }, []);

  // Toggle collection expansion
  const toggleCollectionExpansion = (id: string) => {
    setExpandedCollections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fetch collections
  const fetchCollections = async () => {
    try {
      const fetchedCollections = await getCollections();
      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  // Create new collection
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      await createCollection(newCollectionName, newCollectionDescription);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setIsCreateDialogOpen(false);
      fetchCollections();
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  // Delete a collection
  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      await deleteCollection(id);
      fetchCollections();
    } catch (error) {
      console.error('Failed to delete collection:', error);
    }
  };

  // Export collection
  const handleExportCollection = async (id: string) => {
    try {
      const exportedData = await exportCollection(id);

      // Create and download a file
      const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `collection-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export collection:', error);
    }
  };

  // Import collection
  const handleImportCollection = async () => {
    setImportError(null);

    try {
      // Parse JSON
      const data = JSON.parse(importData);

      // TODO: Import collection logic
      console.log('Importing collection:', data);

      setImportData('');
      setIsImportDialogOpen(false);
      fetchCollections();
    } catch (error) {
      setImportError('Invalid JSON format. Please check your data.');
    }
  };

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

  return (
    <div className="p-4 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Collections</h3>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="import-data">Paste Collection JSON</Label>
                  <Textarea
                    id="import-data"
                    value={importData}
                    onChange={e => setImportData(e.target.value)}
                    placeholder="Paste Postman or Insomnia collection JSON here..."
                    className="min-h-[200px]"
                  />
                  {importError && <p className="text-sm text-red-500">{importError}</p>}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleImportCollection}>Import</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="collection-name">Name</Label>
                  <Input
                    id="collection-name"
                    value={newCollectionName}
                    onChange={e => setNewCollectionName(e.target.value)}
                    placeholder="My Collection"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collection-description">Description (Optional)</Label>
                  <Textarea
                    id="collection-description"
                    value={newCollectionDescription}
                    onChange={e => setNewCollectionDescription(e.target.value)}
                    placeholder="Collection description..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Folder className="h-8 w-8 mb-2" />
            <p className="text-center">No collections yet</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Collection
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {collections.map(collection => (
              <div key={collection.id} className="border rounded-md overflow-hidden mb-2">
                <div
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => toggleCollectionExpansion(collection.id)}
                >
                  <div className="flex items-center">
                    {expandedCollections[collection.id] ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    <Folder className="h-4 w-4 mr-2" />
                    <span className="font-medium">{collection.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({collection.requests.length})
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExportCollection(collection.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {expandedCollections[collection.id] && (
                  <div className="pl-8 pr-2 py-2">
                    {collection.requests.length === 0 ? (
                      <div className="text-center text-gray-400 py-2 text-sm">
                        No requests in this collection
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {collection.requests.map(request => (
                          <div
                            key={request.id}
                            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => onLoadRequest(request)}
                          >
                            <div className="flex items-center">
                              <File className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm">{request.name}</span>
                            </div>
                            <Badge className={`${getMethodColor(request.method)} text-white`}>
                              {request.method}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPanel;
