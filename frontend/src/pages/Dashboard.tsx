import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { aiTools, devTools } from '@/routes/index';

export default function Dashboard() {
  const navigate = useNavigate();

  const aiToolsByCategory = aiTools.reduce<Record<string, typeof aiTools>>((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tool);
    return acc;
  }, {});

  // Update the ToolCard component type
  interface Tool {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    available: boolean;
  }

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card
      key={tool.id}
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg relative ${tool.available
        ? 'border-primary/20 hover:border-primary cursor-pointer group'
        : 'opacity-70 border-gray-200'
        }`}
      onClick={() => tool.available && navigate(tool.path)}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 pointer-events-none"></div>
      <div className="flex flex-row h-full relative z-10">
        <div className="w-1/3 flex items-center justify-center p-4 bg-primary/5">
          <div className="p-4 bg-primary/10 rounded-r-4xl text-4xl">{tool.icon}</div>
        </div>
        <div className="w-2/3 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-end">
              {!tool.available && (
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">
                  Coming Soon
                </span>
              )}
            </div>
            <CardTitle className="text-xl">{tool.title}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
          <div className="flex-grow"></div>
          <CardFooter className="pt-3">
            <Button
              variant={tool.available ? 'default' : 'outline'}
              className="w-full justify-between"
              disabled={!tool.available}
              onClick={e => {
                e.stopPropagation();
                if (tool.available) navigate(tool.path);
              }}
            >
              {tool.available ? 'Open Tool' : 'Coming Soon'}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Developer Toolkit</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A collection of essential tools for web developers and programmers
          </p>
        </header>

        {/* Developer Tools Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devTools.map(tool => (
              <ToolCard key={tool.id} tool={tool as Tool} />
            ))}
          </div>
        </section>

        {/* AI Tools Section with Accordion */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Tools</h2>
          <Accordion type="multiple" className="space-y-4">
            {Object.entries(aiToolsByCategory).map(([category, tools]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-lg font-medium text-gray-800">
                  {category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {tools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
