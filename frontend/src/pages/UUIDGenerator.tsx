import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { CopyIcon, RefreshCwIcon } from 'lucide-react';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function UUIDGenerator() {
  const [version, setVersion] = useState<'v1' | 'v4'>('v4');
  const [count, setCount] = useState<number>(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUUIDs = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(version === 'v1' ? uuidv1() : uuidv4());
    }
    setUuids(newUuids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('UUID copied to clipboard');
  };

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    toast.success('All UUIDs copied to clipboard');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold">UUID Generator</h1>

        <Card>
          <CardHeader>
            <CardTitle>Generator Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>UUID Version</Label>
              <RadioGroup
                value={version}
                onValueChange={(value: 'v1' | 'v4') => setVersion(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="v1" id="v1" />
                  <Label htmlFor="v1">Version 1 (Time-based)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="v4" id="v4" />
                  <Label htmlFor="v4">Version 4 (Random)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of UUIDs</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-24"
              />
            </div>

            <Button onClick={generateUUIDs}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Generate UUIDs
            </Button>
          </CardContent>
        </Card>

        {uuids.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated UUIDs</CardTitle>
                <Button variant="outline" size="sm" onClick={copyAllToClipboard}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={uuid} readOnly className="font-mono" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(uuid)}>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Generated {uuids.length} {version.toUpperCase()} UUIDs
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
