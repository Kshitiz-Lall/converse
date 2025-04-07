// frontend/src/components/api-tester/EnvironmentsPanel.tsx
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
import {
  createEnvironment,
  deleteEnvironment,
  getActiveEnvironment,
  getEnvironments,
  setActiveEnvironment,
  updateEnvironment,
} from '@/services/testServiceApi';
import { Environment } from '@/types/apiTester';
import { ArrowRight, Edit, MoreHorizontal, Plus, Settings, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EnvironmentsPanelProps {
  environments: Environment[];
  activeEnvironment: Environment | null;
}

const EnvironmentsPanel = ({
  environments: propEnvironments,
  activeEnvironment: propActiveEnvironment,
}: EnvironmentsPanelProps) => {
  const [environments, setEnvironments] = useState<Environment[]>(propEnvironments);
  const [activeEnvironment, setActiveEnvironmentState] = useState<Environment | null>(
    propActiveEnvironment
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);

  // New environment state
  const [newEnvironmentName, setNewEnvironmentName] = useState('');

  // Variable management
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});

  // Load environments on mount
  useEffect(() => {
    fetchEnvironments();
  }, []);

  // Fetch environments
  const fetchEnvironments = async () => {
    try {
      const fetchedEnvironments = await getEnvironments();
      setEnvironments(fetchedEnvironments);

      const active = await getActiveEnvironment();
      setActiveEnvironmentState(active);
    } catch (error) {
      console.error('Failed to fetch environments:', error);
    }
  };

  // Create new environment
  const handleCreateEnvironment = async () => {
    if (!newEnvironmentName.trim()) return;

    try {
      await createEnvironment(newEnvironmentName, variables);
      setNewEnvironmentName('');
      setVariables({});
      setNewVarKey('');
      setNewVarValue('');
      setIsCreateDialogOpen(false);
      fetchEnvironments();
    } catch (error) {
      console.error('Failed to create environment:', error);
    }
  };

  // Set active environment
  const handleSetActive = async (id: string) => {
    try {
      await setActiveEnvironment(id);
      fetchEnvironments();
    } catch (error) {
      console.error('Failed to set active environment:', error);
    }
  };

  // Delete environment
  const handleDeleteEnvironment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this environment?')) return;

    try {
      await deleteEnvironment(id);
      fetchEnvironments();
    } catch (error) {
      console.error('Failed to delete environment:', error);
    }
  };

  // Begin editing environment
  const handleEditEnvironment = (environment: Environment) => {
    setEditingEnvironment(environment);
    setVariables({ ...environment.variables });
    setIsEditDialogOpen(true);
  };

  // Save edited environment
  const handleSaveEnvironment = async () => {
    if (!editingEnvironment) return;

    try {
      await updateEnvironment(editingEnvironment.id, {
        variables,
      });
      setIsEditDialogOpen(false);
      setEditingEnvironment(null);
      fetchEnvironments();
    } catch (error) {
      console.error('Failed to update environment:', error);
    }
  };

  // Add a variable to the list
  const addVariable = () => {
    if (!newVarKey.trim()) return;

    setVariables(prev => ({
      ...prev,
      [newVarKey]: newVarValue,
    }));

    setNewVarKey('');
    setNewVarValue('');
  };

  // Remove a variable
  const removeVariable = (key: string) => {
    const updatedVars = { ...variables };
    delete updatedVars[key];
    setVariables(updatedVars);
  };

  // Update a variable value
  const updateVariableValue = (key: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-4 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Environments</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Environment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="environment-name">Name</Label>
                <Input
                  id="environment-name"
                  value={newEnvironmentName}
                  onChange={e => setNewEnvironmentName(e.target.value)}
                  placeholder="Development, Production, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Variables</Label>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Variable name"
                      value={newVarKey}
                      onChange={e => setNewVarKey(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Value"
                      value={newVarValue}
                      onChange={e => setNewVarValue(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={addVariable} disabled={!newVarKey.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {Object.keys(variables).length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No variables added yet
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="py-2 px-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(variables).map(([key, value]) => (
                          <tr key={key} className="border-t">
                            <td className="py-2 px-3 text-sm">{key}</td>
                            <td className="py-2 px-3 text-sm font-mono">{value}</td>
                            <td className="py-2 px-3">
                              <Button variant="ghost" size="sm" onClick={() => removeVariable(key)}>
                                <Trash2 className="h-3 w-3 text-gray-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEnvironment} disabled={!newEnvironmentName.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit environment dialog */}
      {editingEnvironment && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Environment: {editingEnvironment.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Variables</Label>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Variable name"
                      value={newVarKey}
                      onChange={e => setNewVarKey(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Value"
                      value={newVarValue}
                      onChange={e => setNewVarValue(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={addVariable} disabled={!newVarKey.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {Object.keys(variables).length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No variables added yet
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="py-2 px-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(variables).map(([key, value]) => (
                          <tr key={key} className="border-t">
                            <td className="py-2 px-3 text-sm">{key}</td>
                            <td className="py-2 px-3">
                              <Input
                                value={value}
                                onChange={e => updateVariableValue(key, e.target.value)}
                                className="h-7 py-1"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Button variant="ghost" size="sm" onClick={() => removeVariable(key)}>
                                <Trash2 className="h-3 w-3 text-gray-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEnvironment}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex-1 overflow-auto">
        {environments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Settings className="h-8 w-8 mb-2" />
            <p className="text-center">No environments yet</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Environment
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {environments.map(env => (
              <div
                key={env.id}
                className={`border rounded-md p-3 ${env.isActive ? 'bg-primary/10 border-primary' : 'bg-white'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Settings
                      className={`h-4 w-4 mr-2 ${env.isActive ? 'text-primary' : 'text-gray-400'}`}
                    />
                    <span className="font-medium">{env.name}</span>
                    {env.isActive && (
                      <span className="ml-2 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!env.isActive && (
                      <Button variant="outline" size="sm" onClick={() => handleSetActive(env.id)}>
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Use
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEnvironment(env)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Variables
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDeleteEnvironment(env.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Display variables */}
                <div className="mt-2 border-t pt-2">
                  <div className="text-xs font-medium mb-1 text-gray-500">Variables</div>
                  {Object.keys(env.variables).length === 0 ? (
                    <div className="text-xs text-gray-400 italic">No variables defined</div>
                  ) : (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(env.variables).map(([key, value]) => (
                        <div key={key} className="flex text-xs">
                          <span className="font-mono font-medium mr-2">{key}:</span>
                          <span className="font-mono text-gray-600 truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
        <h4 className="font-medium mb-1">How to use environment variables</h4>
        <p className="text-gray-600 text-xs mb-2">
          Use double curly braces to reference variables in your requests.
        </p>
        <div className="bg-gray-100 rounded p-2 font-mono text-xs">
          https://api.example.com/users/{'{{userId}}'}
          <br />
          Authorization: Bearer {'{{authToken}}'}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentsPanel;
