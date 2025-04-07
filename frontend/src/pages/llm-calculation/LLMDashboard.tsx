import React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRightIcon,
  BarChart2,
  Calculator,
  FileCode2,
  GitCompareArrows,
  Database,
  Server,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the tool type
type LLMTool = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  available: boolean;
  color: string; // Added color property for each card
};

// Unified list of all LLM tools with added color properties
const LLMTools: LLMTool[] = [
  {
    id: 'llm-leaderboard',
    title: 'LLM Leaderboard',
    description: 'Compare performance metrics of top language models across various benchmarks',
    icon: <BarChart2 />,
    path: '/llm-suites/llm-leaderboard',
    available: true,
    color: 'from-blue-500/10 to-indigo-500/5',
  },
  {
    id: 'llm-cost-calculator',
    title: 'Cost Calculator',
    description: 'Estimate training and inference costs for language models of different sizes',
    icon: <Calculator />,
    path: '/llm-suites/llm-cost-calculator',
    available: true,
    color: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    id: 'llm-parameter-estimator',
    title: 'Parameter Estimator',
    description: 'Calculate model size based on architecture configuration and components',
    icon: <Zap />,
    path: '/llm-suites/llm-parameter-estimator',
    available: true,
    color: 'from-amber-500/10 to-yellow-500/5',
  },
  {
    id: 'llm-carbon-footprint',
    title: 'Carbon Footprint',
    description: 'Analyze environmental impact of training and running large language models',
    icon: <Sparkles />,
    path: '/llm-suites/llm-carbon-footprint',
    available: true,
    color: 'from-green-500/10 to-lime-500/5',
  },
  {
    id: 'llm-model-comparison',
    title: 'Model Comparison',
    description: 'Compare different models side by side and analyze performance differences',
    icon: <GitCompareArrows />,
    path: '/llm-suites/llm-model-comparison',
    available: false,
    color: 'from-violet-500/10 to-purple-500/5',
  },
  {
    id: 'llm-prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Craft and optimize prompts to get better results from language models',
    icon: <FileCode2 />,
    path: '/llm-suites/llm-prompt-engineering',
    available: false,
    color: 'from-orange-500/10 to-red-500/5',
  },
];

export function LLMDashboard() {
  const navigate = useNavigate();

  const ToolCard = ({ tool }: { tool: LLMTool }) => (
    <Card
      key={tool.id}
      className={`group relative cursor-pointer border rounded-lg transition-all duration-300 overflow-hidden ${
        tool.available
          ? 'hover:border-primary/60 hover:shadow-md hover:scale-[1.02]'
          : 'opacity-70 pointer-events-none border-muted'
      }`}
      onClick={() => tool.available && navigate(tool.path)}
    >
      {/* Colorful Gradient Background */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col p-4 space-y-2 h-full">
        {/* Icon with Subtle Animation */}
        <div className="flex items-center justify-between">
          <div
            className={`text-primary text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:text-primary/90`}
          >
            {tool.icon}
          </div>
          {!tool.available && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>

        {/* Title & Description */}
        <CardHeader className="p-0 space-y-1.5">
          <CardTitle className="text-base font-semibold leading-tight text-foreground group-hover:text-primary/90 transition-colors duration-300">
            {tool.title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-snug">
            {tool.description}
          </CardDescription>
        </CardHeader>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Footer Button with Animation */}
        <CardFooter className="p-0 pt-2">
          <Button
            variant={tool.available ? 'default' : 'outline'}
            size="sm"
            className={`w-full justify-between text-xs transition-all duration-300 ${tool.available ? 'group-hover:bg-primary/90' : ''}`}
            disabled={!tool.available}
            onClick={e => {
              e.stopPropagation();
              if (tool.available) navigate(tool.path);
            }}
          >
            {tool.available ? 'Open Tool' : 'Coming Soon'}
            <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-foreground bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto py-12 px-4">
        <header className="mb-12 text-center md:text-left">
          <div className="inline-block mb-4 py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
            AI Tools Collection
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            LLM Calculator Hub
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Tools for calculating, comparing, and analyzing large language models and their
            performance metrics.
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <span className="bg-primary/20 w-6 h-6 rounded-full flex items-center justify-center mr-2">
              <span className="bg-primary w-3 h-3 rounded-full"></span>
            </span>
            LLM Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {LLMTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LLMDashboard;
