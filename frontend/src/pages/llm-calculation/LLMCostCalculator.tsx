import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { LLMToolSidebar } from './LLMToolSidebar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

const LLMCostCalculator = () => {

  return (
    <div className="min-h-screen bg-background flex">
      <LLMToolSidebar />
      {/* Main content */}
      <div className="flex-1 pb-12">
        <div className="container mx-auto p-4 py-8 max-w-6xl">
        <Card className="mb-8 bg-gradient-to-r from-slate-50 to-white shadow-md dark:from-slate-950 dark:to-slate-900">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs bg-primary/10 text-primary">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Calculate
                  </Badge>
                  <CardTitle className="text-3xl font-bold">Cost Calculator</CardTitle>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Compare performance metrics across various large language models and benchmarks.
              </p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LLMCostCalculator
