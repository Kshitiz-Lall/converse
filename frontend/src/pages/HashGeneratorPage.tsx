// frontend/src/pages/HashGeneratorPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyIcon, Hash, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';

// Client-side hash functions using Web Crypto API and crypto-js
const generateClientHash = async (text: string, algorithm: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  if (algorithm === 'MD5') {
    return CryptoJS.MD5(text).toString();
  } else if (algorithm === 'SHA1' || algorithm === 'SHA-1') {
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else if (algorithm === 'SHA256' || algorithm === 'SHA-256') {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
};

export interface HashResult {
  algorithm: string;
  input: string;
  hash: string;
}

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState<string>('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['SHA1', 'SHA256']);
  const [results, setResults] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const supportedAlgorithms = ['MD5', 'SHA1', 'SHA256'];

  const generateHashes = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to hash');
      return;
    }

    if (selectedAlgorithms.length === 0) {
      setError('Please select at least one algorithm');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newResults: HashResult[] = [];
      
      for (const algorithm of selectedAlgorithms) {
        try {
          const hash = await generateClientHash(inputText, algorithm);
          newResults.push({
            algorithm,
            input: inputText,
            hash
          });
        } catch (err) {
          newResults.push({
            algorithm,
            input: inputText,
            hash: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
          });
        }
      }
      
      setResults(newResults);
      setError(null);
    } catch (err) {
      setError('Failed to generate hashes. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAlgorithmChange = (algorithm: string, checked: boolean) => {
    if (checked) {
      setSelectedAlgorithms(prev => [...prev, algorithm]);
    } else {
      setSelectedAlgorithms(prev => prev.filter(alg => alg !== algorithm));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Hash copied to clipboard');
  };

  const copyAllToClipboard = () => {
    const allHashes = results.map(result => `${result.algorithm}: ${result.hash}`).join('\n');
    navigator.clipboard.writeText(allHashes);
    toast.success('All hashes copied to clipboard');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold">Hash Generator</h1>

        <Card>
          <CardHeader>
            <CardTitle>Input & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="input-text">Text to Hash</Label>
              <Textarea
                id="input-text"
                placeholder="Enter the text you want to hash..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="min-h-[100px] font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Hash Algorithms</Label>
              <div className="flex flex-wrap gap-4">
                {supportedAlgorithms.map(algorithm => (
                  <div key={algorithm} className="flex items-center space-x-2">
                    <Checkbox
                      id={algorithm}
                      checked={selectedAlgorithms.includes(algorithm)}
                      onCheckedChange={(checked) => 
                        handleAlgorithmChange(algorithm, checked as boolean)
                      }
                    />
                    <Label htmlFor={algorithm}>{algorithm}</Label>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircleIcon className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              onClick={generateHashes} 
              disabled={loading || !inputText.trim() || selectedAlgorithms.length === 0}
            >
              <Hash className="mr-2 h-4 w-4" />
              {loading ? 'Generating...' : 'Generate Hashes'}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Hashes</CardTitle>
                <Button variant="outline" size="sm" onClick={copyAllToClipboard}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{result.algorithm}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.hash)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={result.hash}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Generated {results.length} hash{results.length !== 1 ? 'es' : ''} using {selectedAlgorithms.join(', ')}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}