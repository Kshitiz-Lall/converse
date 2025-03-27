// src/pages/IssuePRSummaryPage.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Copy, Github, Gitlab, Info, Loader2 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function IssuePRSummaryPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [issueOrPR, setIssueOrPR] = useState('');
  const [summaryType, setSummaryType] = useState<'issue' | 'pr' | 'changes'>('issue');
  const [token, setToken] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState(50);
  const [tone, setTone] = useState<'neutral' | 'technical' | 'concise'>('neutral');
  const [activeTab, setActiveTab] = useState<'github' | 'gitlab'>('github');

  const handleSubmit = async () => {
    if (!repoUrl || !issueOrPR) {
      toast.error('Repository URL and Issue/PR Number are required');
      return;
    }

    if (!/^https?:\/\/(github|gitlab)\.com\/.+\/.+/.test(repoUrl)) {
      toast.error('Please enter a valid GitHub or GitLab repository URL');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const response = await axios.post('http://localhost:3000/api/pr/summarize', {
        repoUrl,
        issueOrPR,
        summaryType,
        token,
        summaryLength,
        tone,
        platform: activeTab,
      });

      const { summary } = response.data;
      setSummary(summary);
      toast.success('Summary generated successfully!');
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Something went wrong while generating the summary';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Copied to clipboard!');
  };

  const handleExampleClick = () => {
    setRepoUrl('https://github.com/facebook/react');
    setIssueOrPR('26771');
    setSummaryType('issue');
    toast.info('Example loaded. Click "Generate Summary" to see it in action.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
       <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Issue & PR Summary Generator</h1>
          <Link
            to="/issue-pr-summary/docs"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <span>Goto Documentation</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      <div className="text-center mb-10">

        <p className="text-muted-foreground">
          Automatically generate summaries for GitHub/GitLab issues and pull requests using AI
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'github' | 'gitlab')}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto">
          <TabsTrigger value="github">
            <Github className="h-4 w-4 mr-2" /> GitHub
          </TabsTrigger>
          <TabsTrigger value="gitlab">
            <Gitlab className="h-4 w-4 mr-2" /> GitLab
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Repository URL</Label>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleExampleClick}
              >
                Load Example
              </Badge>
            </div>
            <Input
              placeholder={`https://${activeTab}.com/user/repo`}
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Issue/PR Number or URL</Label>
            <Input
              placeholder="e.g. 42 or full URL"
              value={issueOrPR}
              onChange={e => setIssueOrPR(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>What do you want to summarize?</Label>
            <RadioGroup
              value={summaryType}
              onValueChange={val => setSummaryType(val as typeof summaryType)}
              className="flex flex-wrap gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue">Issue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pr" id="pr" />
                <Label htmlFor="pr">Pull Request</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="changes" id="changes" />
                <Label htmlFor="changes">Code Changes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Tone</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the tone for your summary</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={tone} onValueChange={val => setTone(val as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Summary Length: {summaryLength}%</Label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={10}
              onValueChange={value => setSummaryLength(value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Short</span>
              <span>Long</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              {activeTab === 'github' ? 'GitHub' : 'GitLab'} Access Token (optional)
            </Label>
            <Input
              type="password"
              placeholder={`${activeTab === 'github' ? 'GitHub' : 'GitLab'} personal access token`}
              value={token}
              onChange={e => setToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Required for private repositories
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Generating...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Generated Summary</h2>
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                disabled={!summary}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Badge variant="secondary" className="capitalize">
                {tone}
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-[90%] rounded-md" />
              <Skeleton className="h-4 w-[80%] rounded-md" />
              <Skeleton className="h-4 w-[85%] rounded-md" />
              <Skeleton className="h-4 w-[95%] rounded-md" />
            </div>
          ) : summary ? (
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/30">
              <ReactMarkdown
                components={{
                  code({ children, className }) {
                    return (
                      <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-x-auto text-sm">
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  },
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-lg text-muted-foreground">
              <p>Your summary will appear here</p>
              <p className="text-sm mt-2">Enter details and click "Generate Summary"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
