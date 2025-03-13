import { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Home, ArrowRight, Copy, Check, Trash2, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { copyToClipboard } from '@/utils/converter';

interface RegexFlag {
  id: string;
  label: string;
  description: string;
}

interface RegexExample {
  name: string;
  pattern: string;
  text: string;
}

interface FlagState {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
  u: boolean;
  y: boolean;
}

interface RegexMatch {
  text: string;
  index: number;
  groups?: Record<string, string>;
}

const REGEX_FLAGS: RegexFlag[] = [
  { id: 'g', label: 'Global', description: 'Match all occurrences' },
  { id: 'i', label: 'Case Insensitive', description: 'Ignore case' },
  { id: 'm', label: 'Multiline', description: 'Anchors apply to each line' },
  { id: 's', label: 'Dot All', description: 'Dot matches newlines' },
  { id: 'u', label: 'Unicode', description: 'Enable Unicode support' },
  { id: 'y', label: 'Sticky', description: 'Match at lastIndex position only' },
];

const EXAMPLE_PATTERNS: RegexExample[] = [
  {
    name: 'Email',
    pattern: '[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    text: 'Contact us at example@email.com or support@company.org',
  },
  {
    name: 'URL',
    pattern: 'https?:\\/\\/[\\w\\d.-]+\\.[a-zA-Z]{2,}(?:\\/[\\w\\d./-]*)?',
    text: 'Visit our website at https://example.com/path/to/page',
  },
  {
    name: 'Date (MM/DD/YYYY)',
    pattern: '(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d\\d',
    text: 'The event is on 05/23/2024 and ends on 06/15/2024',
  },
  {
    name: 'IP Address',
    pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    text: 'Server IP addresses: 192.168.1.1 and 10.0.0.255',
  },
  {
    name: 'Phone Number',
    pattern: '\\(\\d{3}\\)\\s\\d{3}-\\d{4}',
    text: 'Call us at (555) 123-4567 or (800) 555-9876',
  },
];

const REGEX_TIPS: string[] = [
  'Use ^ to match the start of a string or line (with multiline flag)',
  'Use $ to match the end of a string or line (with multiline flag)',
  'Use \\d for digits, \\w for word characters, and \\s for whitespace',
  'Use {n,m} to match between n and m occurrences',
  'Use (?:...) for non-capturing groups',
  'Use positive lookahead (?=...) to match something followed by another pattern',
  'Use negative lookahead (?!...) to match something not followed by a pattern',
  'Use [^...] to match any character except those in the brackets',
];

const APP_TEXT = {
  title: 'Regex Playground',
  about: {
    title: 'About Regex Playground',
    description:
      'A tool for testing and validating regular expressions in real-time. Try different patterns, flags, and see matches as you type.',
    features: [
      'Syntax highlighting for matches',
      'Support for all JavaScript regex flags',
      'Match information including position and captured groups',
      'Common regex pattern examples',
      'Client-side only - no data is sent to any server',
    ],
  },
  help: {
    title: 'How to Use',
    steps: [
      'Enter a regular expression pattern in the Pattern field',
      'Select the flags you want to apply to your regex',
      'Type or paste your test string in the Test String field',
      'View the matches highlighted in the text and detailed in the Matches section',
      'Use the examples to try common regex patterns',
    ],
    tips: REGEX_TIPS,
  },
};

export default function RegexPlaygroundPage() {
  const [pattern, setPattern] = useState<string>('');
  const [testString, setTestString] = useState<string>('');
  const [flags, setFlags] = useState<FlagState>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [highlightedText, setHighlightedText] = useState<React.ReactNode>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Update matches when pattern, testString, or flags change
  useEffect(() => {
    testRegex();
  }, [pattern, testString, flags]);

  const testRegex = (): void => {
    setError(null);
    setMatches([]);

    if (!pattern || !testString) {
      setHighlightedText(testString);
      return;
    }

    try {
      // Build the flags string
      const flagsStr = Object.entries(flags)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([flag]) => flag)
        .join('');

      // Create the RegExp object
      const regex = new RegExp(pattern, flagsStr);

      // Find all matches
      const matchResults: RegexMatch[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          // Extract groups if any
          const groups: Record<string, string> = {};
          if (match.groups) {
            Object.entries(match.groups).forEach(([key, value]) => {
              groups[key] = value;
            });
          }

          matchResults.push({
            text: match[0],
            index: match.index,
            groups: Object.keys(groups).length > 0 ? groups : undefined,
          });

          // Prevent infinite loops for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          const groups: Record<string, string> = {};
          if (match.groups) {
            Object.entries(match.groups).forEach(([key, value]) => {
              groups[key] = value;
            });
          }

          matchResults.push({
            text: match[0],
            index: match.index,
            groups: Object.keys(groups).length > 0 ? groups : undefined,
          });
        }
      }

      setMatches(matchResults);
      highlightMatches(matchResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid regular expression');
      }
      setHighlightedText(testString);
    }
  };

  const highlightMatches = (matches: RegexMatch[]): void => {
    if (matches.length === 0) {
      setHighlightedText(testString);
      return;
    }

    // Sort matches by index to process them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    // Prepare highlighted content
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedMatches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>{testString.substring(lastIndex, match.index)}</span>
        );
      }

      // Add highlighted match
      elements.push(
        <span
          key={`match-${i}`}
          className="bg-yellow-200 text-black px-1 rounded"
          title={`Match ${i + 1}: position ${match.index}`}
        >
          {match.text}
        </span>
      );

      lastIndex = match.index + match.text.length;
    });

    // Add remaining text after the last match
    if (lastIndex < testString.length) {
      elements.push(<span key="text-end">{testString.substring(lastIndex)}</span>);
    }

    setHighlightedText(<>{elements}</>);
  };

  const handleFlagChange = (id: keyof FlagState): void => {
    setFlags(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClearAll = (): void => {
    setPattern('');
    setTestString('');
    setFlags({ g: true, i: false, m: false, s: false, u: false, y: false });
    setMatches([]);
    setError(null);
    setHighlightedText('');
  };

  const handleExampleClick = (example: RegexExample): void => {
    setPattern(example.pattern);
    setTestString(example.text);
  };

  const handleCopyPattern = async (): Promise<void> => {
    const success = await copyToClipboard(pattern);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">{APP_TEXT.title}</h1>
          <Link
            to="/regex-playground/docs"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <span>Goto Documentation</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pattern</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPattern}
                  title="Copy Pattern"
                  className="hover:bg-green-50"
                  disabled={!pattern}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearAll}
                  title="Clear All"
                  className="hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex">
              <div className="grow flex items-center">
                <span className="text-gray-500 mr-1">/</span>
                <Input
                  placeholder="Enter regex pattern here..."
                  value={pattern}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPattern(e.target.value)}
                  className="font-mono border-none"
                />
                <span className="text-gray-500 ml-1">/</span>
              </div>
              <div className="ml-2 font-mono text-sm bg-gray-100 rounded px-2 py-1">
                {Object.entries(flags)
                  .filter(([_, isEnabled]) => isEnabled)
                  .map(([flag]) => flag)
                  .join('')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {REGEX_FLAGS.map(flag => (
                <div key={flag.id} className="flex items-center space-x-2">
                  <Switch
                    id={`flag-${flag.id}`}
                    checked={flags[flag.id as keyof FlagState]}
                    onCheckedChange={() => handleFlagChange(flag.id as keyof FlagState)}
                  />
                  <Label
                    htmlFor={`flag-${flag.id}`}
                    className="cursor-pointer"
                    title={flag.description}
                  >
                    {flag.label} ({flag.id})
                  </Label>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-4">Test String</h2>
            <Textarea
              placeholder="Enter text to test your regex against..."
              className="min-h-[150px] font-mono text-sm bg-gray-50 border"
              value={testString}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTestString(e.target.value)}
            />
          </div>

          {/* Results Section */}
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-5">
            <h2 className="text-xl font-semibold">Results</h2>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 border rounded p-3 min-h-[150px] whitespace-pre-wrap font-mono text-sm overflow-auto">
              {highlightedText || (
                <span className="text-gray-400">Results will appear here...</span>
              )}
            </div>

            <h3 className="font-semibold">
              Matches
              <Badge variant="outline" className="ml-2">
                {matches.length}
              </Badge>
            </h3>

            {matches.length > 0 ? (
              <div className="overflow-auto max-h-[200px]">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">Match</th>
                      <th className="p-2 text-left">Position</th>
                      {matches.some(m => m.groups) && <th className="p-2 text-left">Groups</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 font-mono">{match.text}</td>
                        <td className="p-2">{match.index}</td>
                        {matches.some(m => m.groups) && (
                          <td className="p-2 font-mono">
                            {match.groups ? (
                              <ul>
                                {Object.entries(match.groups).map(([key, value]) => (
                                  <li key={key}>
                                    <span className="text-blue-600">{key}</span>: {value}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              '-'
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : testString && !error ? (
              <div className="text-gray-500 italic">No matches found</div>
            ) : null}
          </div>
        </div>

        {/* Examples and Help */}
        <Tabs defaultValue="examples" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="examples">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Common Regex Patterns</h3>
                <p className="mb-4">Click on any example to try it in the playground:</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EXAMPLE_PATTERNS.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleExampleClick(example)}
                      className="justify-start h-auto py-2 px-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{example.name}</div>
                        <div className="text-xs font-mono truncate mt-1 text-gray-500">
                          {example.pattern}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{APP_TEXT.about.title}</h3>
                <p className="mb-4">{APP_TEXT.about.description}</p>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {APP_TEXT.about.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>

                <h4 className="font-medium mt-4 mb-2">How to Use:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  {APP_TEXT.help.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>

                <h4 className="font-medium mt-4 mb-2">Regex Tips:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {APP_TEXT.help.tips.map((tip, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                      {tip}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
