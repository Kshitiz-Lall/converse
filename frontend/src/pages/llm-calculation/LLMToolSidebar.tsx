import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BarChart2,
  Calculator,
  FileCode2,
  GitCompareArrows,
  Sparkles,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Define the tool type
type LLMTool = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  available: boolean;
  color: string;
};

const LLMTools: LLMTool[] = [
  {
    id: 'llm-leaderboard',
    title: 'LLM Leaderboard',
    description: 'Compare performance metrics of top language models across various benchmarks',
    icon: <BarChart2 className="h-5 w-5" />,
    path: '/llm-suites/llm-leaderboard',
    available: true,
    color: 'from-blue-500/10 to-indigo-500/5',
  },
  {
    id: 'llm-cost-calculator',
    title: 'Cost Calculator',
    description: 'Estimate training and inference costs for language models of different sizes',
    icon: <Calculator className="h-5 w-5" />,
    path: '/llm-suites/llm-cost-calculator',
    available: true,
    color: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    id: 'llm-parameter-estimator',
    title: 'Parameter Estimator',
    description: 'Calculate model size based on architecture configuration and components',
    icon: <Zap className="h-5 w-5" />,
    path: '/llm-suites/llm-parameter-estimator',
    available: true,
    color: 'from-amber-500/10 to-yellow-500/5',
  },
  {
    id: 'llm-carbon-footprint',
    title: 'Carbon Footprint',
    description: 'Analyze environmental impact of training and running large language models',
    icon: <Sparkles className="h-5 w-5" />,
    path: '/llm-suites/llm-carbon-footprint',
    available: true,
    color: 'from-green-500/10 to-lime-500/5',
  },
  {
    id: 'llm-model-comparison',
    title: 'Model Comparison',
    description: 'Compare different models side by side and analyze performance differences',
    icon: <GitCompareArrows className="h-5 w-5" />,
    path: '/llm-suites/llm-model-comparison',
    available: false,
    color: 'from-violet-500/10 to-purple-500/5',
  },
  {
    id: 'llm-prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Craft and optimize prompts to get better results from language models',
    icon: <FileCode2 className="h-5 w-5" />,
    path: '/llm-suites/llm-prompt-engineering',
    available: false,
    color: 'from-orange-500/10 to-red-500/5',
  },
];

export function LLMToolSidebar() {
  const location = useLocation();

  return (
    <TooltipProvider>
      <aside className="w-20 min-h-screen border-r bg-background p-3 flex flex-col items-center">
        {LLMTools.map((tool) => {
          const isActive = location.pathname === tool.path;

          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Link
                  to={tool.available ? tool.path : '#'}
                  className={cn(
                    'group mb-3 flex flex-col items-center text-center',
                    !tool.available && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  <div
                    className={cn(
                      'h-12 w-12 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br transition-all',
                      tool.color,
                      isActive && 'ring-2 ring-primary'
                    )}
                  >
                    {tool.icon}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="w-48">
                <div className="text-sm font-medium">{tool.title}</div>
                <div className="text-muted-foreground text-xs">{tool.description}</div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    </TooltipProvider>
  );
}
