import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Loader2, Bug, Sparkles, Code, Terminal } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';

// Constants for Labels, Languages, Analysis Types, and Icons
const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'ruby', 'go', 'rust', 'cpp'
];

const ANALYSIS_TYPES = [
  { value: 'error', label: 'Error Debugging' },
  { value: 'static', label: 'Static Analysis' },
  { value: 'performance', label: 'Performance Check' }
];

const ICONS = {
  bug: <Bug className="h-8 w-8 text-red-500" />,
  sparkles: <Sparkles className="h-4 w-4 mr-2" />,
  loader: <Loader2 className="animate-spin h-4 w-4 mr-2" />,
  terminal: <Terminal className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  copy: <Copy className="h-4 w-4 mr-2" />
};

// Component
export default function AIDebuggerPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysisType, setAnalysisType] = useState<'error' | 'static' | 'performance'>('error');
  const [debugResults, setDebugResults] = useState<{
    explanation: string;
    solution: string;
    fixedCode: string;
    severity: 'low' | 'medium' | 'high';
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugDepth, setDebugDepth] = useState(50);
  const [activeTab, setActiveTab] = useState('input');

  const handleSubmit = async () => {
    if (!code) {
      toast.error('Please enter some code to analyze');
      return;
    }

    if (analysisType === 'error' && !error) {
      toast.error('Please enter the error message for error analysis');
      return;
    }

    setLoading(true);
    setDebugResults(null);

    try {
      const response = await axios.post('http://localhost:3000/api/debug', {
        code,
        error: analysisType === 'error' ? error : undefined,
        language,
        analysisType,
        debugDepth,
      });

      setDebugResults(response.data);
      setActiveTab('results');
      toast.success('Analysis complete!');
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || 'Something went wrong during analysis';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleExampleLoad = () => {
    setLanguage('javascript');
    setCode(`function calculateTotal(items) {
  return items.reduce((total, item) => {
    total += item.price * item.quantity;
    return total;
  });
}

const cart = [
  { price: 10, quantity: 2 },
  { price: 15, quantity: '1' },
  { price: 25, quantity: 3 }
];

console.log(calculateTotal(cart));`);
    setError('NaN');
    toast.info('Example loaded. Click "Analyze Code" to debug.');
  };

  useEffect(() => {
    if (analysisType !== 'error') {
      setError('');
    }
  }, [analysisType]);

  // Simple syntax highlighting class based on language
  const getCodeClassName = () => {
    return `language-${language} text-sm font-mono bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          {ICONS.bug}
          AI Debugger
        </h1>
        <p className="text-muted-foreground">
          AI-driven error detection and intelligent suggestions for bug fixing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Label className="text-lg">Code Input</Label>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleExampleLoad}
            >
              Load Example
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="results" disabled={!debugResults}>
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Programming Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Analysis Type</Label>
                  <RadioGroup
                    value={analysisType}
                    onValueChange={val => setAnalysisType(val as any)}
                    className="flex flex-wrap gap-4 pt-2"
                  >
                    {ANALYSIS_TYPES.map(type => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value}>{type.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {analysisType === 'error' && (
                  <div className="space-y-2">
                    <Label>Error Message</Label>
                    <Input
                      placeholder="Enter the error message you're seeing"
                      value={error}
                      onChange={e => setError(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Code to Analyze</Label>
                    <span className="text-xs text-muted-foreground">{code.length} characters</span>
                  </div>
                  <Textarea
                    className="min-h-[300px] font-mono text-sm"
                    placeholder={`Paste your ${language} code here...`}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Analysis Depth: {debugDepth}%</Label>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={10}
                    onValueChange={value => setDebugDepth(value[0])}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Quick Scan</span>
                    <span>Deep Analysis</span>
                  </div>
                </div>

                <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4" size="lg">
                  {loading ? (
                    <>
                      {ICONS.loader}
                      Analyzing...
                    </>
                  ) : (
                    <>
                      {ICONS.sparkles}
                      Analyze Code
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {debugResults ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        {ICONS.terminal}
                        Error Explanation
                      </h3>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm">{debugResults.explanation}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      {ICONS.code}
                      Suggested Fix
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm">{debugResults.solution}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Fixed Code</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(debugResults.fixedCode)}
                      >
                        {ICONS.copy}
                        Copy
                      </Button>
                    </div>
                    <pre className={getCodeClassName()}>{debugResults.fixedCode}</pre>
                  </div>

                  <Button
                    onClick={() => setActiveTab('input')}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Input
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">No results yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            {debugResults && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(debugResults, null, 2))}
                >
                  {ICONS.copy}
                  Copy All
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-[90%] rounded-md" />
              <Skeleton className="h-4 w-[80%] rounded-md" />
              <Skeleton className="h-4 w-[85%] rounded-md" />
              <Skeleton className="h-4 w-[95%] rounded-md" />
              <div className="pt-4">
                <Skeleton className="h-[200px] w-full rounded-md" />
              </div>
            </div>
          ) : debugResults ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Problem Identified</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/30">
                  {debugResults.explanation}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Recommended Solution</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/30">
                  {debugResults.solution}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Corrected Code</h3>
                <pre className={getCodeClassName()}>{debugResults.fixedCode}</pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-lg text-muted-foreground">
              {ICONS.bug}
              <p>Debugging results will appear here</p>
              <p className="text-sm mt-2">Enter your code and click "Analyze Code"</p>
            </div>
          )}

          {debugResults && (
            <div className="mt-auto pt-4">
              <h3 className="font-medium mb-2">How to Prevent Similar Issues</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Add type checking for function parameters</li>
                <li>Implement input validation</li>
                <li>Write unit tests for edge cases</li>
                <li>Use TypeScript for type safety</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
