// src/pages/PRSummaryGeneratorDocs.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, GitPullRequest, Github, Gitlab, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PRSummaryGeneratorDocs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/issue-pr-summary"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to PR Summary Generator</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">PR Summary Generator Documentation</h1>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">What is the PR Summary Generator?</h2>
                    <p className="mb-4 text-gray-700">
                      The PR Summary Generator is an AI-powered tool that automatically creates
                      concise, informative summaries of GitHub and GitLab pull requests and issues.
                      It helps developers, reviewers, and managers quickly understand the purpose
                      and impact of code changes without reading through all the details.
                    </p>
                    <p className="mb-4 text-gray-700">
                      Our tool analyzes the PR/issue content, commit messages, and code changes to
                      generate human-readable summaries tailored to your needs.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">
                      Why Use a PR Summary Generator?
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
                      <li>
                        <strong>Save Time:</strong> Quickly understand PRs/issues without reading
                        through all the details.
                      </li>
                      <li>
                        <strong>Improve Code Reviews:</strong> Get context before diving into code
                        changes.
                      </li>
                      <li>
                        <strong>Better Documentation:</strong> Automatically generate changelog
                        entries and release notes.
                      </li>
                      <li>
                        <strong>Onboarding:</strong> Help new team members understand recent
                        changes.
                      </li>
                      <li>
                        <strong>Cross-Team Communication:</strong> Share summaries with
                        non-technical stakeholders.
                      </li>
                    </ul>

                    <Button asChild className="mt-4">
                      <Link to="/pr-summary">
                        <GitPullRequest className="mr-2 h-4 w-4" />
                        Try PR Summary Generator
                      </Link>
                    </Button>
                  </div>

                  <div className="md:w-1/3 bg-gray-100 rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      Quick Facts
                    </h3>
                    <ul className="space-y-4">
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Supported Platforms</p>
                        <p className="font-medium">GitHub, GitLab</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Summary Types</p>
                        <p className="font-medium">PR, Issue, Code Changes</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Tone Options</p>
                        <p className="font-medium">Neutral, Technical, Concise</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Authentication</p>
                        <p className="font-medium">Optional (for private repos)</p>
                      </li>
                      <li>
                        <p className="text-sm text-gray-500">Max Context Length</p>
                        <p className="font-medium">8,000 tokens</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <GitPullRequest className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">PR Summarization</h3>
                        <p className="text-gray-600 text-sm">Comprehensive pull request analysis</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Generate summaries that capture the purpose, changes, and impact of pull
                      requests, including code changes, discussions, and review comments.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Github className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Issue Summarization</h3>
                        <p className="text-gray-600 text-sm">Concise issue descriptions</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Extract key information from GitHub/GitLab issues, including problem
                      statements, reproduction steps, and proposed solutions.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Gitlab className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Code Change Analysis</h3>
                        <p className="text-gray-600 text-sm">Diff summarization</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Get summaries of code changes that highlight the most important modifications
                      and their potential impact on the codebase.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Copy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Customizable Output</h3>
                        <p className="text-gray-600 text-sm">Tailor summaries to your needs</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Adjust summary length, tone (technical, neutral, concise), and focus areas to
                      get exactly the information you need.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Detailed Capabilities</h3>
                  <p className="mb-4 text-gray-700">
                    The PR Summary Generator provides intelligent analysis of:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Pull request descriptions and titles</li>
                    <li>Code diff contents and file changes</li>
                    <li>Review comments and discussions</li>
                    <li>Linked issues and references</li>
                    <li>Commit messages and history</li>
                    <li>Labels, milestones, and assignees</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Guide Tab */}
          <TabsContent value="usage">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Usage Guide</h2>
                <p className="mb-6 text-gray-700">
                  Follow these steps to generate effective PR and issue summaries:
                </p>

                <div className="space-y-8">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">1. Enter Repository Information</h3>
                    <p className="text-gray-700 mb-2">
                      Provide the full repository URL (e.g., https://github.com/user/repo) and the
                      PR/issue number you want to summarize.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tip: You can also paste the full PR/issue URL in either field.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">2. Select Summary Type</h3>
                    <p className="text-gray-700 mb-2">Choose what you want to summarize:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>
                        <strong>Pull Request:</strong> General overview of the PR
                      </li>
                      <li>
                        <strong>Issue:</strong> Summary of the problem and discussion
                      </li>
                      <li>
                        <strong>Code Changes:</strong> Focused analysis of the diff
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">3. Adjust Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">Summary Length</p>
                        <p className="text-gray-700 text-sm">
                          Use the slider to control how detailed the summary should be (50% for
                          standard, 100% for comprehensive).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Tone</p>
                        <p className="text-gray-700 text-sm">
                          Select between:
                          <ul className="list-disc pl-5 mt-1">
                            <li>
                              <strong>Neutral:</strong> Balanced technical and business language
                            </li>
                            <li>
                              <strong>Technical:</strong> More detailed, developer-focused
                            </li>
                            <li>
                              <strong>Concise:</strong> Brief bullet points of key information
                            </li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">4. Authentication (Optional)</h3>
                    <p className="text-gray-700">
                      For private repositories, provide a GitHub/GitLab personal access token with
                      appropriate permissions (repo scope for GitHub, read_api for GitLab).
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">5. Generate and Use</h3>
                    <p className="text-gray-700">
                      Click "Generate Summary" and wait for the AI to process your request. Once
                      complete, you can:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                      <li>Copy the summary to your clipboard</li>
                      <li>Paste it into review comments or documentation</li>
                      <li>Use it to quickly understand complex changes</li>
                      <li>Share with team members for context</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-5 mt-8">
                  <h3 className="text-lg font-semibold mb-3">Example Workflows</h3>
                  <ul className="space-y-4 text-gray-700">
                    <li>
                      <strong>Code Review Preparation:</strong> Generate a technical summary of
                      changes before starting your review.
                    </li>
                    <li>
                      <strong>Standup Updates:</strong> Create concise summaries of recent PRs to
                      discuss in meetings.
                    </li>
                    <li>
                      <strong>Documentation:</strong> Automatically generate changelog entries from
                      merged PRs.
                    </li>
                    <li>
                      <strong>Onboarding:</strong> Summarize important historical issues for new
                      team members.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Best Practices for Effective Summaries</h2>

                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Write Descriptive PR Titles</h3>
                    <p className="text-gray-700">
                      Clear, descriptive PR titles help the AI generate better summaries. Include
                      the purpose or impact of the changes in the title.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Structure Your PR Description</h3>
                    <p className="text-gray-700">
                      Use sections like "Purpose", "Changes", and "Testing" in your PR description
                      to help the AI identify and emphasize key information.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Choose the Right Summary Type</h3>
                    <p className="text-gray-700">
                      Select "Code Changes" when you need to understand the technical details, or
                      "PR Summary" when you want broader context about the change's purpose.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Adjust Length Based on Needs</h3>
                    <p className="text-gray-700">
                      Use shorter summaries (50-70%) for quick overviews and longer summaries
                      (80-100%) when you need comprehensive details for complex changes.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Match Tone to Audience</h3>
                    <p className="text-gray-700">
                      Use "Technical" tone for developer audiences, "Concise" for busy reviewers,
                      and "Neutral" when sharing with mixed audiences.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Verify Critical Details</h3>
                    <p className="text-gray-700">
                      While our summaries are highly accurate, always verify critical technical
                      details and security implications before acting on them.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-5 mt-8">
                  <h3 className="text-lg font-semibold mb-3">When to Use Each Summary Type</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>When You Need...</TableHead>
                        <TableHead>Recommended Type</TableHead>
                        <TableHead>Suggested Length</TableHead>
                        <TableHead>Tone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Quick context before review</TableCell>
                        <TableCell>PR Summary</TableCell>
                        <TableCell>50-70%</TableCell>
                        <TableCell>Concise</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Deep technical understanding</TableCell>
                        <TableCell>Code Changes</TableCell>
                        <TableCell>80-100%</TableCell>
                        <TableCell>Technical</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Historical issue context</TableCell>
                        <TableCell>Issue Summary</TableCell>
                        <TableCell>60-80%</TableCell>
                        <TableCell>Neutral</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Documentation/changelog</TableCell>
                        <TableCell>PR Summary</TableCell>
                        <TableCell>70-90%</TableCell>
                        <TableCell>Neutral</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">API Documentation</h2>
                <p className="mb-6 text-gray-700">
                  The PR Summary Generator provides a REST API for programmatic access to the
                  summarization features.
                </p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Base Endpoint</h3>
                  <code className="block bg-gray-800 text-white p-3 rounded">
                    POST /api/summarize
                  </code>
                </div>

                <h3 className="text-lg font-semibold mb-3">Request Parameters</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">repoUrl</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Full repository URL</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">issueOrPR</TableCell>
                      <TableCell>String/Number</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>PR/issue number or URL</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">summaryType</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>"pr", "issue", or "changes"</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">token</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>GitHub/GitLab access token</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">summaryLength</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Summary length percentage (1-100)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">tone</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>"neutral", "technical", or "concise"</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">platform</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>"github" or "gitlab" (default: "github")</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h3 className="text-lg font-semibold mt-6 mb-3">Example Request</h3>
                <div className="bg-gray-800 text-white p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm">
                    {`// Example API Call
fetch('https://api.example.com/api/summarize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    repoUrl: 'https://github.com/facebook/react',
    issueOrPR: '26771',
    summaryType: 'issue',
    summaryLength: 80,
    tone: 'technical'
  })
})
.then(response => response.json())
.then(data => {
  console.log(data.summary);
});`}
                  </pre>
                </div>

                <h3 className="text-lg font-semibold mb-3">Response Structure</h3>
                <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`{
  "success": true,
  "summary": "This issue discusses...",
  "metadata": {
    "platform": "github",
    "type": "issue",
    "length": 80,
    "tone": "technical",
    "processingTime": 1.24
  }
}`}
                  </pre>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                  <p className="text-yellow-800">
                    <strong>Rate Limiting:</strong> The API is currently limited to 100 requests per
                    hour per API key. Contact support for higher limits.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
