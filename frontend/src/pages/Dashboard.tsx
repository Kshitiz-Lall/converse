import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toolCategories } from '@/routes/index';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const ToolCard = ({ tool }: { tool: any }) => (
    <Card
      key={tool.id}
      className={`group relative cursor-pointer border rounded-lg transition-all duration-300 ${
        tool.available
          ? 'hover:border-primary/60 hover:shadow-sm'
          : 'opacity-60 pointer-events-none border-muted'
      }`}
      onClick={() => tool.available && navigate(tool.path)}
    >
      {/* Hover Overlay */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 pointer-events-none rounded-lg" />

      <div className="relative z-10 flex flex-col p-3 space-y-2 h-full">
        {/* Icon & Status */}
        <div className="flex items-center justify-between">
          <div className="text-primary text-2xl">{tool.icon}</div>
          {!tool.available && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>

        {/* Title & Description */}
        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-base font-semibold leading-tight text-foreground">
            {tool.title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-snug">
            {tool.description}
          </CardDescription>
        </CardHeader>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Footer Button */}
        <CardFooter className="p-0 pt-2">
          <Button
            variant={tool.available ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-between text-xs"
            disabled={!tool.available}
            onClick={e => {
              e.stopPropagation();
              if (tool.available) navigate(tool.path);
            }}
          >
            {tool.available ? 'Open Tool' : 'Coming Soon'}
            <ArrowRightIcon className="h-3 w-3" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-10 px-4">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Developer Toolkit</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            A curated set of tools for developers, engineers, and productivity enthusiasts.
          </p>
        </header>

        {toolCategories.map(category => (
          <section key={category.category} className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">{category.category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
