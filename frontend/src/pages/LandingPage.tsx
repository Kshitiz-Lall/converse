import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Settings, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const landingPageContent = {
  intro: 'DevToolkit',
  subtitle: 'Your Ultimate Companion in Software Development',
  description:
    'Welcome to DevToolkit, your ultimate companion in software development. Designed with developers, engineers, and DevOps professionals in mind, DevToolkit simplifies everyday tasks, accelerates your workflow, and enhances collaboration through a single, intuitive platform.',
  story:
    'DevToolkit was born from a simple yet powerful idea: developers deserve tools as innovative as the software they create. Recognizing the daily struggles of managing multiple tools and repetitive tasks, we created a comprehensive suite that empowers developers to focus on creativity, problem-solving, and collaboration. DevToolkit integrates seamlessly into your workflow, providing robust, AI-driven solutions to common development challenges.',
  features: [
    {
      icon: Zap,
      title: 'Developer Tools',
      items: [
        'Data Format Converter',
        'Image Optimizer',
        'Regex Playground',
        'Cron Expression Builder',
        'API Request Tester',
      ],
    },
    {
      icon: Cpu,
      title: 'AI-Powered Features',
      items: [
        'AI Debugger',
        'AI Test Case Generator',
        'Automated Code Refactoring',
        'AI-Based Stack Overflow Search',
      ],
    },
    {
      icon: Users,
      title: 'Project & Collaboration Tools',
      items: ['Issue & PR Summary Generator', 'Documentation Auto-Generator'],
    },
    {
      icon: Settings,
      title: 'DevOps & Automation Tools',
      items: ['Dockerfile Generator & Optimizer', 'CI/CD Config Generator', 'Server Log Analyzer'],
    },
  ],
  modular:
    "Built on a modular architecture, DevToolkit adapts and expands alongside your project's needs, ensuring you have the tools you require, precisely when you need them. Continually evolving, DevToolkit remains at the forefront of innovation, designed to enhance your productivity at every step.",
  cta: "Empower your workflow, simplify your tasks, and elevate your team's productivity.",
};

const LandingPage = () => (
  <div className="min-h-screen font-tertiary bg-background text-foreground">
    {/* Hero Section */}
    <div className="container mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-secondary text-primary font-extrabold mb-4">
        {landingPageContent.intro}
      </h1>
      <h1 className="text-2xl font-tertiary font-bold mb-4">{landingPageContent.subtitle}</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        {landingPageContent.description}
      </p>
      <div className="flex justify-center gap-4 mt-8">
        <Button asChild size="lg">
          <Link to="/signup">Get Started</Link>
        </Button>
        <Button asChild size="lg">
          <Link to="/login">Sign In!</Link>
        </Button>
      </div>
    </div>

    {/* Story Section */}
    <div className="py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-secondary mb-6">📖 Our Story</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 max-w-4xl mx-auto">
          {landingPageContent.story}
        </p>
      </div>
    </div>

    {/* Features Section */}
    <div className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-secondary text-center mb-12">
          🌟 Explore Our Powerful Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {landingPageContent.features.map(({ icon: Icon, title, items }) => (
            <Card key={title} className="shadow-md">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 mx-auto">
                  <Icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-tertiary mt-4 text-center">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-gray-600 dark:text-gray-300">
                  {items.map(item => (
                    <li key={item} className="my-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>

    {/* Modular Section */}
    <div className="py-16 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-secondary mb-6">Modular and Scalable</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 max-w-4xl mx-auto">
          {landingPageContent.modular}
        </p>
      </div>
    </div>

    {/* CTA Section */}
    <div className="bg-primary text-primary-foreground py-16 text-center">
      <h2 className="text-4xl font-secondary mb-4">Start Your Journey with DevToolkit Today!</h2>
      <p className="text-xl mb-6">{landingPageContent.cta}</p>
      <Button asChild size="lg" variant="secondary">
        <Link to="/signup">Sign Up for Free</Link>
      </Button>
    </div>
  </div>
);

export default LandingPage;
