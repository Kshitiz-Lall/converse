// src/pages/IssuePRSummaryPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Slider } from '@/components/ui/slider';

export default function IssuePRSummaryPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [issueOrPR, setIssueOrPR] = useState('');
  const [summaryType, setSummaryType] = useState<'issue' | 'pr' | 'changes'>('issue');
  const [token, setToken] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState(50);

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
      });

      const { summary } = response.data;
      setSummary(summary);
      toast.success('Summary generated');
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
    toast.success('Copied to clipboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Issue & PR Summary Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <Label>Repository URL</Label>
            <Input
              placeholder="https://github.com/user/repo"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Issue/PR Number</Label>
            <Input
              placeholder="e.g. 42"
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
                <Label htmlFor="changes">Changes of PR</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Access Token (optional)</Label>
            <Input
              type="password"
              placeholder="GitHub/GitLab personal access token"
              value={token}
              onChange={e => setToken(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Summary Length:</Label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={10}
              onValueChange={value => setSummaryLength(value[0])}
            />
            <p>Length: {summaryLength}%</p>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            Generate Summary
          </Button>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Generated Summary</h2>
            <Button onClick={handleCopy} size="sm" variant="outline" disabled={!summary}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-[300px] w-full rounded-md" />
          ) : summary ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code({ children, className }) {
                    return (
                      <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
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
            <Textarea
              className="min-h-[300px] font-mono text-sm"
              placeholder="Summary will appear here..."
              readOnly
            />
          )}
        </div>
      </div>
    </div>
  );
}
